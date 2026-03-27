"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveSettings, getSettings } from "@/lib/db";
import { UserTier } from "@/lib/types";
import { Suspense } from "react";

type VerifyState = "loading" | "verified" | "error";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const fallbackPlan = searchParams.get("plan") as UserTier | null;

  const [state, setState] = useState<VerifyState>("loading");
  const [plan, setPlan] = useState<string | null>(fallbackPlan);

  useEffect(() => {
    if (!sessionId) {
      // No session ID — use fallback plan param (legacy support)
      if (fallbackPlan === "pro" || fallbackPlan === "premium") {
        const settings = getSettings();
        if (fallbackPlan === "premium" || (fallbackPlan === "pro" && settings.tier === "free")) {
          saveSettings({ tier: fallbackPlan, stripeSessionId: undefined });
        }
        setState("verified");
      } else {
        setState("error");
      }
      return;
    }

    // Verify with Stripe
    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && (data.plan === "pro" || data.plan === "premium")) {
          const tier = data.plan as UserTier;
          setPlan(tier);
          const settings = getSettings();
          if (tier === "premium" || (tier === "pro" && settings.tier === "free")) {
            saveSettings({ tier, stripeSessionId: sessionId });
          }
          setState("verified");
        } else {
          setState("error");
        }
      })
      .catch(() => {
        setState("error");
      });
  }, [sessionId, fallbackPlan]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <img src="/duxbill-nav.png?v=2" alt="" className="h-20 w-auto mx-auto" />
          <div className="text-5xl animate-pulse">⏳</div>
          <h1 className="text-2xl font-bold">Verifying your payment...</h1>
          <p className="text-zinc-400">Just a moment while we confirm with Stripe.</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <img src="/duxbill-nav.png?v=2" alt="" className="h-20 w-auto mx-auto" />
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-zinc-400">
            We couldn&apos;t verify your payment. If you were charged, your subscription is active — 
            try refreshing or contact support.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/pricing"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Back to Pricing
            </Link>
            <Link
              href="/invoices/new"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 transition-colors"
            >
              Go to Invoicing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierName = plan === "premium" ? "Premium" : "Pro";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <img src="/duxbill-nav.png?v=2" alt="" className="h-20 w-auto mx-auto" />
        <div className="text-5xl">🎉</div>
        <h1 className="text-3xl font-bold">Welcome to Duxbill {tierName}!</h1>
        <p className="text-zinc-400">
          Your payment has been verified and all {tierName} features are now unlocked.
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/invoices/new"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Create an Invoice →
          </Link>
          <Link
            href="/invoices"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
