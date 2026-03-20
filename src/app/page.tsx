import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-white">Bill</span>
          <span className="text-blue-500">Flow</span>
        </span>
        <Link
          href="/invoices"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Dashboard →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-800 px-4 py-1.5 text-xs text-zinc-400">
            ✨ Free for freelancers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Invoicing that
            <br />
            <span className="text-blue-500">just works.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Create professional invoices in seconds. Track payments, export PDFs,
            and get paid faster. No signup required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/invoices/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Create Invoice
            </Link>
            <Link
              href="/invoices"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: "Create Invoices", desc: "Professional invoices with line items, tax, and custom notes." },
            { title: "Export to PDF", desc: "Download clean, print-ready PDFs with one click." },
            { title: "Track Status", desc: "Mark invoices as draft, sent, or paid. Stay organized." },
          ].map((f) => (
            <div key={f.title} className="space-y-2">
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-xs text-zinc-500">
        BillFlow — Built for freelancers who value their time.
      </footer>
    </div>
  );
}
