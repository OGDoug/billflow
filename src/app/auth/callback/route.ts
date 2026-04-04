import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/invoices";

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Auth error:", error);
        // Redirect to login with error message
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`);
    }
  }

  // Only allow relative redirects for security
  const safePath = redirect.startsWith("/") ? redirect : "/invoices";
  return NextResponse.redirect(`${origin}${safePath}`);
}
