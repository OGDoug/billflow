const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase migration...');
    
    // Read the migration SQL file
    const migration = fs.readFileSync('./supabase-migration.sql', 'utf8');
    
    // Split by statements and run each one
    const statements = migration
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📄 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Try direct query method instead
        const { error: directError } = await supabase
          .from('_dummy_') // This will fail but might give us better error handling
          .select();
        
        // Use the RPC method for DDL statements
        const { error: rpcError } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });
        
        if (rpcError) {
          console.error(`❌ Error in statement ${i + 1}:`, rpcError.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          // Don't exit - some statements might be expected to fail if tables exist
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('🎉 Migration completed!');
    
    // Test the tables were created
    console.log('\n🔍 Verifying tables...');
    
    const tables = ['invoices', 'saved_clients', 'mailing_list', 'user_settings'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' verification failed:`, error.message);
      } else {
        console.log(`✅ Table '${table}' is accessible`);
      }
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

runMigration();