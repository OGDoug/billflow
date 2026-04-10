import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPriceId, SITE_URL } from "@/lib/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { plan, billing, email, userId } = await req.json();
    const selectedBilling = billing || "monthly";
    const priceId = getPriceId(plan, selectedBilling);
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or billing interval" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || SITE_URL;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/upgrade/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { userId: userId || "", plan, billing: selectedBilling },
    };

    if (email) {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    const message = err?.message || "Checkout session creation failed";
    console.error("Stripe checkout error:", {
      message,
      type: err?.type,
      code: err?.code,
      decline_code: err?.decline_code,
      param: err?.param,
      statusCode: err?.statusCode,
      requestId: err?.requestId,
      rawType: err?.rawType,
    });

    return NextResponse.json(
      {
        error: message,
        type: err?.type || null,
        code: err?.code || null,
        param: err?.param || null,
        requestId: err?.requestId || null,
      },
      { status: err?.statusCode || 500 }
    );
  }
}
