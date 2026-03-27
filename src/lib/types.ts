export type UserTier = "free" | "pro" | "premium";

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
  servicesTaxable: boolean;
  notes: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "partial" | "overdue";
  createdAt: string;
  paidAt?: string;
  paidNote?: string;
  paidAmount?: number;
  subtotal: number;
  tax: number;
  total: number;
  template?: InvoiceTemplate;
}
