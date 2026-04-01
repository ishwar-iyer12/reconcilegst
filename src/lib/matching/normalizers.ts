import { MatchKey } from "./types";

export function normalizeGSTIN(raw: string): string {
  return raw.toUpperCase().trim().replace(/\s/g, "");
}

export function normalizeInvoiceNumber(raw: string): string {
  return raw
    .toUpperCase()
    .trim()
    .replace(/^0+/, "")
    .replace(/[\s\-\/\.]/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

export function makeMatchKey(gstin: string, invoiceNumber: string): MatchKey {
  return `${normalizeGSTIN(gstin)}::${normalizeInvoiceNumber(invoiceNumber)}` as MatchKey;
}

export function parseDate(raw: string): Date {
  // Handle DD-MM-YYYY or DD/MM/YYYY
  const parts = raw.split(/[-\/\.]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      // Use noon to prevent timezone offsets from shifting the date by one day
      return new Date(year, month, day, 12, 0, 0);
    }
  }
  // Fallback: parse and re-create at noon local to avoid timezone drift
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    throw new Error(`Cannot parse date: ${raw}`);
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

export function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
