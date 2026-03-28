import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PRICES: Record<string, string> = {
  "pro-monthly": "price_1TG0paLqrZZEjlA4SI9ox83k",
  "pro-annual": "price_1TG0paLqrZZEjlA4dZsB2VIl",
  "premium-monthly": "price_1TG0paLqrZZEjlA4YOOHNIZU",
  "premium-annual": "price_1TG0pbLqrZZEjlA42edteDCz",
};

export async function POST(req: NextRequest) {
  try {
    const { plan, billing } = await req.json();
    const key = `${plan}-${billing || "monthly"}`;
    const priceId = PRICES[key];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://get-billflow.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/upgrade/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
