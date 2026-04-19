import * as XLSX from "xlsx";
import { parseDate } from "@/lib/matching/normalizers";

export function parseExcelDate(value: unknown): Date {
  if (value instanceof Date) {
    return new Date(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
      12,
      0,
      0
    );
  }
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    return new Date(parsed.y, parsed.m - 1, parsed.d, 12, 0, 0);
  }
  if (typeof value === "string") {
    return parseDate(value);
  }
  throw new Error(`Cannot parse date value: ${value}`);
}
