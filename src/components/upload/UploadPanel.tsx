"use client";

import FileUploadZone from "./FileUploadZone";

interface UploadPanelProps {
  gstr2aFile: File | null;
  prFile: File | null;
  onGSTR2ASelect: (file: File) => void;
  onPRSelect: (file: File) => void;
  onReconcile: () => void;
  loading: boolean;
}

export default function UploadPanel({
  gstr2aFile,
  prFile,
  onGSTR2ASelect,
  onPRSelect,
  onReconcile,
  loading,
}: UploadPanelProps) {
  const canReconcile = gstr2aFile && prFile && !loading;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadZone
          label="GSTR-2A File"
          accept=".json,.xlsx,.xls,.csv"
          hint="Drop your GSTR-2A JSON or Excel file here (straight from the portal)"
          file={gstr2aFile}
          onFileSelect={onGSTR2ASelect}
        />
        <FileUploadZone
          label="Purchase Register Excel"
          accept=".xlsx,.xls,.csv"
          hint="Drop your Purchase Register Excel file here or click to browse"
          file={prFile}
          onFileSelect={onPRSelect}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
        <span>No real data handy?</span>
        <a
          href="/samples/sample-gstr2a.json"
          download
          className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Sample GSTR-2A
        </a>
        <a
          href="/samples/sample-purchase-register.xlsx"
          download
          className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Sample Purchase Register
        </a>
      </div>
      <div className="flex justify-center">
        <button
          onClick={onReconcile}
          disabled={!canReconcile}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Reconciling...
            </span>
          ) : (
            "Reconcile"
          )}
        </button>
      </div>
    </div>
  );
}
