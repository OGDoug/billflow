import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Read the migration SQL file
    const sqlPath = path.join(process.cwd(), 'supabase-migration.sql');
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Duxbill Database Migration</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
          .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .step { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3b82f6; }
          .sql-box { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 14px; overflow-x: auto; white-space: pre-wrap; }
          .copy-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
          .copy-btn:hover { background: #2563eb; }
          .success { background: #dcfce7; border-color: #16a34a; color: #166534; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 Duxbill Database Migration</h1>
          <p>Setting up cloud storage for Pro/Premium users</p>
        </div>
        
        <div class="step">
          <h2>📋 Quick Setup Instructions</h2>
          <p><strong>Step 1:</strong> Go to your <a href="https://supabase.com/dashboard" target="_blank">Supabase Dashboard</a></p>
          <p><strong>Step 2:</strong> Open your project (${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'your-project'})</p>
          <p><strong>Step 3:</strong> Navigate to <strong>SQL Editor</strong> in the left sidebar</p>
          <p><strong>Step 4:</strong> Click "New Query" and copy the SQL below</p>
          <p><strong>Step 5:</strong> Click <strong>"Run"</strong> to execute the migration</p>
        </div>
        
        <div class="step">
          <h2>📊 What This Creates</h2>
          <ul>
            <li><strong>invoices</strong> - Cloud storage for Pro user invoices</li>
            <li><strong>saved_clients</strong> - Client profiles for Pro users</li>
            <li><strong>mailing_list</strong> - Email contacts for Pro users</li>
            <li><strong>user_settings</strong> - Logo and Stripe session data</li>
            <li><strong>RLS policies</strong> - Security: users only see their own data</li>
            <li><strong>Indexes</strong> - Performance optimization</li>
          </ul>
        </div>
        
        <div class="step">
          <h2>💻 SQL Migration</h2>
          <p>Copy and paste this SQL into your Supabase SQL Editor:</p>
          <div class="sql-box" id="sqlCode">${migrationSQL}</div>
          <button class="copy-btn" onclick="copySQL()">📋 Copy SQL to Clipboard</button>
        </div>
        
        <div class="step success">
          <h2>✅ After Migration</h2>
          <p><strong>Pro users will immediately get:</strong></p>
          <ul>
            <li>🔄 Cross-device sync - invoices accessible from any browser</li>
            <li>☁️ Cloud backup - data never lost even if browser storage is cleared</li>
            <li>🔐 Secure storage - data encrypted and protected by Supabase</li>
            <li>📱 True persistence - sign out/in without losing data</li>
          </ul>
        </div>
        
        <div class="step">
          <h2>🔍 Verify Migration</h2>
          <p>After running the SQL, refresh this page and visit <a href="/api/migrate/test">Test Database</a> to verify everything works.</p>
        </div>
        
        <script>
          function copySQL() {
            const sqlCode = document.getElementById('sqlCode');
            const text = sqlCode.textContent;
            navigator.clipboard.writeText(text).then(() => {
              const btn = document.querySelector('.copy-btn');
              btn.textContent = '✅ Copied!';
              setTimeout(() => {
                btn.textContent = '📋 Copy SQL to Clipboard';
              }, 2000);
            });
          }
        </script>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
      message: 'Could not read migration file'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Migration must be run manually via Supabase dashboard',
    instructions: 'Visit GET /api/migrate for detailed instructions'
  });
}