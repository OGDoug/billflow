"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { InvoiceItem, InvoiceTemplate } from "@/lib/types";
import { saveInvoice, isPremium, getSavedClients, saveClient, getSettings, saveSettings, addToMailingList, fmt } from "@/lib/db";
import NavBar from "../../NavBar";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [servicesTaxable, setServicesTaxable] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), kind: "item", description: "", quantity: 1, rate: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [premium, setPremium] = useState(false);
  const [savedClients, setSavedClients] = useState<{ id: string; name: string; email: string; phone: string; address: string }[]>([]);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<InvoiceTemplate>("classic");

  useEffect(() => {
    const loadData = async () => {
      setPremium(isPremium());
      const clients = await getSavedClients();
      setSavedClients(clients);
      const settings = getSettings();
      setLogo(settings.logo);
    };
    
    loadData();
    // Restore sender info from last session
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("duxbill_sender");
      if (saved) {
        try {
          const s = JSON.parse(saved);
          if (s.name) setSenderName(s.name);
          if (s.address) setSenderAddress(s.address);
        } catch {}
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      alert("Logo must be under 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogo(dataUrl);
      saveSettings({ logo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(undefined);
    saveSettings({ logo: undefined });
  };

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
  const taxableAmount = items.reduce((s, i) => {
    if (i.kind === "service" && !servicesTaxable) return s;
    return s + (i.kind === "service" ? 1 : i.quantity) * i.rate;
  }, 0);
  const tax = taxableAmount * (taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const id = crypto.randomUUID();
      const finalInvoiceNumber = invoiceNumber.trim() || `INV-${Date.now().toString(36).toUpperCase()}`;
      const invoice = {
        id,
        invoiceNumber: finalInvoiceNumber,
        senderName,
        senderAddress,
        logo: premium ? logo : undefined,
        template: premium ? template : "classic",
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        items,
        taxRate,
        servicesTaxable,
        notes,
        dueDate,
        status: "draft" as const,
        createdAt: new Date().toISOString(),
        subtotal,
        tax,
        total,
      };
      
      // Save sender info for next time
      if (senderName || senderAddress) {
        localStorage.setItem("duxbill_sender", JSON.stringify({ name: senderName, address: senderAddress }));
      }
      
      // Save invoice (cloud for Pro, localStorage for free)
      await saveInvoice(invoice);
      
      // Premium: auto-save client for reuse + add to mailing list
      if (premium && clientName) {
        const existingClient = savedClients.find((c) => c.name === clientName);
        if (!existingClient) {
          await saveClient({ id: crypto.randomUUID(), name: clientName, email: clientEmail, phone: clientPhone, address: clientAddress });
        }
        if (clientEmail) {
          await addToMailingList({ email: clientEmail, name: clientName, phone: clientPhone, addedAt: new Date().toISOString() });
        }
      }
      
      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="min-h-screen">
      <NavBar variant="simple" />

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

          {/* Logo Upload (Premium) */}
          {premium && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Company Logo</label>
              {logo ? (
                <div className="flex items-center gap-4">
                  <img src={logo} alt="Logo" className="h-16 w-auto rounded border border-zinc-700" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border file:border-zinc-700 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:text-zinc-300 file:cursor-pointer hover:file:bg-zinc-800 file:transition-colors"
                />
              )}
              <p className="text-xs text-zinc-600">PNG, JPG, or SVG · Max 500KB · Saved for all invoices</p>
            </div>
          )}

          {/* Template Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Invoice Style</label>
            <div className="grid grid-cols-5 gap-2">
              {([
                { id: "classic", label: "Classic", colors: "bg-white border-zinc-300", accent: "bg-zinc-800" },
                { id: "modern", label: "Modern", colors: "bg-zinc-900 border-blue-500", accent: "bg-blue-500" },
                { id: "minimal", label: "Minimal", colors: "bg-white border-zinc-200", accent: "bg-zinc-400" },
                { id: "bold", label: "Bold", colors: "bg-zinc-950 border-amber-500", accent: "bg-amber-500" },
                { id: "elegant", label: "Elegant", colors: "bg-stone-50 border-stone-400", accent: "bg-stone-700" },
              ] as const).map((s) => {
                const isFree = s.id === "classic";
                const isSelected = template === s.id;
                const locked = !premium && !isFree;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (!locked) setTemplate(s.id);
                    }}
                    className={`rounded-lg border-2 p-3 text-center transition-all relative ${
                      isSelected
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : locked
                        ? "border-zinc-800 opacity-60 cursor-not-allowed"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {locked && (
                      <div className="absolute top-1 right-1 text-xs">🔒</div>
                    )}
                    <div className={`h-8 rounded ${s.colors} border mb-2 flex items-end p-1`}>
                      <div className={`h-1.5 w-full rounded ${s.accent}`} />
                    </div>
                    <span className="text-xs text-zinc-400">{s.label}</span>
                    {isFree && !premium && (
                      <span className="block text-[10px] text-zinc-600">Free</span>
                    )}
                  </button>
                );
              })}
            </div>
            {!premium && (
              <p className="text-xs text-zinc-500 mt-1">
                🔒 <a href="/pricing" className="text-blue-400 hover:text-blue-300">Upgrade to Pro</a> to unlock all invoice styles. Free invoices use the Classic style.
              </p>
            )}
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
                    setClientPhone(client.phone || "");
                    setClientAddress(client.address || "");
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
              <label className="text-sm font-medium text-zinc-400">Client Phone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(formatPhone(e.target.value))}
                placeholder="555-555-5555"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Client Address</label>
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder={"123 Main St\nCity, State 12345"}
                rows={2}
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

          {/* Services Taxable checkbox - only show when there are services and a tax rate */}
          {taxRate > 0 && items.some((i) => i.kind === "service") && (
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={servicesTaxable}
                onChange={(e) => setServicesTaxable(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
              />
              Services Taxable
              <span className="text-xs text-zinc-600">(varies by state)</span>
            </label>
          )}

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
                <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-start sm:border-0 sm:bg-transparent sm:p-0 sm:rounded-none">
                  <div className="grid gap-2 grid-cols-[76px_minmax(0,1fr)] items-start sm:col-span-8 sm:grid-cols-[110px_minmax(0,1fr)]">
                    <select
                      value={item.kind}
                      onChange={(e) => updateItem(item.id, "kind", e.target.value)}
                      className={`${inputClass} w-full`}
                    >
                      <option value="item">Item</option>
                      <option value="service">Service</option>
                    </select>
                    <textarea
                      required
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      rows={2}
                      className={`${inputClass} w-full min-h-[76px] resize-y sm:hidden`}
                    />
                    <input
                      required
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className={`${inputClass} hidden sm:block w-full`}
                    />
                  </div>
                  <div className={`grid gap-2 ${item.kind === "item" ? "grid-cols-[72px_minmax(0,1fr)_44px]" : "grid-cols-[minmax(0,1fr)_44px]"} sm:col-span-4 sm:grid-cols-[72px_minmax(0,1fr)_44px]`}>
                    {item.kind === "item" ? (
                      <input
                        required
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        className={`${inputClass} w-full text-sm`}
                      />
                    ) : (
                      <div className="hidden sm:block" />
                    )}
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Rate"
                      value={item.rate || ""}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      className={`${inputClass} w-full min-w-0 text-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors w-full"
                    >
                      ×
                    </button>
                  </div>
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
              <span className="tabular-nums">${fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Tax ({taxRate}%)</span>
                <span className="tabular-nums">${fmt(tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
              <span>Total</span>
              <span className="tabular-nums">${fmt(total)}</span>
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
