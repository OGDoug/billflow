"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      monthly: "$0",
      annual: "$0",
      period: "forever",
      description: "Create unlimited invoices",
      features: [
        "Unlimited invoice creation",
        "PDF export",
        "Classic invoice style",
        "Client name, email, phone, address",
        "Items & services with tax",
      ],
      cta: "Current Plan",
      plan: null,
      highlight: false,
    },
    {
      name: "Pro",
      monthly: "$3",
      annual: "$30",
      monthlySub: "/month",
      annualSub: "/year",
      annualSavings: "Save $6/yr",
      description: "For freelancers who want to look professional",
      features: [
        "Everything in Free, plus:",
        "Invoice archive & search",
        "Sort & filter by client, status, date",
        "5 invoice styles",
        "Company logo on invoices",
        "Saved client profiles",
        "Mailing list with CSV export",
      ],
      cta: "Upgrade to Pro",
      plan: "pro",
      highlight: true,
    },
    {
      name: "Premium",
      monthly: "$6",
      annual: "$60",
      monthlySub: "/month",
      annualSub: "/year",
      annualSavings: "Save $12/yr",
      description: "For businesses that need to manage A/R",
      features: [
        "Everything in Pro, plus:",
        "A/R dashboard with alerts",
        "Overdue invoice tracking",
        "Due-soon warnings (3-day window)",
        "Mark as paid with notes",
        "Partial payment tracking",
        "Outstanding balance summary",
      ],
      cta: "Upgrade to Premium",
      plan: "premium",
      highlight: false,
    },
  ];

  const handleUpgrade = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="flex items-center gap-0.5">
            <img src="/duxbill-nav.png?v=2" alt="" className="h-6 w-auto" />
            <span><span className="text-white">Dux</span><span className="text-blue-500">bill</span></span>
          </span>
        </Link>
        <Link href="/invoices/new" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Back to invoicing
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <img src="/duxbill-nav.png?v=2" alt="" className="h-14 w-auto mx-auto mb-4 opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Simple, transparent pricing</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Free invoicing forever. Upgrade when you need more power.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billing === "annual" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Annual
              <span className="ml-1.5 rounded-full bg-green-600/20 px-2 py-0.5 text-xs text-green-400">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 space-y-6 ${
                plan.highlight
                  ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              {plan.highlight && (
                <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white -mt-1">
                  Most Popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">
                    {billing === "monthly" ? plan.monthly : plan.annual}
                  </span>
                  <span className="text-zinc-500 text-sm">
                    {plan.plan ? (billing === "monthly" ? plan.monthlySub : plan.annualSub) : plan.period}
                  </span>
                </div>
                {billing === "annual" && plan.annualSavings && (
                  <span className="inline-block mt-1 text-xs text-green-400">{plan.annualSavings}</span>
                )}
                <p className="text-sm text-zinc-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-400 mt-0.5">{i === 0 && plan.name !== "Free" ? "↑" : "✓"}</span>
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.plan ? (
                <button
                  onClick={() => handleUpgrade(plan.plan!)}
                  disabled={loading === plan.plan}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  } disabled:opacity-50`}
                >
                  {loading === plan.plan ? "Redirecting..." : plan.cta}
                </button>
              ) : (
                <Link
                  href="/invoices/new"
                  className="block w-full rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-400 text-center hover:bg-zinc-800/50 transition-colors"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-zinc-500">All plans include unlimited invoice creation. Cancel anytime.</p>
          <p className="text-xs text-zinc-600">Payments processed securely by Stripe.</p>
        </div>
      </main>
    </div>
  );
}
