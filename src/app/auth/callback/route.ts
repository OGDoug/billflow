import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const error = searchParams.get("error_description") || searchParams.get("error");
  const redirect = searchParams.get("redirect") || "/";

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  const safePath = redirect.startsWith("/") ? redirect : "/";
  return NextResponse.redirect(`${origin}${safePath}`);
}
