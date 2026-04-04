import { supabase } from "./supabase";
import { Invoice, SavedClient, MailingListEntry, UserSettings } from "./types";

// Storage interface - abstracts between localStorage and Supabase
export interface StorageService {
  getInvoices(): Promise<Invoice[]>;
  saveInvoice(invoice: Invoice): Promise<Invoice>;
  updateInvoice(id: string, updates: Partial<Invoice>): Promise<void>;
  deleteInvoice(id: string): Promise<void>;
  
  getSavedClients(): Promise<SavedClient[]>;
  saveClient(client: SavedClient): Promise<void>;
  deleteClient(id: string): Promise<void>;
  
  getMailingList(): Promise<MailingListEntry[]>;
  addToMailingList(entry: MailingListEntry): Promise<void>;
  removeFromMailingList(email: string): Promise<void>;
  
  getUserSettings(): Promise<Partial<UserSettings>>;
  saveUserSettings(settings: Partial<UserSettings>): Promise<void>;
}

// LocalStorage implementation (for free users)
class LocalStorageService implements StorageService {
  private INVOICES_KEY = "billflow_invoices";
  private SETTINGS_KEY = "billflow_settings";
  
  async getInvoices(): Promise<Invoice[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const invoices = await this.getInvoices();
    invoices.unshift(invoice);
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
    return invoice;
  }
  
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
    const invoices = await this.getInvoices();
    const idx = invoices.findIndex(inv => inv.id === id);
    if (idx !== -1) {
      invoices[idx] = { ...invoices[idx], ...updates };
      localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
    }
  }
  
  async deleteInvoice(id: string): Promise<void> {
    const invoices = await this.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(filtered));
  }
  
  async getSavedClients(): Promise<SavedClient[]> {
    const settings = await this.getUserSettings();
    return settings.savedClients || [];
  }
  
  async saveClient(client: SavedClient): Promise<void> {
    const settings = await this.getUserSettings();
    const clients = settings.savedClients || [];
    const existing = clients.findIndex(c => c.id === client.id);
    if (existing !== -1) {
      clients[existing] = client;
    } else {
      clients.push(client);
    }
    await this.saveUserSettings({ savedClients: clients });
  }
  
  async deleteClient(id: string): Promise<void> {
    const settings = await this.getUserSettings();
    const clients = (settings.savedClients || []).filter(c => c.id !== id);
    await this.saveUserSettings({ savedClients: clients });
  }
  
  async getMailingList(): Promise<MailingListEntry[]> {
    const settings = await this.getUserSettings();
    return settings.mailingList || [];
  }
  
  async addToMailingList(entry: MailingListEntry): Promise<void> {
    const settings = await this.getUserSettings();
    const list = settings.mailingList || [];
    const exists = list.find(e => e.email.toLowerCase() === entry.email.toLowerCase());
    if (!exists) {
      list.push(entry);
      await this.saveUserSettings({ mailingList: list });
    }
  }
  
  async removeFromMailingList(email: string): Promise<void> {
    const settings = await this.getUserSettings();
    const list = (settings.mailingList || []).filter(e => e.email.toLowerCase() !== email.toLowerCase());
    await this.saveUserSettings({ mailingList: list });
  }
  
  async getUserSettings(): Promise<Partial<UserSettings>> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  }
  
  async saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
    const current = await this.getUserSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
  }
}

// Supabase implementation (for Pro/Premium users)
class SupabaseStorageService implements StorageService {
  async getInvoices(): Promise<Invoice[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
    
    // Convert snake_case to camelCase
    return (data || []).map(this.transformInvoiceFromDb);
  }
  
  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const dbInvoice = this.transformInvoiceToDb(invoice, user.id);
    
    const { error } = await supabase
      .from('invoices')
      .insert(dbInvoice);
    
    if (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
    
    return invoice;
  }
  
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const dbUpdates = this.transformPartialInvoiceToDb(updates);
    
