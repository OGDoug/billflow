import { Invoice, UserSettings, SavedClient, MailingListEntry } from "./types";
import { getStorageService } from "./storage";

export function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Legacy localStorage keys
const STORAGE_KEY = "billflow_invoices";
const SETTINGS_KEY = "billflow_settings";

const DEFAULT_SETTINGS: UserSettings = {
  tier: "free",
  savedClients: [],
  mailingList: [],
};

// Helper to get current tier from localStorage (for determining storage service)
function getCurrentTier(): string {
  if (typeof window === "undefined") return "free";
  const data = localStorage.getItem(SETTINGS_KEY);
  const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
  return settings.tier || "free";
}

// Sync version for backward compatibility and fallbacks
function getInvoicesSync(): Invoice[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Settings (always stored in localStorage for tier info + Supabase for Pro data)
export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  
  // For Pro users, also save to Supabase (async, don't block)
  if (updated.tier === 'pro' || updated.tier === 'premium') {
    const storage = getStorageService(updated.tier);
    storage.saveUserSettings({
      logo: updated.logo,
      stripeSessionId: updated.stripeSessionId
    }).catch(console.error);
  }
  
  return updated;
}

export function isPremium(): boolean {
  return getSettings().tier === "pro" || getSettings().tier === "premium";
}

export function isPremiumTier(): boolean {
  return getSettings().tier === "premium";
}

// Invoice operations
export async function getInvoices(): Promise<Invoice[]> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    return await storage.getInvoices();
  } catch (error) {
    console.error('Error getting invoices:', error);
    // Fallback to localStorage
    return getInvoicesSync();
  }
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  const invoices = await getInvoices();
  return invoices.find((inv) => inv.id === id);
}

export async function saveInvoice(invoice: Invoice): Promise<Invoice> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    return await storage.saveInvoice(invoice);
  } catch (error) {
    console.error('Error saving invoice:', error);
    // Fallback to localStorage
    const invoices = getInvoicesSync();
    invoices.unshift(invoice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return invoice;
  }
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.updateInvoice(id, updates);
  } catch (error) {
    console.error('Error updating invoice:', error);
    // Fallback to localStorage for reliability
    const invoices = getInvoicesSync();
    const idx = invoices.findIndex((inv) => inv.id === id);
    if (idx !== -1) {
      invoices[idx] = { ...invoices[idx], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    }
  }
}

export async function updateInvoiceStatus(id: string, status: Invoice["status"]): Promise<void> {
  await updateInvoice(id, { status });
}

export async function deleteInvoice(id: string): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.deleteInvoice(id);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    // Fallback to localStorage
    const invoices = getInvoicesSync().filter((inv) => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }
}

// Saved clients operations
export async function getSavedClients(): Promise<SavedClient[]> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    return await storage.getSavedClients();
  } catch (error) {
    console.error('Error getting saved clients:', error);
    // Fallback to localStorage
    return getSettings().savedClients;
  }
}

export async function saveClient(client: SavedClient): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.saveClient(client);
  } catch (error) {
    console.error('Error saving client:', error);
    // Fallback to localStorage
    const settings = getSettings();
    const existing = settings.savedClients.findIndex((c) => c.id === client.id);
    if (existing !== -1) {
      settings.savedClients[existing] = client;
    } else {
      settings.savedClients.push(client);
    }
    saveSettings(settings);
  }
}

export async function deleteClient(id: string): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.deleteClient(id);
  } catch (error) {
    console.error('Error deleting client:', error);
    // Fallback to localStorage
    const settings = getSettings();
    settings.savedClients = settings.savedClients.filter((c) => c.id !== id);
    saveSettings(settings);
  }
}

// Mailing list operations
export async function getMailingList(): Promise<MailingListEntry[]> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    return await storage.getMailingList();
  } catch (error) {
    console.error('Error getting mailing list:', error);
    // Fallback to localStorage
    return getSettings().mailingList || [];
  }
}

export async function addToMailingList(entry: MailingListEntry): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.addToMailingList(entry);
  } catch (error) {
    console.error('Error adding to mailing list:', error);
    // Fallback to localStorage
    const settings = getSettings();
    if (!settings.mailingList) settings.mailingList = [];
    const exists = settings.mailingList.find((e) => e.email.toLowerCase() === entry.email.toLowerCase());
    if (!exists) {
      settings.mailingList.push(entry);
      saveSettings(settings);
    }
  }
}

export async function removeFromMailingList(email: string): Promise<void> {
  const tier = getCurrentTier();
  const storage = getStorageService(tier);
  
  try {
    await storage.removeFromMailingList(email);
  } catch (error) {
    console.error('Error removing from mailing list:', error);
    // Fallback to localStorage
    const settings = getSettings();
    settings.mailingList = (settings.mailingList || []).filter((e) => e.email.toLowerCase() !== email.toLowerCase());
    saveSettings(settings);
  }
}

export async function addManualToMailingList(email: string, name: string): Promise<void> {
  await addToMailingList({ email, name, phone: "", addedAt: new Date().toISOString() });
}

// Migration function to move localStorage data to Supabase for new Pro users
export async function migrateToCloudStorage(): Promise<void> {
  const tier = getCurrentTier();
  if (tier !== 'pro' && tier !== 'premium') return;
  
  const storage = getStorageService(tier);
  
  try {
    // Check if user already has cloud data
    const cloudInvoices = await storage.getInvoices();
    if (cloudInvoices.length > 0) {
      console.log('User already has cloud data, skipping migration');
      return;
    }
    
    // Migrate localStorage invoices to cloud
    const localInvoices = getInvoicesSync();
    console.log(`Migrating ${localInvoices.length} invoices to cloud storage...`);
    
    for (const invoice of localInvoices) {
      await storage.saveInvoice(invoice);
    }
    
    // Migrate saved clients
    const localClients = getSettings().savedClients || [];
    console.log(`Migrating ${localClients.length} saved clients to cloud storage...`);
    
    for (const client of localClients) {
      await storage.saveClient(client);
    }
    
    // Migrate mailing list
    const localMailingList = getSettings().mailingList || [];
    console.log(`Migrating ${localMailingList.length} mailing list entries to cloud storage...`);
    
    for (const entry of localMailingList) {
      await storage.addToMailingList(entry);
    }
    
    // Migrate user settings
    const settings = getSettings();
    if (settings.logo || settings.stripeSessionId) {
      await storage.saveUserSettings({
        logo: settings.logo,
        stripeSessionId: settings.stripeSessionId
      });
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // Don't throw - let the user continue with localStorage as fallback
  }
}

// Sync functions - Load cloud data and merge with localStorage for Pro users
export async function syncFromCloud(): Promise<void> {
  const tier = getCurrentTier();
  if (tier !== 'pro' && tier !== 'premium') return;
  
  const storage = getStorageService(tier);
  
  try {
    // Sync user settings from cloud
    const cloudSettings = await storage.getUserSettings();
    if (cloudSettings.logo || cloudSettings.stripeSessionId) {
      const currentSettings = getSettings();
      saveSettings({
        ...currentSettings,
        logo: cloudSettings.logo || currentSettings.logo,
        stripeSessionId: cloudSettings.stripeSessionId || currentSettings.stripeSessionId
      });
    }
    
    console.log('Cloud sync completed');
  } catch (error) {
    console.error('Cloud sync failed:', error);
  }
}