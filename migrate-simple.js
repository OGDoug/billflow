const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Creating tables for Duxbill cloud storage...');
  
  try {
    // Create invoices table
    console.log('📊 Creating invoices table...');
    const { error: invoicesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          invoice_number TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          sender_address TEXT,
          logo TEXT,
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
        
        ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can access own invoices" ON invoices;
        CREATE POLICY "Users can access own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
        
        CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
        CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      `
    });
    
    if (invoicesError) {
      console.log('❌ Invoices table:', invoicesError.message);
    } else {
      console.log('✅ Invoices table created');
    }
    
    // Create saved_clients table
    console.log('👥 Creating saved_clients table...');
    const { error: clientsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS saved_clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE saved_clients ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can access own saved_clients" ON saved_clients;
        CREATE POLICY "Users can access own saved_clients" ON saved_clients FOR ALL USING (auth.uid() = user_id);
        
        CREATE INDEX IF NOT EXISTS idx_saved_clients_user_id ON saved_clients(user_id);
      `
    });
    
    if (clientsError) {
      console.log('❌ Saved clients table:', clientsError.message);
    } else {
      console.log('✅ Saved clients table created');
    }
    
    // Create mailing_list table
    console.log('📧 Creating mailing_list table...');
    const { error: mailingError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS mailing_list (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          name TEXT,
          phone TEXT,
          added_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, email)
        );
        
        ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can access own mailing_list" ON mailing_list;
        CREATE POLICY "Users can access own mailing_list" ON mailing_list FOR ALL USING (auth.uid() = user_id);
        
        CREATE INDEX IF NOT EXISTS idx_mailing_list_user_id ON mailing_list(user_id);
      `
    });
    
    if (mailingError) {
      console.log('❌ Mailing list table:', mailingError.message);
    } else {
      console.log('✅ Mailing list table created');
    }
    
    // Create user_settings table
    console.log('⚙️ Creating user_settings table...');
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_settings (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          logo TEXT,
          stripe_session_id TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can access own user_settings" ON user_settings;
        CREATE POLICY "Users can access own user_settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
      `
    });
    
    if (settingsError) {
      console.log('❌ User settings table:', settingsError.message);
    } else {
      console.log('✅ User settings table created');
    }
    
    console.log('\n🎉 Database migration completed!');
    console.log('✅ Pro users now have cloud storage for invoices, clients, and settings');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

runMigration();