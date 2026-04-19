"use client";

import { useState } from "react";
import Link from "next/link";
import { useReconciliation } from "@/hooks/useReconciliation";
import UploadPanel from "@/components/upload/UploadPanel";
import SummaryCards from "@/components/results/SummaryCards";
import ResultsTabs from "@/components/results/ResultsTabs";
import EmailCaptureModal from "@/components/EmailCaptureModal";

export default function ReconcilePage() {
  const {
    gstr2aFile,
    prFile,
    loading,
    error,
    result,
    setGSTR2AFile,
    setPRFile,
    runReconciliation,
    handleExport,
    reset,
  } = useReconciliation();

  const [showEmailModal, setShowEmailModal] = useState(false);

  function onExportClick() {
    setShowEmailModal(true);
  }

  function onEmailSubmit(email: string) {
    // Store email in localStorage so we don't ask again
    localStorage.setItem("gst_recon_email", email);
    setShowEmailModal(false);
    handleExport();
  }

  function onExport() {
    const savedEmail = localStorage.getItem("gst_recon_email");
    if (savedEmail) {
      handleExport();
    } else {
      onExportClick();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link href="/" className="text-lg font-bold text-slate-900">
            GST Recon
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reconciliation</h2>
            <p className="text-sm text-slate-500 mt-1">
              Upload your GSTR-2A and Purchase Register files to begin
            </p>
          </div>
          {result && (
            <div className="flex gap-3">
              <button
                onClick={onExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Export as Excel
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
              >
                New Reconciliation
              </button>
            </div>
          )}
        </div>

        {!result && (
          <>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Your files never leave your browser
                </p>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Reconciliation runs entirely on your device. We never upload, store, or see your GSTR-2A or Purchase Register data.
                </p>
              </div>
            </div>
            <UploadPanel
              gstr2aFile={gstr2aFile}
              prFile={prFile}
              onGSTR2ASelect={setGSTR2AFile}
              onPRSelect={setPRFile}
              onReconcile={runReconciliation}
              loading={loading}
            />
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={reset}
              className="mt-3 text-sm text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {result && (
          <>
            <SummaryCards summary={result.summary} />
            <ResultsTabs result={result} />
          </>
        )}
      </main>

      <EmailCaptureModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={onEmailSubmit}
      />
    </div>
  );
}
