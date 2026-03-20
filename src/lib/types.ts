export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
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
