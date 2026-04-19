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
    /inv.*no|invoice.*num|bill.*no|inv.*num|invoice.*no|inv.*#/i.test(h),
  invoiceDate: (h) =>
    /inv.*date|date.*inv|bill.*date|invoice.*date/i.test(h),
  taxableValue: (h) => /taxable|net.*val|base.*amt|taxable.*val/i.test(h),
  cgst: (h) => /^cgst$|cgst.*amt|cgst.*amount/i.test(h),
  sgst: (h) => /^sgst$|sgst.*amt|sgst.*amount/i.test(h),
  igst: (h) => /^igst$|igst.*amt|igst.*amount/i.test(h),
  totalValue: (h) =>
    /total|gross|inv.*val|^amount$|total.*val|total.*amt/i.test(h),
};

function mapColumns(
  headers: string[]
): Record<string, string | null> {
  const mapping: Record<string, string | null> = {};

  for (const [field, matcher] of Object.entries(COLUMN_MATCHERS)) {
    const match = headers.find(matcher);
    mapping[field] = match || null;
  }

  return mapping;
}

export async function parsePurchaseRegister(
  file: File
): Promise<NormalizedRecord[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    throw new Error("Purchase Register Excel file is empty");
  }

  const headers = Object.keys(rows[0]);
  const colMap = mapColumns(headers);

  if (!colMap.gstin) {
    throw new Error(
      `Could not find GSTIN column. Available columns: ${headers.join(", ")}`
    );
  }
  if (!colMap.invoiceNumber) {
    throw new Error(
      `Could not find Invoice Number column. Available columns: ${headers.join(", ")}`
    );
  }

  const records: NormalizedRecord[] = [];

  for (const row of rows) {
    const gstinVal = row[colMap.gstin!];
    const invNumVal = row[colMap.invoiceNumber!];

    if (!gstinVal || !invNumVal) continue;

    const gstin = normalizeGSTIN(String(gstinVal));
    const invoiceNumber = normalizeInvoiceNumber(String(invNumVal));

    let invoiceDate: Date;
    try {
      invoiceDate = colMap.invoiceDate
        ? parseExcelDate(row[colMap.invoiceDate])
        : new Date();
    } catch {
      invoiceDate = new Date();
    }

    const taxableValue = colMap.taxableValue
      ? Number(row[colMap.taxableValue]) || 0
      : 0;
    const cgst = colMap.cgst ? Number(row[colMap.cgst]) || 0 : 0;
    const sgst = colMap.sgst ? Number(row[colMap.sgst]) || 0 : 0;
    const igst = colMap.igst ? Number(row[colMap.igst]) || 0 : 0;

    let totalValue: number;
    if (colMap.totalValue) {
      totalValue = Number(row[colMap.totalValue]) || 0;
    } else {
      totalValue = taxableValue + cgst + sgst + igst;
    }

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
      rawData: row,
    });
  }

  return records;
}
