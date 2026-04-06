-- Ensure required extension exists for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create invoices table for Pro/Premium users
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_address TEXT,
  logo TEXT, -- base64 data URL
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  items JSONB NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  services_taxable BOOLEAN DEFAULT false,
  notes TEXT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'partial', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  paid_note TEXT,
  paid_amount DECIMAL(10,2),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  template TEXT DEFAULT 'classic',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_clients table for Pro users
CREATE TABLE IF NOT EXISTS public.saved_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mailing_list table for Pro users  
CREATE TABLE IF NOT EXISTS public.mailing_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- Create user_settings table for storing logo and other settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  logo TEXT, -- base64 data URL
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_saved_clients_user_id ON public.saved_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_mailing_list_user_id ON public.mailing_list(user_id);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailing_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only access their own data
DROP POLICY IF EXISTS "Users can access own invoices" ON public.invoices;
CREATE POLICY "Users can access own invoices" ON public.invoices FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can access own saved_clients" ON public.saved_clients;
CREATE POLICY "Users can access own saved_clients" ON public.saved_clients FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can access own mailing_list" ON public.mailing_list;
CREATE POLICY "Users can access own mailing_list" ON public.mailing_list FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can access own user_settings" ON public.user_settings;
CREATE POLICY "Users can access own user_settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Create triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();