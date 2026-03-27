import { Invoice, UserSettings, SavedClient, MailingListEntry } from "./types";

export function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STORAGE_KEY = "billflow_invoices";
const SETTINGS_KEY = "billflow_settings";

const DEFAULT_SETTINGS: UserSettings = {
  tier: "free",
  savedClients: [],
  mailingList: [],
};

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function isPremium(): boolean {
  return getSettings().tier === "premium";
}

export function getSavedClients(): SavedClient[] {
  return getSettings().savedClients;
}

export function saveClient(client: SavedClient): void {
  const settings = getSettings();
  const existing = settings.savedClients.findIndex((c) => c.id === client.id);
  if (existing !== -1) {
    settings.savedClients[existing] = client;
  } else {
    settings.savedClients.push(client);
  }
  saveSettings(settings);
}

export function deleteClient(id: string): void {
  const settings = getSettings();
  settings.savedClients = settings.savedClients.filter((c) => c.id !== id);
  saveSettings(settings);
}

export function getMailingList(): MailingListEntry[] {
  return getSettings().mailingList || [];
}

export function addToMailingList(entry: MailingListEntry): void {
  const settings = getSettings();
  if (!settings.mailingList) settings.mailingList = [];
  const exists = settings.mailingList.find((e) => e.email.toLowerCase() === entry.email.toLowerCase());
  if (!exists) {
    settings.mailingList.push(entry);
    saveSettings(settings);
  }
}

export function removeFromMailingList(email: string): void {
  const settings = getSettings();
  settings.mailingList = (settings.mailingList || []).filter((e) => e.email.toLowerCase() !== email.toLowerCase());
  saveSettings(settings);
}

export function addManualToMailingList(email: string, name: string): void {
  addToMailingList({ email, name, phone: "", addedAt: new Date().toISOString() });
}

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
