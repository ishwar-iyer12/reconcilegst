import * as XLSX from "xlsx";
import { ReconciliationResult } from "@/lib/matching/types";
import { formatDate } from "@/lib/matching/normalizers";

export function exportReconciliation(result: ReconciliationResult): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ["GST Reconciliation Report"],
    ["Generated", new Date().toLocaleDateString("en-IN")],
    [],
    ["Metric", "Count"],
    ["Total GSTR-2A Records", result.summary.totalGSTR2A],
    ["Total Purchase Register Records", result.summary.totalPR],
    ["Matched", result.summary.matchedCount],
    ["Mismatched", result.summary.mismatchedCount],
    ["Missing in Purchase Register", result.summary.missingInPRCount],
    ["Missing in GSTR-2A", result.summary.missingInGSTRCount],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(summaryData),
    "Summary"
  );

  // Sheet 2: Matched
  const matchedRows = result.matched.map((rec) => ({
    GSTIN: rec.gstr2a.gstin,
    "Invoice No": rec.gstr2a.invoiceNumber,
    "GSTR-2A Date": formatDate(rec.gstr2a.invoiceDate),
    "PR Date": formatDate(rec.purchaseRegister.invoiceDate),
    "GSTR-2A Amount": rec.gstr2a.totalValue,
    "PR Amount": rec.purchaseRegister.totalValue,
    "GSTR-2A Taxable": rec.gstr2a.taxableValue,
    "PR Taxable": rec.purchaseRegister.taxableValue,
    "GSTR-2A CGST": rec.gstr2a.cgst,
    "PR CGST": rec.purchaseRegister.cgst,
    "GSTR-2A SGST": rec.gstr2a.sgst,
    "PR SGST": rec.purchaseRegister.sgst,
    "GSTR-2A IGST": rec.gstr2a.igst,
    "PR IGST": rec.purchaseRegister.igst,
  }));
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(matchedRows.length > 0 ? matchedRows : [{ Message: "No matched records" }]),
    "Matched"
  );

  // Sheet 3: Mismatched
  const mismatchedRows = result.mismatched.map((rec) => ({
    GSTIN: rec.gstr2a.gstin,
    "Invoice No": rec.gstr2a.invoiceNumber,
    "GSTR-2A Date": formatDate(rec.gstr2a.invoiceDate),
    "PR Date": formatDate(rec.purchaseRegister.invoiceDate),
    "GSTR-2A Amount": rec.gstr2a.totalValue,
    "PR Amount": rec.purchaseRegister.totalValue,
    "GSTR-2A CGST": rec.gstr2a.cgst,
    "PR CGST": rec.purchaseRegister.cgst,
    "GSTR-2A SGST": rec.gstr2a.sgst,
    "PR SGST": rec.purchaseRegister.sgst,
    "GSTR-2A IGST": rec.gstr2a.igst,
    "PR IGST": rec.purchaseRegister.igst,
    "Mismatch Reasons": rec.reasons.map((r) => r.description).join(" | "),
  }));
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(mismatchedRows.length > 0 ? mismatchedRows : [{ Message: "No mismatched records" }]),
    "Mismatched"
  );

  // Sheet 4: Missing in PR
  const missingPRRows = result.missingInPR.map((rec) => ({
    GSTIN: rec.record.gstin,
    "Invoice No": rec.record.invoiceNumber,
    Date: formatDate(rec.record.invoiceDate),
    Amount: rec.record.totalValue,
    Taxable: rec.record.taxableValue,
    CGST: rec.record.cgst,
    SGST: rec.record.sgst,
    IGST: rec.record.igst,
    "Present In": "GSTR-2A",
    "Missing From": "Purchase Register",
  }));
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(missingPRRows.length > 0 ? missingPRRows : [{ Message: "No records missing in PR" }]),
    "Missing in PR"
  );

  // Sheet 5: Missing in GSTR-2A
  const missingGSTRRows = result.missingInGSTR.map((rec) => ({
    GSTIN: rec.record.gstin,
    "Invoice No": rec.record.invoiceNumber,
    Date: formatDate(rec.record.invoiceDate),
    Amount: rec.record.totalValue,
    Taxable: rec.record.taxableValue,
    CGST: rec.record.cgst,
    SGST: rec.record.sgst,
    IGST: rec.record.igst,
    "Present In": "Purchase Register",
    "Missing From": "GSTR-2A",
  }));
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(missingGSTRRows.length > 0 ? missingGSTRRows : [{ Message: "No records missing in GSTR-2A" }]),
    "Missing in GSTR-2A"
  );

  const today = new Date();
  const filename = `GST_Reconciliation_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.xlsx`;
  XLSX.writeFile(wb, filename);
}
