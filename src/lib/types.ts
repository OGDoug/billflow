export type UserTier = "free" | "premium";

export interface UserSettings {
  tier: UserTier;
  logo?: string; // base64 data URL
  savedClients: SavedClient[];
}

export interface SavedClient {
  id: string;
  name: string;
  email: string;
}

export interface InvoiceItem {
  id: string;
  kind: "item" | "service";
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderAddress: string;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  dueDate: string;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  subtotal: number;
  tax: number;
  total: number;
}
