"use client";

import { useState } from "react";
import { MissingRecord } from "@/lib/matching/types";
import { formatDate, formatCurrency } from "@/lib/matching/normalizers";

const PAGE_SIZE = 50;

interface MissingTableProps {
  missingInPR: MissingRecord[];
  missingInGSTR: MissingRecord[];
}

export default function MissingTable({
  missingInPR,
  missingInGSTR,
}: MissingTableProps) {
  const [page, setPage] = useState(0);
  const allMissing = [
    ...missingInPR.map((r) => ({ ...r, label: "Missing in Purchase Register" })),
    ...missingInGSTR.map((r) => ({ ...r, label: "Missing in GSTR-2A" })),
  ];
  const totalPages = Math.ceil(allMissing.length / PAGE_SIZE);
  const pageRecords = allMissing.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (allMissing.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">No missing records found.</p>
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
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Missing From</th>
            </tr>
          </thead>
          <tbody>
            {pageRecords.map((rec, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{rec.record.gstin}</td>
                <td className="px-4 py-3">{rec.record.invoiceNumber}</td>
                <td className="px-4 py-3">{formatDate(rec.record.invoiceDate)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(rec.record.totalValue)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    rec.record.source === "gstr2a"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {rec.record.source === "gstr2a" ? "GSTR-2A" : "Purchase Register"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                    {rec.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <span className="text-sm text-slate-500">
            Page {page + 1} of {totalPages} ({allMissing.length} records)
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
