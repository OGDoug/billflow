import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "📝",
      title: "Create Invoices",
      desc: "Professional invoices with line items, tax calculations, and custom notes — in under a minute.",
    },
    {
      icon: "📄",
      title: "Export to PDF",
      desc: "Download clean, print-ready PDFs with one click. Send them directly to your clients.",
    },
    {
      icon: "📊",
      title: "Track Status",
      desc: "Mark invoices as draft, sent, or paid. Always know where your money stands.",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      desc: "Your data stays in your browser. No accounts, no servers, no tracking.",
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <span className="text-xl font-bold tracking-tight">
          <img src="/duxbill-nav.png" alt="" className="h-7 w-auto inline-block" /><span className="text-white">Dux</span>
          <span className="text-blue-500">bill</span>
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/invoices"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/mailing-list"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Mailing List
          </Link>
          <Link
            href="/invoices/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Create Invoice
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-24 sm:py-32">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-400 font-medium">
            ✨ 100% Free — No signup required
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
            Invoicing that
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              just works.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create professional invoices in seconds. Export beautiful PDFs.
            Track payments. All from your browser — no account needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/invoices/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
            >
              Create Your First Invoice →
            </Link>
            <Link
              href="/invoices"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors w-full sm:w-auto"
            >
              View Dashboard
            </Link>
          </div>
          <p className="text-xs text-zinc-600 pt-2">
            No credit card · No signup · Works offline
          </p>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-zinc-800/50 px-6 py-24 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to get paid
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Simple tools that save you hours every month. No complexity, no learning curve.
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

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to get paid faster?
          </h2>
          <p className="text-zinc-400">
            Create your first invoice in under 60 seconds. Completely free.
          </p>
          <Link
            href="/invoices/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Invoicing — It&apos;s Free
          </Link>
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
              href="https://free-qr-gen.vercel.app"
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
        <p>Duxbill — Built for freelancers who value their time.</p>
        <p className="mt-2 text-zinc-600">
          Your data never leaves your browser. 100% private.
        </p>
      </footer>
    </div>
  );
}
