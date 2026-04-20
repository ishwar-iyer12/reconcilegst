import * as XLSX from "xlsx";
import { NormalizedRecord } from "@/lib/matching/types";
import {
  normalizeGSTIN,
  normalizeInvoiceNumber,
} from "@/lib/matching/normalizers";
import { parseExcelDate } from "./excelDate";

type ColumnMatcher = (header: string) => boolean;

const COLUMN_MATCHERS: Record<string, ColumnMatcher> = {
  gstin: (h) => /gstin|gst\s*no|supplier.*gstin|gst.*in/i.test(h),
  invoiceNumber: (h) =>
    /inv.*no|invoice.*num|bill.*no|inv.*num|invoice.*no|inv.*#|invoice\s*number/i.test(
      h
    ),
  invoiceDate: (h) =>
    /inv.*date|date.*inv|bill.*date|invoice.*date/i.test(h),
  taxableValue: (h) => /taxable|net.*val|base.*amt|taxable.*val/i.test(h),
  cgst: (h) => /^cgst$|cgst.*amt|cgst.*amount|central\s*tax/i.test(h),
  sgst: (h) =>
    /^sgst$|sgst.*amt|sgst.*amount|state.*tax|state\s*\/\s*ut|ut\s*tax/i.test(
      h
    ),
  igst: (h) => /^igst$|igst.*amt|igst.*amount|integrated\s*tax/i.test(h),
  totalValue: (h) =>
    /total|gross|inv.*val|^amount$|total.*val|total.*amt|invoice\s*value/i.test(
      h
    ),
};

// Skip metadata sheets and also GSTR-2A-looking sheets, so a CA who uploads
// a combined utility workbook doesn't accidentally pull the 2A side as their
// purchase register.
const SKIP_SHEET_PATTERNS =
  /instruction|summary|^reco$|dashboard|master|help|^info|from\s*gov(t|ernment)?\s*portal|gstr[-\s]?2[ab]|2a\s*data|^b2b[a]?$|^cdn[ra]?$/i;

const PREFER_SHEET_PATTERNS =
  /purchase|register|our\s*records|as\s*per|client|records/i;

function cleanHeader(s: string): string {
  return s
    .replace(/\(₹\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreHeaderRow(row: unknown[]): {
  score: number;
  headers: string[];
} {
  const headers = row.map((c) => (c == null ? "" : cleanHeader(String(c))));
  const score = Object.values(COLUMN_MATCHERS).filter((m) =>
    headers.some((h) => h && m(h))
  ).length;
  return { score, headers };
}

function findHeaderRow(
  rows: unknown[][]
): { index: number; headers: string[]; score: number } | null {
  const maxScan = Math.min(rows.length, 25);
  let best: { index: number; headers: string[]; score: number } | null = null;
  for (let i = 0; i < maxScan; i++) {
    const { score, headers } = scoreHeaderRow(rows[i]);
    if (score >= 2 && (!best || score > best.score)) {
      best = { index: i, headers, score };
    }
  }
  return best;
}

function pickPurchaseRegisterSheet(wb: XLSX.WorkBook): {
  name: string;
  rows: unknown[][];
  headerIdx: number;
  headers: string[];
} {
  const candidates: {
    name: string;
    rows: unknown[][];
    headerIdx: number;
    headers: string[];
    score: number;
    preferred: boolean;
  }[] = [];

  for (const name of wb.SheetNames) {
    if (SKIP_SHEET_PATTERNS.test(name)) continue;
    const sheet = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: null,
      blankrows: false,
    });
    if (rows.length === 0) continue;
    const hit = findHeaderRow(rows);
    if (!hit) continue;
    candidates.push({
      name,
      rows,
      headerIdx: hit.index,
      headers: hit.headers,
      score: hit.score,
      preferred: PREFER_SHEET_PATTERNS.test(name),
    });
  }

  if (candidates.length === 0) {
    throw new Error(
      `Could not find a Purchase Register data sheet. Sheets scanned: ${wb.SheetNames.join(
        ", "
      )}. Expected columns like GSTIN and Invoice Number.`
    );
  }

  // Preferred sheet names win over higher-scoring but generic sheets.
  candidates.sort((a, b) => {
    if (a.preferred !== b.preferred) return a.preferred ? -1 : 1;
    return b.score - a.score;
  });

  const picked = candidates[0];
  return {
    name: picked.name,
    rows: picked.rows,
    headerIdx: picked.headerIdx,
    headers: picked.headers,
  };
}

export async function parsePurchaseRegister(
  file: File
): Promise<NormalizedRecord[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
    bookVBA: false,
  });

  const { rows, headerIdx, headers } = pickPurchaseRegisterSheet(wb);

  const colIdx: Record<string, number> = {};
  for (const [field, matcher] of Object.entries(COLUMN_MATCHERS)) {
    const idx = headers.findIndex((h) => h && matcher(h));
    if (idx !== -1) colIdx[field] = idx;
  }

  if (colIdx.gstin === undefined) {
    throw new Error(
      `Could not find GSTIN column. Detected headers: ${headers
        .filter(Boolean)
        .join(", ")}`
    );
  }
  if (colIdx.invoiceNumber === undefined) {
    throw new Error(
      `Could not find Invoice Number column. Detected headers: ${headers
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const records: NormalizedRecord[] = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const gstinVal = row[colIdx.gstin];
    const invNumVal = row[colIdx.invoiceNumber];
    if (!gstinVal || !invNumVal) continue;

    const gstin = normalizeGSTIN(String(gstinVal));
    const invoiceNumber = normalizeInvoiceNumber(String(invNumVal));

    let invoiceDate: Date;
    try {
      invoiceDate =
        colIdx.invoiceDate !== undefined
          ? parseExcelDate(row[colIdx.invoiceDate])
          : new Date();
    } catch {
      invoiceDate = new Date();
    }

    const taxableValue =
      colIdx.taxableValue !== undefined
        ? Number(row[colIdx.taxableValue]) || 0
        : 0;
    const cgst =
      colIdx.cgst !== undefined ? Number(row[colIdx.cgst]) || 0 : 0;
    const sgst =
      colIdx.sgst !== undefined ? Number(row[colIdx.sgst]) || 0 : 0;
    const igst =
      colIdx.igst !== undefined ? Number(row[colIdx.igst]) || 0 : 0;

    let totalValue: number;
    if (colIdx.totalValue !== undefined) {
      totalValue = Number(row[colIdx.totalValue]) || 0;
    } else {
      totalValue = taxableValue + cgst + sgst + igst;
    }

    const rawData: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      if (h) rawData[h] = row[idx];
    });

    records.push({
      gstin,
      invoiceNumber,
      invoiceDate,
      taxableValue,
      cgst,
      sgst,
      igst,
      totalValue,
      source: "purchase_register",
      rawData,
    });
  }

  return records;
}
