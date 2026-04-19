import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="text-lg font-bold text-slate-900">GST Recon</span>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
            Reconcile your GST returns in seconds
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Upload your GSTR-2A and Purchase Register. Our tool automatically
            matches invoices, flags mismatches, and finds missing entries — so
            you can file with confidence.
          </p>
          <div className="flex justify-center">
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
          </div>
          <Link
            href="/reconcile"
            className="inline-block px-8 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
          >
            Try it now — free
          </Link>
          <p className="text-sm text-slate-400">No signup required. Export needs an email.</p>

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
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        GST Recon — Built for Indian businesses
      </footer>
    </div>
  );
}
