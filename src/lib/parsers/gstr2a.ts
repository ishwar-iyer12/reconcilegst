import * as XLSX from "xlsx";
import { NormalizedRecord } from "@/lib/matching/types";
import {
  normalizeGSTIN,
  normalizeInvoiceNumber,
  parseDate,
} from "@/lib/matching/normalizers";
import { parseExcelDate } from "./excelDate";

// ---------------- JSON parser ----------------

interface GSTR2ATaxDetail {
  txval?: number;
  camt?: number;
  samt?: number;
  iamt?: number;
  csamt?: number;
  ssamt?: number;
}

interface GSTR2AInvoiceItem {
  num?: number;
  itm_det?: GSTR2ATaxDetail;
  txval?: number;
  camt?: number;
  samt?: number;
  iamt?: number;
  csamt?: number;
  ssamt?: number;
}

interface GSTR2AInvoice {
  inum: string;
  idt: string;
  val: number;
  itms?: GSTR2AInvoiceItem[];
}

interface GSTR2ASupplier {
  ctin: string;
  inv: GSTR2AInvoice[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractB2B(json: any): GSTR2ASupplier[] {
  if (json?.data?.docdata?.b2b) return json.data.docdata.b2b;
  if (json?.docdata?.b2b) return json.docdata.b2b;
  if (json?.b2b) return json.b2b;
  if (Array.isArray(json) && json.length > 0 && json[0].ctin) return json;
  throw new Error(
    "Could not find B2B data in GSTR-2A JSON. Expected path: data.docdata.b2b or b2b"
  );
}

async function parseGSTR2AJson(file: File): Promise<NormalizedRecord[]> {
  const text = await file.text();
  const json = JSON.parse(text);
  const suppliers = extractB2B(json);
  const records: NormalizedRecord[] = [];

  for (const supplier of suppliers) {
    const gstin = normalizeGSTIN(supplier.ctin);

    for (const inv of supplier.inv) {
      let taxableValue = 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (inv.itms && inv.itms.length > 0) {
        for (const item of inv.itms) {
          const det: GSTR2ATaxDetail = item.itm_det || item;
          taxableValue += det.txval || 0;
          cgst += det.camt || det.csamt || 0;
          sgst += det.samt || det.ssamt || 0;
          igst += det.iamt || 0;
        }
      }

      records.push({
        gstin,
        invoiceNumber: normalizeInvoiceNumber(inv.inum),
        invoiceDate: parseDate(inv.idt),
        taxableValue,
        cgst,
        sgst,
        igst,
        totalValue: inv.val,
        source: "gstr2a",
        rawData: inv as unknown as Record<string, unknown>,
      });
    }
  }

  return records;
}

// ---------------- Excel parser ----------------

type ColumnMatcher = (header: string) => boolean;

const EXCEL_COLUMN_MATCHERS: Record<string, ColumnMatcher> = {
  gstin: (h) =>
    /gstin.*supplier|supplier.*gstin|gstin\s*\/\s*uin|^gstin$|^gst\s*in$|gst\s*no/i.test(
      h
    ),
  invoiceNumber: (h) =>
    /invoice\s*number|invoice\s*no|inv\s*no|bill\s*no|inv\s*num|^inv$/i.test(h),
  invoiceDate: (h) =>
    /invoice\s*date|inv\s*date|bill\s*date|date\s*of\s*invoice/i.test(h),
  totalValue: (h) =>
    /invoice\s*value|total\s*value|total\s*amount|invoice\s*amount|inv\s*val/i.test(
      h
    ),
  taxableValue: (h) => /taxable\s*value|taxable\s*amount|^taxable$/i.test(h),
  igst: (h) => /integrated\s*tax|^igst|^i\.?g\.?s\.?t\.?/i.test(h),
  cgst: (h) => /central\s*tax|^cgst|^c\.?g\.?s\.?t\.?/i.test(h),
  sgst: (h) =>
    /state.*tax|state\s*\/\s*ut|^sgst|^s\.?g\.?s\.?t\.?|ut\s*tax/i.test(h),
};

function cleanHeader(s: string): string {
  return s
    .replace(/\(₹\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findHeaderRow(rows: unknown[][]): { index: number; headers: string[] } {
  const maxScan = Math.min(rows.length, 25);
  for (let i = 0; i < maxScan; i++) {
    const cells = rows[i].map((c) => (c == null ? "" : cleanHeader(String(c))));
    const matches = Object.values(EXCEL_COLUMN_MATCHERS).filter((m) =>
      cells.some((c) => c && m(c))
    ).length;
    if (matches >= 3) return { index: i, headers: cells };
  }
  throw new Error(
    "Could not locate header row in GSTR-2A Excel. Expected columns like GSTIN, Invoice Number, Invoice Date, Taxable Value, Integrated/Central/State Tax."
  );
}

function pickB2BSheet(wb: XLSX.WorkBook): string {
  const exact = wb.SheetNames.find((n) => /^b2b$/i.test(n.trim()));
  if (exact) return exact;
  const b2b = wb.SheetNames.find(
    (n) => /b2b/i.test(n) && !/b2ba|amend/i.test(n)
  );
  if (b2b) return b2b;
  return wb.SheetNames[0];
}

interface AggregatedInvoice {
  gstin: string;
  invoiceNumber: string;
  invoiceDate: Date;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
  rawData: Record<string, unknown>;
}

async function parseGSTR2AExcel(file: File): Promise<NormalizedRecord[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = pickB2BSheet(wb);
  const sheet = wb.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  if (rows.length === 0) {
    throw new Error("GSTR-2A Excel file is empty.");
  }

  const { index: headerIdx, headers } = findHeaderRow(rows);

  const colIdx: Record<string, number> = {};
  for (const [field, matcher] of Object.entries(EXCEL_COLUMN_MATCHERS)) {
    const idx = headers.findIndex((h) => h && matcher(h));
    if (idx !== -1) colIdx[field] = idx;
  }

  if (colIdx.gstin === undefined || colIdx.invoiceNumber === undefined) {
    throw new Error(
      `GSTR-2A Excel missing required columns (GSTIN and Invoice Number). Detected headers: ${headers
        .filter(Boolean)
        .join(", ")}`
    );
  }

  // GSTR-2A Excel emits one row per tax-rate line within an invoice.
  // Aggregate by (GSTIN, Invoice Number), summing tax values and taxable value.
  const invoiceMap = new Map<string, AggregatedInvoice>();

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const gstinVal = row[colIdx.gstin];
    const invNumVal = row[colIdx.invoiceNumber];
    if (!gstinVal || !invNumVal) continue;

    const gstin = normalizeGSTIN(String(gstinVal));
    const invoiceNumber = normalizeInvoiceNumber(String(invNumVal));
    const key = `${gstin}::${invoiceNumber}`;

    const taxable =
      colIdx.taxableValue !== undefined
        ? Number(row[colIdx.taxableValue]) || 0
        : 0;
    const cgst =
      colIdx.cgst !== undefined ? Number(row[colIdx.cgst]) || 0 : 0;
    const sgst =
      colIdx.sgst !== undefined ? Number(row[colIdx.sgst]) || 0 : 0;
    const igst =
      colIdx.igst !== undefined ? Number(row[colIdx.igst]) || 0 : 0;
    const total =
      colIdx.totalValue !== undefined
        ? Number(row[colIdx.totalValue]) || 0
        : 0;

    let invoiceDate: Date;
    try {
      invoiceDate =
        colIdx.invoiceDate !== undefined
          ? parseExcelDate(row[colIdx.invoiceDate])
          : new Date();
    } catch {
      invoiceDate = new Date();
    }

    const existing = invoiceMap.get(key);
    if (existing) {
      existing.taxableValue += taxable;
      existing.cgst += cgst;
      existing.sgst += sgst;
      existing.igst += igst;
      // Invoice value is repeated on every tax line — keep the observed max.
      if (total > existing.totalValue) existing.totalValue = total;
    } else {
      const rawData: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        if (h) rawData[h] = row[idx];
      });
      invoiceMap.set(key, {
        gstin,
        invoiceNumber,
        invoiceDate,
        taxableValue: taxable,
        cgst,
        sgst,
        igst,
        totalValue: total,
        rawData,
      });
    }
  }

  const records: NormalizedRecord[] = [];
  for (const inv of invoiceMap.values()) {
    records.push({
      gstin: inv.gstin,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      taxableValue: inv.taxableValue,
      cgst: inv.cgst,
      sgst: inv.sgst,
      igst: inv.igst,
      totalValue:
        inv.totalValue ||
        inv.taxableValue + inv.cgst + inv.sgst + inv.igst,
      source: "gstr2a",
      rawData: inv.rawData,
    });
  }

  return records;
}

// ---------------- Dispatcher ----------------

export async function parseGSTR2A(file: File): Promise<NormalizedRecord[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".json")) return parseGSTR2AJson(file);
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    return parseGSTR2AExcel(file);
  }
  throw new Error(
    `Unsupported GSTR-2A file type: ${file.name}. Upload a .json, .xlsx, .xls, or .csv file.`
  );
}
