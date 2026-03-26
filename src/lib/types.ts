export type UserTier = "free" | "premium";

export interface UserSettings {
  tier: UserTier;
  logo?: string; // base64 data URL
  savedClients: SavedClient[];
  mailingList: MailingListEntry[];
}

export interface SavedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface MailingListEntry {
  email: string;
  name: string;
  phone: string;
  addedAt: string;
}

export interface InvoiceItem {
  id: string;
  kind: "item" | "service";
  description: string;
  quantity: number;
  rate: number;
}

export type InvoiceTemplate = "classic" | "modern" | "minimal" | "bold" | "elegant";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderAddress: string;
  logo?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  dueDate: string;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  subtotal: number;
  tax: number;
  total: number;
  template?: InvoiceTemplate;
}
