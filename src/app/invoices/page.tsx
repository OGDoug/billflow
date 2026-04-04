"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Invoice } from "@/lib/types";
import { getInvoices, updateInvoiceStatus, deleteInvoice as removeInvoice, isPremium, isPremiumTier, updateInvoice, getSettings, fmt } from "@/lib/db";
import NavBar from "../NavBar";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-700 text-zinc-300",
  sent: "bg-yellow-900/50 text-yellow-400",
  partial: "bg-orange-900/50 text-orange-400",
  overdue: "bg-red-900/50 text-red-400",
  paid: "bg-green-900/50 text-green-400",
};

type SortField = "date" | "client" | "amount" | "status";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);
  const [premiumTier, setPremiumTier] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [payModal, setPayModal] = useState<string | null>(null);
  const [payNote, setPayNote] = useState("");
  const [payAmount, setPayAmount] = useState("");

  const fetchInvoices = async () => {
    try {
      setPremium(isPremium());
      setPremiumTier(isPremiumTier());
      const invoicesList = await getInvoices();
      setInvoices(invoicesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateInvoiceStatus(id, status as Invoice["status"]);
      await fetchInvoices();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating invoice status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try {
      await removeInvoice(id);
      await fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const amt = payAmount ? parseFloat(payAmount) : undefined;
      const inv = invoices.find((i) => i.id === id);
      const isPartial = amt !== undefined && inv && amt < inv.total;
      await updateInvoice(id, {
        status: isPartial ? "partial" : "paid",
        paidAt: new Date().toISOString(),
        paidNote: payNote || undefined,
        paidAmount: amt,
      });
      setPayModal(null);
      setPayNote("");
      setPayAmount("");
      await fetchInvoices();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      alert('Error updating payment status');
    }
  };

  // A/R helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && inv.status !== "draft" && getDaysUntilDue(inv.dueDate) < 0
  );
  const dueSoonInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && inv.status !== "draft" && getDaysUntilDue(inv.dueDate) >= 0 && getDaysUntilDue(inv.dueDate) <= 3
  );
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "draft")
    .reduce((s, inv) => s + inv.total - (inv.paidAmount || 0), 0);

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
        <NavBar />

        <main className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="text-5xl">📋</div>
          <h1 className="text-2xl font-bold">Invoice Archive</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Upgrade to <span className="text-blue-400 font-semibold">Duxbill Pro</span> to save, search, and manage all your invoices. Sort by client, filter by status, and never lose track of a payment.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link href="/pricing" className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              Upgrade to Pro
            </Link>
            <div className="flex flex-col items-center gap-2">
              <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                or Sign In →
              </Link>
              <Link href="/invoices/new" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                or create a free invoice →
              </Link>
            </div>
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
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
              Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            {premium && getSettings().stripeSessionId && (
              <button
                onClick={async () => {
                  const res = await fetch("/api/portal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId: getSettings().stripeSessionId }),
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Manage Subscription
              </button>
            )}
            <Link href="/mailing-list" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Mailing List →
            </Link>
          </div>
        </div>

        {/* A/R Alerts — Premium tier */}
        {premiumTier && (overdueInvoices.length > 0 || dueSoonInvoices.length > 0) && (
          <div className="space-y-2 mb-6">
            {overdueInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-sm">🔴</span>
                  <span className="text-sm text-red-300">
                    <span className="font-mono">{inv.invoiceNumber}</span> for <span className="font-medium">{inv.clientName}</span> is {Math.abs(getDaysUntilDue(inv.dueDate))} day{Math.abs(getDaysUntilDue(inv.dueDate)) !== 1 ? "s" : ""} overdue
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-red-400 tabular-nums">${fmt(inv.total - (inv.paidAmount || 0))}</span>
                  <button onClick={() => setPayModal(inv.id)} className="text-xs text-blue-400 hover:text-blue-300">Mark Paid</button>
                </div>
              </div>
            ))}
            {dueSoonInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-950/20 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">🟡</span>
                  <span className="text-sm text-yellow-300">
                    <span className="font-mono">{inv.invoiceNumber}</span> for <span className="font-medium">{inv.clientName}</span> is due {getDaysUntilDue(inv.dueDate) === 0 ? "today" : `in ${getDaysUntilDue(inv.dueDate)} day${getDaysUntilDue(inv.dueDate) !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-yellow-400 tabular-nums">${fmt(inv.total)}</span>
                  <button onClick={() => setPayModal(inv.id)} className="text-xs text-blue-400 hover:text-blue-300">Mark Paid</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* A/R Summary — Premium tier */}
        {premiumTier && invoices.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Outstanding</p>
              <p className="text-xl font-bold tabular-nums">${fmt(totalOutstanding)}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Overdue</p>
              <p className="text-xl font-bold text-red-400 tabular-nums">{overdueInvoices.length}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Due Soon</p>
              <p className="text-xl font-bold text-yellow-400 tabular-nums">{dueSoonInvoices.length}</p>
            </div>
          </div>
        )}

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
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
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
                    {inv.paidAt && <span className="text-green-500"> · Paid {new Date(inv.paidAt).toLocaleDateString()}</span>}
                    {inv.paidNote && <span className="text-zinc-600"> — {inv.paidNote}</span>}
                  </p>
                  {premiumTier && inv.status === "partial" && inv.paidAmount != null && (
                    <p className="text-xs text-orange-400">
                      Received ${fmt(inv.paidAmount)} · Remaining ${fmt(inv.total - inv.paidAmount)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold tabular-nums">
                    ${fmt(inv.total)}
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
                      <option value="partial">Partial</option>
                      <option value="overdue">Overdue</option>
                      <option value="paid">Paid</option>
                    </select>
                    {premiumTier && inv.status !== "paid" && (
                      <button
                        onClick={() => { setPayModal(inv.id); setPayAmount(""); setPayNote(""); }}
                        className="rounded px-2 py-1 text-xs text-green-400 hover:text-green-300 hover:bg-zinc-800 transition-colors"
                      >
                        💰 Paid
                      </button>
                    )}
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

      {/* Mark Paid Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setPayModal(null)}>
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Mark as Paid</h3>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Amount Received</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder={`Full amount: $${fmt(invoices.find((i) => i.id === payModal)?.total || 0)}`}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
              <p className="text-xs text-zinc-600">Leave blank for full payment</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Note (optional)</label>
              <input
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                placeholder="Check #1234, Venmo, etc."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleMarkPaid(payModal)}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
              >
                Confirm Payment
              </button>
              <button
                onClick={() => setPayModal(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
