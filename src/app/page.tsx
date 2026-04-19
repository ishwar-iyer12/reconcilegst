import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="text-lg font-bold text-slate-900">GST Recon</span>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/login"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            GST reconciliation that never sees your data
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Built for CAs managing multiple client GSTINs. Drop in a GSTR-2A and
            Purchase Register — we match invoices, flag mismatches, and surface
            missing entries, all inside your browser. No uploads, no accounts,
            no data-handoff anxiety.
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
              <svg
                className="h-4 w-4 text-emerald-600"
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
              100% private — your files never leave your browser
            </div>
            <a
              href="https://github.com/ishwar-iyer12/reconcilegst"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 hover:underline"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.03 11.03 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.79.56 4.57-1.52 7.85-5.83 7.85-10.9C23.5 5.73 18.27.5 12 .5z" />
              </svg>
              Verify the code yourself on GitHub
            </a>
          </div>
          <Link
            href="/reconcile"
            className="inline-block px-8 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
          >
            Try it now — free
          </Link>
          <p className="text-sm text-slate-400">
            No signup required. Email collected at export is only used to send
            you the file — never shared, never marketed to.
          </p>

          <div className="pt-4 border-t border-slate-200 max-w-md mx-auto">
            <p className="text-sm font-medium text-slate-700 mb-3">
              No real data handy? Try with sample files
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="/samples/sample-gstr2a.json"
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Sample GSTR-2A (JSON)
              </a>
              <a
                href="/samples/sample-purchase-register.xlsx"
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Sample Purchase Register (Excel)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Upload files</h3>
            <p className="text-sm text-slate-600">
              Drop your GSTR-2A JSON (from the GST portal) and Purchase Register
              Excel file.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Auto-reconcile</h3>
            <p className="text-sm text-slate-600">
              Invoices are matched by GSTIN, invoice number, amount, and date
              with fuzzy tolerance.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Review & export</h3>
            <p className="text-sm text-slate-600">
              See matched, mismatched, and missing records. Export the full
              report as Excel.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/ishwar-iyer-a33b9a1b4/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              Ishwar Iyer
            </a>
          </span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <a
            href="https://github.com/ishwar-iyer12/reconcilegst"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 hover:underline"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.03 11.03 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.79.56 4.57-1.52 7.85-5.83 7.85-10.9C23.5 5.73 18.27.5 12 .5z" />
            </svg>
            Open source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
