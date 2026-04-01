"use client";

import { useState } from "react";
import { ReconciliationResult } from "@/lib/matching/types";
import MatchedTable from "./MatchedTable";
import MismatchedTable from "./MismatchedTable";
import MissingTable from "./MissingTable";

interface ResultsTabsProps {
  result: ReconciliationResult;
}

type TabId = "matched" | "mismatched" | "missing";

const tabs: { id: TabId; label: string }[] = [
  { id: "matched", label: "Matched" },
  { id: "mismatched", label: "Mismatched" },
  { id: "missing", label: "Missing" },
];

export default function ResultsTabs({ result }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("matched");

  const counts: Record<TabId, number> = {
    matched: result.summary.matchedCount,
    mismatched: result.summary.mismatchedCount,
    missing: result.summary.missingInPRCount + result.summary.missingInGSTRCount,
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${
              activeTab === tab.id
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>
      <div className="p-0">
        {activeTab === "matched" && <MatchedTable records={result.matched} />}
        {activeTab === "mismatched" && (
          <MismatchedTable records={result.mismatched} />
        )}
        {activeTab === "missing" && (
          <MissingTable
            missingInPR={result.missingInPR}
            missingInGSTR={result.missingInGSTR}
          />
        )}
      </div>
    </div>
  );
}
