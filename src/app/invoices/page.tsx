"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Invoice } from "@/lib/types";
import { getInvoices, updateInvoiceStatus, deleteInvoice as removeInvoice, isPremium } from "@/lib/db";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-700 text-zinc-300",
  sent: "bg-yellow-900/50 text-yellow-400",
  paid: "bg-green-900/50 text-green-400",
};

type SortField = "date" | "client" | "amount" | "status";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchInvoices = () => {
    setPremium(isPremium());
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

  // Get unique client names for filter dropdown
  const uniqueClients = Array.from(new Set(invoices.map((inv) => inv.clientName))).sort();

  // Filter
  let filtered = invoices;
  if (filterClient) {
    filtered = filtered.filter((inv) => inv.clientName === filterClient);
  }
  if (filterStatus !== "all") {
    filtered = filtered.filter((inv) => inv.status === filterStatus);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.clientName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.notes?.toLowerCase().includes(q)
    );
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "date":
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "client":
        cmp = a.clientName.localeCompare(b.clientName);
        break;
      case "amount":
        cmp = a.total - b.total;
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const sortIcon = (field: SortField) =>
    sortBy === field ? (sortAsc ? " ↑" : " ↓") : "";

  const inputClass =
    "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  // Free tier: show upgrade prompt
  if (!loading && !premium) {
    return (
      <div className="min-h-screen">
        <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <img src="/duxbill-logo.jpg" alt="" className="h-7 w-auto inline-block" /><span className="text-white">Dux</span>
            <span className="text-blue-500">bill</span>
          </Link>
          <Link
            href="/invoices/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            + New Invoice
          </Link>
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="text-5xl">📋</div>
          <h1 className="text-2xl font-bold">Invoice Archive</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Upgrade to <span className="text-blue-400 font-semibold">Duxbill Pro</span> to save, search, and manage all your invoices. Sort by client, filter by status, and never lose track of a payment.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              Upgrade to Pro — Coming Soon
            </button>
            <Link href="/invoices/new" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              or create a free invoice →
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-left space-y-3 max-w-sm mx-auto">
            <p className="text-sm font-medium text-zinc-300">Pro includes:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>✓ Unlimited invoice archive</li>
              <li>✓ Sort & filter by client, status, date</li>
              <li>✓ Search across all invoices</li>
              <li>✓ Saved client profiles</li>
              <li>✓ Company logo on invoices</li>
              <li>✓ Payment tracking</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <img src="/duxbill-logo.jpg" alt="" className="h-7 w-auto inline-block" /><span className="text-white">Dux</span>
          <span className="text-blue-500">bill</span>
        </Link>
        <Link
          href="/invoices/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          + New Invoice
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
            Pro
          </span>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} flex-1 min-w-[200px]`}
          />
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className={inputClass}
          >
            <option value="">All Clients</option>
            {uniqueClients.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputClass}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2 mb-4">
          <span className="text-xs text-zinc-500 py-1">Sort by:</span>
          {(["date", "client", "amount", "status"] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                sortBy === field
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}{sortIcon(field)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-zinc-500">
              {invoices.length === 0 ? "No invoices yet." : "No invoices match your filters."}
            </p>
            {invoices.length === 0 && (
              <Link
                href="/invoices/new"
                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
              >
                Create your first invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">{sorted.length} invoice{sorted.length !== 1 ? "s" : ""}</p>
            {sorted.map((inv) => (
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
