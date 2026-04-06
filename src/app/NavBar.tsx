"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NavBar({ variant = "full" }: { variant?: "full" | "simple" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Note: Don't reset tier to "free" on sign out
    // The user's subscription is still active, they're just not authenticated
    // AuthSync will handle tier reset only if their subscription actually ends
    window.location.href = "/";
  };

  const logo = (
    <Link href="/" className="text-xl font-bold tracking-tight">
      <span className="flex items-center gap-0.5">
        <img src="/duxbill-nav.png?v=2" alt="" className="h-6 w-auto" />
        <span><span className="text-white">Dux</span><span className="text-blue-500">bill</span></span>
      </span>
    </Link>
  );

  if (variant === "simple") {
    return (
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        {logo}
        <div className="flex items-center gap-3">
          {!loading && user && (
            <button onClick={handleSignOut} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Sign Out
            </button>
          )}
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        {logo}
        <div className="flex items-center gap-3">
          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            {!loading && user ? (
              <>
                <Link href="/invoices" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/invoices/new" className="text-sm text-zinc-400 hover:text-white transition-colors">New Invoice</Link>
                <button onClick={handleSignOut} className="text-sm text-zinc-400 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Sign In</Link>
              </>
            )}
          </div>
          <Link
            href="/invoices/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Create Invoice
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden fixed top-[73px] left-0 right-0 border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-3 z-50 shadow-lg">
          {!loading && user ? (
            <>
              <span className="text-xs text-zinc-500 mb-2">Signed in as: {user.email}</span>
              <Link href="/invoices" className="text-sm text-zinc-300 hover:text-white transition-colors py-2 border-b border-zinc-800" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
              <Link href="/invoices/new" className="text-sm text-zinc-300 hover:text-white transition-colors py-2 border-b border-zinc-800" onClick={() => setMenuOpen(false)}>➕ New Invoice</Link>
              <Link href="/pricing" className="text-sm text-zinc-300 hover:text-white transition-colors py-2 border-b border-zinc-800" onClick={() => setMenuOpen(false)}>💎 Pricing</Link>
              <button 
                onClick={() => { handleSignOut(); setMenuOpen(false); }} 
                className="text-sm text-left text-red-400 hover:text-red-300 transition-colors py-3 font-medium bg-red-950/30 rounded border border-red-800/50"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors py-2" onClick={() => setMenuOpen(false)}>💎 Pricing</Link>
              <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors py-2" onClick={() => setMenuOpen(false)}>🔑 Sign In</Link>
              <Link href="/signup" className="text-sm text-blue-400 hover:text-blue-300 transition-colors py-2" onClick={() => setMenuOpen(false)}>✨ Create Account</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
