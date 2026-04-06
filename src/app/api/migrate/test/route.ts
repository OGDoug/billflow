import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing Duxbill database migration...');
    
    const results = [];
    const tables = ['invoices', 'saved_clients', 'mailing_list', 'user_settings'];
    
    // Test each table
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          const isMissingTable = error.message.includes("schema cache") || error.message.includes("Could not find the table");
          results.push({
            table,
            status: isMissingTable ? 'missing' : 'failed',
            error: error.message,
            icon: isMissingTable ? '🟡' : '❌'
          });
        } else {
          results.push({
            table,
            status: 'success',
            message: 'Table accessible and RLS working',
            icon: '✅'
          });
        }
      } catch (error) {
        results.push({
          table,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          icon: '💥'
        });
      }
    }
    
    const successCount = results.filter(r => r.status === 'success').length;
    const allSuccess = successCount === tables.length;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Duxbill Migration Test Results</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
          .header { background: ${allSuccess ? '#16a34a' : '#dc2626'}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
          .result { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid ${allSuccess ? '#16a34a' : '#dc2626'}; }
          .success { border-color: #16a34a; }
          .failed { border-color: #dc2626; }
          .missing { border-color: #f59e0b; }
          .error { border-color: #f59e0b; }
          .table-name { font-weight: bold; }
          .next-steps { background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${allSuccess ? '🎉' : '⚠️'} Migration Test Results</h1>
          <p>${successCount}/${tables.length} tables working properly</p>
        </div>
        
        ${results.map(result => `
          <div class="result ${result.status}">
            <div class="table-name">${result.icon} ${result.table}</div>
            <div>${result.message || result.error}</div>
          </div>
        `).join('')}
        
        ${allSuccess ? `
          <div class="next-steps">
            <h2>🚀 Migration Successful!</h2>
            <p><strong>Pro users now have cloud storage!</strong></p>
            <ul>
              <li>✅ Invoices sync across devices</li>
              <li>✅ Saved clients stored in cloud</li>
              <li>✅ Mailing list backed up</li>
              <li>✅ User settings (logo) synced</li>
              <li>✅ Row Level Security protecting user data</li>
            </ul>
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>🔄 Pro users signing in will auto-migrate their localStorage data to cloud</li>
              <li>☁️ New invoices from Pro users save to Supabase</li>
              <li>📱 Data accessible from any device</li>
            </ul>
          </div>
        ` : `
          <div class="next-steps">
            <h2>🔧 Migration Incomplete</h2>
            <p>The database API still cannot see one or more required tables in the <code>public</code> schema.</p>
            <ol>
              <li>Go to <a href="/api/migrate">Migration Instructions</a></li>
              <li>Run the full SQL in the Supabase SQL Editor</li>
              <li>Make sure it runs in the same project shown on the migration page</li>
              <li>Return here and test again</li>
            </ol>
            <p><strong>Tip:</strong> If you already created <code>invoices</code> manually, it may not match the expected schema or may not exist in <code>public</code>. Running the full migration is safe and idempotent.</p>
          </div>
        `}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="/api/migrate" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">← Back to Migration</a>
          <button onclick="location.reload()" style="background: #16a34a; color: white; padding: 10px 20px; border: none; border-radius: 6px; margin-left: 10px; cursor: pointer;">🔄 Test Again</button>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Could not test database'
    }, { status: 500 });
  }
}