import { Invoice } from "./types";

const STORAGE_KEY = "billflow_invoices";

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getInvoice(id: string): Invoice | undefined {
  return getInvoices().find((inv) => inv.id === id);
}

export function saveInvoice(invoice: Invoice): Invoice {
  const invoices = getInvoices();
  invoices.unshift(invoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  return invoice;
}

export function updateInvoiceStatus(id: string, status: Invoice["status"]): void {
  const invoices = getInvoices();
  const idx = invoices.findIndex((inv) => inv.id === id);
  if (idx !== -1) {
    invoices[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}
