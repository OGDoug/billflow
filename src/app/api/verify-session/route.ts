import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TG0paLqrZZEjlA4SI9ox83k: "pro",
  price_1TG0paLqrZZEjlA4dZsB2VIl: "pro",
  price_1TG0paLqrZZEjlA4YOOHNIZU: "premium",
  price_1TG0pbLqrZZEjlA42edteDCz: "premium",
};

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ valid: false, error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false });
    }

    // Determine plan from the price ID
    const priceId = session.line_items?.data?.[0]?.price?.id;
    const plan = priceId ? PRICE_TO_PLAN[priceId] || "pro" : "pro";

    return NextResponse.json({
      valid: true,
      plan,
      customerEmail: session.customer_details?.email || session.customer_email || null,
    });
  } catch (err: any) {
    console.error("Session verification failed:", err.message);
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}
