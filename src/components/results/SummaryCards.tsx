import { ReconciliationResult } from "@/lib/matching/types";

interface SummaryCardsProps {
  summary: ReconciliationResult["summary"];
}

const cards = [
  { key: "matchedCount" as const, label: "Matched", color: "bg-green-50 text-green-700 border-green-200" },
  { key: "mismatchedCount" as const, label: "Mismatched", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "missingInPRCount" as const, label: "Missing in PR", color: "bg-red-50 text-red-700 border-red-200" },
  { key: "missingInGSTRCount" as const, label: "Missing in GSTR-2A", color: "bg-blue-50 text-blue-700 border-blue-200" },
];

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-xl border p-4 ${card.color}`}
        >
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="text-2xl font-bold mt-1">{summary[card.key]}</p>
        </div>
      ))}
      <div className="col-span-2 md:col-span-4 flex gap-4 text-sm text-slate-500">
        <span>Total GSTR-2A: {summary.totalGSTR2A}</span>
        <span>Total PR: {summary.totalPR}</span>
      </div>
    </div>
  );
}
