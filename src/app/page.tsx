"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "./NavBar";

export default function Home() {
  const features = [
    {
      icon: "📝",
      title: "Free Invoice Generator",
      desc: "Build a clean invoice with line items, taxes, due dates, and notes in under a minute.",
    },
    {
      icon: "📄",
      title: "Export to PDF",
      desc: "Download a polished PDF that is ready to send to clients right away.",
    },
    {
      icon: "📊",
      title: "Save & Track Later",
      desc: "Create invoices free now, then sign up when you want invoice history, search, and status tracking.",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      desc: "Start without signup. Create a free account only when you want cloud sync and saved invoice history.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "No loading screens. No bloat. Just open the page and start invoicing.",
    },
    {
      icon: "🎨",
      title: "Professional Look",
      desc: "Clean, modern invoice design that makes your business look polished.",
    },
  ];
  const seoLinks = [
    {
      href: "/free-invoice-generator",
      title: "Free Invoice Generator",
      description: "See how Duxbill helps freelancers and small businesses create invoices online without signup.",
    },
    {
      href: "/freelance-invoice-template",
      title: "Freelance Invoice Template",
      description: "Learn what to include when billing freelance services, retainers, and project work.",
    },
    {
      href: "/how-to-create-an-invoice",
      title: "How to Create an Invoice",
      description: "Use a practical checklist to make invoices clearer and easier for clients to pay.",
    },
    {
      href: "/invoice-template-for-contractors",
      title: "Invoice Template for Contractors",
      description: "See how to bill labor, materials, deposits, and job phases with less confusion.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <NavBar />

      {/* Hero */}
      <main className="flex-1 px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto grid gap-12 items-center lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left space-y-8">
            <Image src="/duxbill-nav.png?v=2" alt="Duxbill" width={560} height={160} className="h-20 sm:h-28 w-auto mx-auto lg:mx-0 opacity-80" priority />
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-400 font-medium">
              Free invoice generator for freelancers and small businesses
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
              Create a professional invoice
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                in under a minute.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Generate free invoices online, add line items and tax, export a polished PDF, and send it to your client fast. No signup required to start.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/invoices/new"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
              >
                Create Free Invoice
              </Link>
              <Link
                href="/signup?redirect=/invoices"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors w-full sm:w-auto"
              >
                Create Free Account
              </Link>
            </div>
            <p className="text-xs text-zinc-600 pt-2">
              No credit card · No signup to start · PDF export included
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/50 p-6 sm:p-8 space-y-5 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-300">Why people use Duxbill</p>
                <p className="text-xs text-zinc-500 mt-1">Built for solo operators who need to bill quickly.</p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                Start free
              </span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <p className="text-sm font-semibold text-white">1. Create invoice now</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Add your business info, client details, services, tax, and payment notes in one flow.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <p className="text-sm font-semibold text-white">2. Export and send the PDF</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Download a clean invoice you can email immediately after finishing the work.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm font-semibold text-white">3. Sign up when you want more</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Create a free account to keep invoice history in the cloud, then upgrade later if you need tracking and more styles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-zinc-800/50 px-6 py-24 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to invoice and get paid
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Simple invoicing for freelancers, consultants, contractors, and other small businesses. No accounting-software overhead.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6 space-y-3 hover:border-zinc-700 transition-colors"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Guides and templates that lead back to invoicing
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              If you found Duxbill while researching invoice templates or billing advice, these pages will help you tighten the details and then create the invoice right away.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {seoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
              >
                <h3 className="font-semibold text-white">{link.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Image src="/duxbill-nav.png?v=2" alt="Duxbill" width={448} height={128} className="h-16 w-auto mx-auto opacity-40" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Start with a free invoice. Save and track when you&apos;re ready.
          </h2>
          <p className="text-zinc-400">
            Duxbill is designed so you can create the invoice first, then create an account only if you want archive, search, and cloud sync.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/invoices/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
            >
              Start Free Invoice
            </Link>
            <Link
              href="/signup?redirect=/invoices"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors w-full sm:w-auto"
            >
              Sign Up to Save Invoices
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-Promo: Tools */}
      <section className="border-t border-zinc-800/50 px-6 py-16 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-3">
            More Free Tools for Freelancers
          </h2>
          <p className="text-zinc-400 text-center mb-10 text-sm">
            We build simple, free tools so you can focus on your work.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <a
              href="https://qrcode.tools.woodstockaie.com"
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/80 p-6 space-y-2 hover:border-emerald-500/50 transition-colors group"
            >
              <span className="text-2xl">📱</span>
              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                QR Code Generator
              </h3>
              <p className="text-sm text-zinc-400">
                Create QR codes instantly. Custom sizes, PNG download, no signup.
              </p>
            </a>
            <a
              href="https://woodstockaie.gumroad.com"
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/80 p-6 space-y-2 hover:border-blue-500/50 transition-colors group"
            >
              <span className="text-2xl">🧰</span>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                Freelancer Toolkit
              </h3>
              <p className="text-sm text-zinc-400">
                AI prompts, outreach templates, pricing guides, and more — all under $10.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-8 text-center text-xs text-zinc-500">
        <Image src="/duxbill-nav.png?v=2" alt="Duxbill" width={224} height={64} className="h-8 w-auto mx-auto mb-3 opacity-30" />
        <p>Duxbill — Built for freelancers who value their time.</p>
        <p className="mt-2 text-zinc-600">
          Your invoices, your data. Always private.
        </p>
      </footer>
    </div>
  );
}
