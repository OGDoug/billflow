import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Get the checkout session to find the customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId = checkoutSession.customer as string;

    if (!customerId) {
      return NextResponse.json({ error: "No customer found" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://get-billflow.vercel.app";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/invoices`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
