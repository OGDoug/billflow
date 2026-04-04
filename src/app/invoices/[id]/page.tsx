"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Invoice } from "@/lib/types";
import { getInvoice, deleteInvoice, isPremium, fmt } from "@/lib/db";
import { getTemplate } from "@/lib/templates";

export default function InvoiceDetailPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const inv = getInvoice(params.id as string);
    setInvoice(inv || null);
    setPremium(isPremium());
    setLoading(false);
  }, [params.id]);

  const downloadPDF = async () => {
    // Dynamic import for client-side only
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    if (!invoice) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const tpl = getTemplate(invoice.template);
    const pc = tpl.pdf;

    // Logo (upper left, above sender info)
    let logoOffset = 0;
    if (invoice.logo) {
      try {
        doc.addImage(invoice.logo, "AUTO", 20, 12, 30, 30);
        logoOffset = 35;
      } catch {
        // Skip logo if format unsupported
      }
    }

    // Header — Sender info (left column)
    const senderX = 20 + logoOffset;
    let cursorY = 20;

    doc.setFontSize(14);
    doc.setTextColor(...pc.headingColor);
    doc.text(invoice.senderName || "Your Business", senderX, cursorY);
    cursorY += 6;

    if (invoice.senderAddress) {
      doc.setFontSize(9);
      doc.setTextColor(...pc.subtextColor);
      const addrLines = doc.splitTextToSize(invoice.senderAddress, 80);
      doc.text(addrLines, senderX, cursorY);
      cursorY += addrLines.length * 4.5;
    }

    // Invoice title (upper right)
    doc.setFontSize(24);
    doc.setTextColor(...pc.headingColor);
    doc.text("INVOICE", pageWidth - 20, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...pc.subtextColor);
    doc.text(invoice.invoiceNumber, pageWidth - 20, 28, { align: "right" });
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, pageWidth - 20, 34, { align: "right" });
    doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 20, 40, { align: "right" });

    // Bill To
    cursorY = Math.max(cursorY + 8, 52);
    doc.setFontSize(10);
    doc.setTextColor(...pc.subtextColor);
    doc.text("Bill To:", 20, cursorY);
    cursorY += 8;

    doc.setTextColor(...pc.textColor);
    doc.setFontSize(12);
    doc.text(invoice.clientName, 20, cursorY);
    cursorY += 6;

    if (invoice.clientEmail) {
      doc.setFontSize(10);
      doc.setTextColor(...pc.subtextColor);
      doc.text(invoice.clientEmail, 20, cursorY);
      cursorY += 5;
    }
    if (invoice.clientPhone) {
      doc.setFontSize(10);
      doc.setTextColor(...pc.subtextColor);
      doc.text(invoice.clientPhone, 20, cursorY);
      cursorY += 5;
    }
    if (invoice.clientAddress) {
      doc.setFontSize(9);
      doc.setTextColor(...pc.subtextColor);
      const addrLines = doc.splitTextToSize(invoice.clientAddress, 80);
      doc.text(addrLines, 20, cursorY);
      cursorY += addrLines.length * 4.5;
    }

    // Table — start below all header content with padding
    const tableStartY = cursorY + 10;

    const tableData = invoice.items.map((item) => {
      const qty = item.kind === "service" ? 1 : item.quantity;
      return [
        item.description,
        item.kind === "service" ? "—" : item.quantity.toString(),
        `$${fmt(item.rate)}`,
        `$${fmt((qty * item.rate))}`,
      ];
    });

    (doc as any).autoTable({
      startY: tableStartY,
      head: [["Description", "Qty", "Rate", "Amount"]],
      body: tableData,
      theme: "plain",
      headStyles: {
        fillColor: pc.tableHeadBg,
        textColor: pc.tableHeadText,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: pc.textColor,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { halign: "center", cellWidth: 25 },
        2: { halign: "right", cellWidth: 30 },
        3: { halign: "right", cellWidth: 35 },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Totals
    const rightX = pageWidth - 20;
    doc.setFontSize(10);
    doc.setTextColor(...pc.subtextColor);
    doc.text("Subtotal:", rightX - 50, finalY);
    doc.text(`$${fmt(invoice.subtotal)}`, rightX, finalY, { align: "right" });

    if (invoice.taxRate > 0) {
      const taxLabel = invoice.servicesTaxable ? `Tax (${invoice.taxRate}%):` : `Tax (${invoice.taxRate}%, items only):`;
      doc.text(taxLabel, rightX - 60, finalY + 7);
      doc.text(`$${fmt(invoice.tax)}`, rightX, finalY + 7, { align: "right" });
    }

    doc.setFontSize(13);
    doc.setTextColor(...pc.headingColor);
    const totalY = invoice.taxRate > 0 ? finalY + 18 : finalY + 10;
    doc.text("Total:", rightX - 50, totalY);
    doc.text(`$${fmt(invoice.total)}`, rightX, totalY, { align: "right" });

    // Notes
    if (invoice.notes) {
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("Notes:", 20, totalY + 20);
      doc.text(invoice.notes, 20, totalY + 27, { maxWidth: pageWidth - 40 });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text("Generated by Duxbill", pageWidth / 2, 285, { align: "center" });

    doc.save(`${invoice.invoiceNumber}.pdf`);

    // Free users: clean up invoice from storage after download
    if (!isPremium()) {
      deleteInvoice(invoice.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Invoice not found.
      </div>
    );
  }

  const t = getTemplate(invoice.template);
  const statusColors: Record<string, string> = {
    draft: t.statusDraft,
    sent: t.statusSent,
    paid: t.statusPaid,
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="flex items-center gap-0.5"><img src="/duxbill-nav.png?v=2" alt="" className="h-6 w-auto" /><span><span className="text-white">Dux</span>
          <span className="text-blue-500">bill</span></span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/new"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors"
          >
            Create Another
          </Link>
          <button
            onClick={downloadPDF}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Download PDF
          </button>
          <Link
            href={premium ? "/invoices" : "/"}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Invoice Preview */}
        <div className={t.card}>
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {invoice.logo && (
                <img src={invoice.logo} alt="Logo" className="h-14 w-auto" />
              )}
              <div>
                <h1 className={t.heading}>INVOICE</h1>
                <p className={t.invoiceNumber}>
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className={t.label}>From</p>
              <p className={t.text}>{invoice.senderName}</p>
              {invoice.senderAddress && (
                <p className={`${t.subtext} whitespace-pre-wrap`}>{invoice.senderAddress}</p>
              )}
            </div>
            <div className="space-y-1 text-right">
              <p className={t.label}>Details</p>
              <p className={t.subtext}>
                Created: {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
              <p className={t.subtext}>
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className={t.label}>Bill To</p>
              <p className={t.text}>{invoice.clientName}</p>
              {invoice.clientEmail && (
                <p className={t.subtext}>{invoice.clientEmail}</p>
              )}
              {invoice.clientPhone && (
                <p className={t.subtext}>{invoice.clientPhone}</p>
              )}
              {invoice.clientAddress && (
                <p className={`${t.subtext} whitespace-pre-wrap`}>{invoice.clientAddress}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className={`overflow-hidden rounded-lg ${t.tableBorder}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={t.tableHead}>
                  <th className={`px-4 py-3 text-left ${t.tableHeadText}`}>Description</th>
                  <th className={`px-4 py-3 text-center ${t.tableHeadText}`}>Qty</th>
                  <th className={`px-4 py-3 text-right ${t.tableHeadText}`}>Rate</th>
                  <th className={`px-4 py-3 text-right ${t.tableHeadText}`}>Amount</th>
                </tr>
              </thead>
              <tbody className={t.tableRow}>
                {invoice.items.map((item) => {
                  const qty = item.kind === "service" ? 1 : item.quantity;
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.kind === "service" ? "—" : item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">${fmt(item.rate)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        ${fmt((qty * item.rate))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className={`flex justify-between text-sm ${t.subtext}`}>
                <span>Subtotal</span>
                <span className="tabular-nums">${fmt(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className={`flex justify-between text-sm ${t.subtext}`}>
                  <span>Tax ({invoice.taxRate}%{!invoice.servicesTaxable && ", items only"})</span>
                  <span className="tabular-nums">${fmt(invoice.tax)}</span>
                </div>
              )}
              <div className={`flex justify-between pt-3 ${t.totalBorder} ${t.totalText}`}>
                <span>Total</span>
                <span className="tabular-nums">${fmt(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className={`pt-4 border-t border-zinc-800`}>
              <p className={`${t.label} mb-2`}>Notes</p>
              <p className={`${t.subtext} whitespace-pre-wrap`}>{invoice.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