    const { error } = await supabase
      .from('invoices')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }
  
  async deleteInvoice(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
  
  async getSavedClients(): Promise<SavedClient[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('saved_clients')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching saved clients:', error);
      return [];
    }
    
    return data || [];
  }
  
  async saveClient(client: SavedClient): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('saved_clients')
      .upsert({
        id: client.id,
        user_id: user.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      });
    
    if (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  
  async deleteClient(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('saved_clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
  
  async getMailingList(): Promise<MailingListEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('mailing_list')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mailing list:', error);
      return [];
    }
    
    return (data || []).map(row => ({
      email: row.email,
      name: row.name || '',
      phone: row.phone || '',
      addedAt: row.added_at
    }));
  }
  
  async addToMailingList(entry: MailingListEntry): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('mailing_list')
      .upsert({
        user_id: user.id,
        email: entry.email,
        name: entry.name,
        phone: entry.phone,
        added_at: entry.addedAt
      });
    
    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error adding to mailing list:', error);
      throw error;
    }
  }
  
  async removeFromMailingList(email: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('mailing_list')
      .delete()
      .eq('user_id', user.id)
      .eq('email', email);
    
    if (error) {
      console.error('Error removing from mailing list:', error);
      throw error;
    }
  }
  
  async getUserSettings(): Promise<Partial<UserSettings>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
      console.error('Error fetching user settings:', error);
      return {};
    }
    
    return {
      logo: data?.logo,
      stripeSessionId: data?.stripe_session_id
    };
  }
  
  async saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        logo: settings.logo,
        stripe_session_id: settings.stripeSessionId
      });
    
    if (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }
  
  // Helper methods to transform between camelCase and snake_case
  private transformInvoiceFromDb(dbInvoice: any): Invoice {
    return {
      id: dbInvoice.id,
      invoiceNumber: dbInvoice.invoice_number,
      senderName: dbInvoice.sender_name,
      senderAddress: dbInvoice.sender_address,
      logo: dbInvoice.logo,
      clientName: dbInvoice.client_name,
      clientEmail: dbInvoice.client_email,
      clientPhone: dbInvoice.client_phone,
      clientAddress: dbInvoice.client_address,
      items: dbInvoice.items,
      taxRate: parseFloat(dbInvoice.tax_rate || 0),
      servicesTaxable: dbInvoice.services_taxable,
      notes: dbInvoice.notes,
      dueDate: dbInvoice.due_date,
      status: dbInvoice.status,
      createdAt: dbInvoice.created_at,
      paidAt: dbInvoice.paid_at,
      paidNote: dbInvoice.paid_note,
      paidAmount: dbInvoice.paid_amount ? parseFloat(dbInvoice.paid_amount) : undefined,
      subtotal: parseFloat(dbInvoice.subtotal),
      tax: parseFloat(dbInvoice.tax),
      total: parseFloat(dbInvoice.total),
      template: dbInvoice.template
    };
  }
  
  private transformInvoiceToDb(invoice: Invoice, userId: string): any {
    return {
      id: invoice.id,
      user_id: userId,
      invoice_number: invoice.invoiceNumber,
      sender_name: invoice.senderName,
      sender_address: invoice.senderAddress,
      logo: invoice.logo,
      client_name: invoice.clientName,
      client_email: invoice.clientEmail,
      client_phone: invoice.clientPhone,
      client_address: invoice.clientAddress,
      items: invoice.items,
      tax_rate: invoice.taxRate,
      services_taxable: invoice.servicesTaxable,
      notes: invoice.notes,
      due_date: invoice.dueDate,
      status: invoice.status,
      created_at: invoice.createdAt,
      paid_at: invoice.paidAt,
      paid_note: invoice.paidNote,
      paid_amount: invoice.paidAmount,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      template: invoice.template || 'classic'
    };
  }
  
  private transformPartialInvoiceToDb(updates: Partial<Invoice>): any {
    const dbUpdates: any = {};
    
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.paidAt !== undefined) dbUpdates.paid_at = updates.paidAt;
    if (updates.paidNote !== undefined) dbUpdates.paid_note = updates.paidNote;
    if (updates.paidAmount !== undefined) dbUpdates.paid_amount = updates.paidAmount;
    
    return dbUpdates;
  }
}

// Factory function to get the right storage service
export function getStorageService(tier: string): StorageService {
  if (tier === 'pro' || tier === 'premium') {
    return new SupabaseStorageService();
  }
  return new LocalStorageService();
}