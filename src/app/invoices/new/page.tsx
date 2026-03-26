"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { InvoiceItem } from "@/lib/types";
import { saveInvoice, isPremium, getSavedClients, saveClient } from "@/lib/db";

export default function NewInvoicePage() {
  const router = useRouter();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), kind: "item", description: "", quantity: 1, rate: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [premium, setPremium] = useState(false);
  const [savedClients, setSavedClients] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    setPremium(isPremium());
    setSavedClients(getSavedClients());
  }, []);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), kind: "item", description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const subtotal = items.reduce((s, i) => s + (i.kind === "service" ? 1 : i.quantity) * i.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const id = crypto.randomUUID();
    const finalInvoiceNumber = invoiceNumber.trim() || `INV-${Date.now().toString(36).toUpperCase()}`;
    const invoice = {
      id,
      invoiceNumber: finalInvoiceNumber,
      senderName,
      senderAddress,
      clientName,
      clientEmail,
      items,
      taxRate,
      notes,
      dueDate,
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      subtotal,
      tax,
      total,
    };
    // Always save (needed for the detail/PDF page), but free users get cleared after download
    saveInvoice(invoice);
    // Premium: auto-save client for reuse
    if (premium && clientName) {
      const existingClient = savedClients.find((c) => c.name === clientName);
      if (!existingClient) {
        saveClient({ id: crypto.randomUUID(), name: clientName, email: clientEmail });
      }
    }
    router.push(`/invoices/${id}`);
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-white">Bill</span>
          <span className="text-blue-500">Flow</span>
        </Link>
        <Link href="/invoices" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Back to Invoices
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Invoice Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Invoice Number</label>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="Auto-generated if left blank"
              className={inputClass}
            />
          </div>

          {/* From (Sender) Info */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400">From</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Your Name / Business *</label>
                <input
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name or Company"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Address / Contact Info</label>
                <textarea
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  placeholder={"123 Main St\nCity, State 12345\nphone@email.com"}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Client Info */}
          {premium && savedClients.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Load Saved Client</label>
              <select
                onChange={(e) => {
                  const client = savedClients.find((c) => c.id === e.target.value);
                  if (client) {
                    setClientName(client.name);
                    setClientEmail(client.email);
                  }
                }}
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>Select a saved client...</option>
                {savedClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Client Name *</label>
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Acme Corp"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="billing@acme.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Due Date *</label>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate || ""}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-400">Line Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                  <select
                    value={item.kind}
                    onChange={(e) => updateItem(item.id, "kind", e.target.value)}
                    className={`${inputClass} col-span-2`}
                  >
                    <option value="item">Item</option>
                    <option value="service">Service</option>
                  </select>
                  <input
                    required
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className={`${inputClass} ${item.kind === "service" ? "col-span-6" : "col-span-4"}`}
                  />
                  {item.kind === "item" && (
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      className={`${inputClass} col-span-2`}
                    />
                  )}
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Rate"
                    value={item.rate || ""}
                    onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    className={`${inputClass} col-span-3`}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="col-span-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, thank you message, etc."
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Totals */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Tax ({taxRate}%)</span>
                <span className="tabular-nums">${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      </main>
    </div>
  );
}
