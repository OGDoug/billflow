"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Invoice } from "@/lib/types";
import { getInvoices, updateInvoiceStatus, deleteInvoice as removeInvoice } from "@/lib/db";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-700 text-zinc-300",
  sent: "bg-yellow-900/50 text-yellow-400",
  paid: "bg-green-900/50 text-green-400",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = () => {
    setInvoices(getInvoices());
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, []);

  const updateStatus = (id: string, status: string) => {
    updateInvoiceStatus(id, status as Invoice["status"]);
    fetchInvoices();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    removeInvoice(id);
    fetchInvoices();
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-white">Bill</span>
          <span className="text-blue-500">Flow</span>
        </Link>
        <Link
          href="/invoices/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          + New Invoice
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Invoices</h1>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-zinc-500">No invoices yet.</p>
            <Link
              href="/invoices/new"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4 hover:bg-zinc-900 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-zinc-400">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="font-medium">{inv.clientName}</p>
                  <p className="text-xs text-zinc-500">
                    Due {new Date(inv.dueDate).toLocaleDateString()} · Created{" "}
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold tabular-nums">
                    ${inv.total.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      View
                    </Link>
                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv.id, e.target.value)}
                      className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-zinc-300 outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="rounded px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
