import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-slate-900">
          GST Reconciliation
        </h1>
        <p className="text-lg text-slate-600">
          Upload your GSTR-2A JSON and Purchase Register Excel to automatically
          reconcile records with fuzzy matching on amounts and dates.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
