"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MailingListEntry } from "@/lib/types";
import { isPremium, getMailingList, removeFromMailingList, addManualToMailingList } from "@/lib/db";

export default function MailingListPage() {
  const [premium, setPremium] = useState(false);
  const [entries, setEntries] = useState<MailingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const refresh = () => {
    setPremium(isPremium());
    setEntries(getMailingList());
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleRemove = (email: string) => {
    if (!confirm(`Remove ${email} from mailing list?`)) return;
    removeFromMailingList(email);
    refresh();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    addManualToMailingList(newEmail.trim(), newName.trim());
    setNewEmail("");
    setNewName("");
    setShowAdd(false);
    refresh();
  };

  const exportCSV = () => {
    const headers = "Name,Email,Phone,Date Added";
    const rows = filtered.map((e) =>
      `"${e.name}","${e.email}","${e.phone || ""}","${new Date(e.addedAt).toLocaleDateString()}"`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billflow-mailing-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = search
    ? entries.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const inputClass =
    "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  // Free tier gate
  if (!loading && !premium) {
    return (
      <div className="min-h-screen">
        <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <img src="/duxbill-nav.png" alt="" className="h-7 w-auto inline-block" /><span className="text-white">Dux</span>
            <span className="text-blue-500">bill</span>
          </Link>
          <Link href="/invoices/new" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Create Invoice
          </Link>
        </nav>
        <main className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="text-5xl">📧</div>
          <h1 className="text-2xl font-bold">Mailing List</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Upgrade to <span className="text-blue-400 font-semibold">Duxbill Pro</span> to automatically build a mailing list from your invoice clients. Export contacts as CSV anytime.
          </p>
          <button className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            Upgrade to Pro — Coming Soon
          </button>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-left space-y-3 max-w-sm mx-auto">
            <p className="text-sm font-medium text-zinc-300">Pro mailing list includes:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>✓ Auto-collect emails from invoices</li>
              <li>✓ Manually add contacts</li>
              <li>✓ Search & manage contacts</li>
              <li>✓ Export as CSV (Mailchimp, ConvertKit, etc.)</li>
              <li>✓ Name, email, phone for each contact</li>
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
          <img src="/duxbill-nav.png" alt="" className="h-7 w-auto inline-block" /><span className="text-white">Dux</span>
          <span className="text-blue-500">bill</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Invoices
          </Link>
          <Link href="/invoices/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            + New Invoice
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Mailing List</h1>
            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
              Pro
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              + Add Contact
            </button>
            {entries.length > 0 && (
              <button
                onClick={exportCSV}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <form onSubmit={handleAdd} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 mb-6 flex flex-wrap gap-3 items-end">
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-xs text-zinc-500">Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="John Smith"
                className={inputClass}
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-xs text-zinc-500">Email *</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="john@example.com"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Search */}
        {entries.length > 0 && (
          <div className="mb-4">
            <input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} w-full max-w-sm`}
            />
          </div>
        )}

        {/* Stats */}
        {entries.length > 0 && (
          <p className="text-xs text-zinc-500 mb-4">
            {entries.length} contact{entries.length !== 1 ? "s" : ""}
            {search && filtered.length !== entries.length && ` · ${filtered.length} matching`}
          </p>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-4xl">📧</div>
            <p className="text-zinc-500">No contacts yet.</p>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              Client emails are automatically added here when you create invoices. You can also add contacts manually.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Added</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((entry) => (
                  <tr key={entry.email} className="hover:bg-zinc-900 transition-colors">
                    <td className="px-4 py-3 font-medium">{entry.name || "—"}</td>
                    <td className="px-4 py-3 text-zinc-400">{entry.email}</td>
                    <td className="px-4 py-3 text-zinc-400">{entry.phone || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(entry.addedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(entry.email)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
