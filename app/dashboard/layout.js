"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthUser } from "@/lib/authUser";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/"); // back to login
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div
          className="
          px-6 py-4 sm:px-8 sm:py-6
          rounded-3xl border border-white/25 bg-white/10
          backdrop-blur-xl
          shadow-xl shadow-slate-900/40
          text-white text-sm font-light
        "
        >
          Loading your dashboard…
        </div>
      </main>
    );
  }

  if (!user) {
    // Redirect already triggered in hook; render nothing here
    return null;
  }

  const displayName = user.user_metadata?.full_name || user.email || "User";

  return (
    <main className="min-h-screen flex flex-col">
      {/* Glass header */}
      <header className="w-full flex justify-end p-4">
        <div
          className="
            flex items-center gap-3
            px-4 py-2 rounded-2xl
            border border-white/30 bg-white/10
            backdrop-blur-xl
            shadow-md shadow-slate-900/30
            text-white
          "
        >
          {/* Initial bubble */}
          <div
            className="
              w-8 h-8 rounded-full
              bg-white/20 flex items-center justify-center
              text-xs font-semibold
            "
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <span className="text-xs sm:text-sm font-light">{displayName}</span>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              text-[11px] sm:text-xs
              px-3 py-1 rounded-2xl
              bg-white/90 text-slate-900
              hover:bg-white hover:cursor-pointer transition-colors
              shadow-sm shadow-slate-900/20
            "
          >
            Logout
          </button>
        </div>
      </header>

      {/* All dashboard pages render here */}
      <section className="flex-1 p-4">{children}</section>
    </main>
  );
}
