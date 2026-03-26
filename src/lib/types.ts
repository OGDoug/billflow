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
