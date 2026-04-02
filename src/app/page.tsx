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
          <Link
            href="/reconcile"
            className="inline-block px-8 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
          >
            Try it now — free
          </Link>
          <p className="text-sm text-slate-400">No signup required. Export needs an email.</p>
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
