"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-lg font-bold text-slate-900">
            GST Reconciliation
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
