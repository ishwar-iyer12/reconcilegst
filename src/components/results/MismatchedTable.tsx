"use client";

import { useState } from "react";
import { MismatchedRecord } from "@/lib/matching/types";
import { formatDate, formatCurrency } from "@/lib/matching/normalizers";

const PAGE_SIZE = 50;

const REASON_COLORS: Record<string, string> = {
  amount: "bg-amber-100 text-amber-800",
  date: "bg-yellow-100 text-yellow-800",
  cgst: "bg-red-100 text-red-800",
  sgst: "bg-red-100 text-red-800",
  igst: "bg-red-100 text-red-800",
};

interface MismatchedTableProps {
  records: MismatchedRecord[];
}

export default function MismatchedTable({ records }: MismatchedTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const pageRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (records.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">No mismatched records found.</p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">GSTIN</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Invoice No</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">GSTR-2A Date</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">PR Date</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">GSTR-2A Amt</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">PR Amt</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Mismatch Reasons</th>
            </tr>
          </thead>
          <tbody>
            {pageRecords.map((rec, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                <td className="px-4 py-3 font-mono text-xs">{rec.gstr2a.gstin}</td>
                <td className="px-4 py-3">{rec.gstr2a.invoiceNumber}</td>
                <td className="px-4 py-3">{formatDate(rec.gstr2a.invoiceDate)}</td>
                <td className="px-4 py-3">{formatDate(rec.purchaseRegister.invoiceDate)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(rec.gstr2a.totalValue)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(rec.purchaseRegister.totalValue)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {rec.reasons.map((reason, j) => (
                      <span
                        key={j}
                        className={`inline-block px-2 py-1 text-xs rounded-full ${REASON_COLORS[reason.field] || "bg-slate-100 text-slate-700"}`}
                        title={reason.description}
                      >
                        {reason.description}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <span className="text-sm text-slate-500">
            Page {page + 1} of {totalPages} ({records.length} records)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-sm border rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm border rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
