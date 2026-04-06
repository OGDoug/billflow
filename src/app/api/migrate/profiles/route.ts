import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), 'supabase-profiles-migration.sql');
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Duxbill Profiles Migration</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
          .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .step { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3b82f6; }
          .sql-box { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; white-space: pre-wrap; }
          .copy-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
          .copy-btn:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👤 Duxbill Profiles Migration</h1>
          <p>Create the missing auth/subscription profile layer</p>
        </div>

        <div class="step">
          <h2>What this adds</h2>
          <ul>
            <li><strong>profiles</strong> table keyed by Supabase auth user id</li>
            <li><strong>tier</strong> storage for free / pro / premium</li>
            <li><strong>stripe_customer_id</strong> and <strong>stripe_subscription_id</strong></li>
            <li>Automatic profile creation for new auth users</li>
            <li>Backfill for existing users already in auth.users</li>
          </ul>
        </div>

        <div class="step">
          <h2>Run this in Supabase SQL Editor</h2>
          <div class="sql-box" id="sqlCode">${migrationSQL}</div>
          <button class="copy-btn" onclick="copySQL()">📋 Copy SQL to Clipboard</button>
        </div>

        <script>
          function copySQL() {
            const sqlCode = document.getElementById('sqlCode');
            navigator.clipboard.writeText(sqlCode.textContent).then(() => {
              const btn = document.querySelector('.copy-btn');
              btn.textContent = '✅ Copied!';
              setTimeout(() => btn.textContent = '📋 Copy SQL to Clipboard', 2000);
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
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Could not read profiles migration file'
    }, { status: 500 });
  }
}
