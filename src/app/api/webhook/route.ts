import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateUserTier(customerId: string, tier: string, subscriptionId?: string) {
  // Find user by stripe_customer_id
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (data) {
    await supabaseAdmin
      .from("profiles")
      .update({ tier, stripe_subscription_id: subscriptionId, updated_at: new Date().toISOString() })
      .eq("id", data.id);
  }
}

function getTierFromPrice(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price?.id;
  const premiumPrices = ["price_1TG0paLqrZZEjlA4YOOHNIZU", "price_1TG0pbLqrZZEjlA42edteDCz"];
  const proPrices = ["price_1TG0paLqrZZEjlA4SI9ox83k", "price_1TG0paLqrZZEjlA4dZsB2VIl"];

  if (premiumPrices.includes(priceId)) return "premium";
  if (proPrices.includes(priceId)) return "pro";
  return "free";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan || "pro";
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        // Link Stripe customer to Supabase user
        await supabaseAdmin
          .from("profiles")
          .update({
            tier: plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const tier = sub.status === "active" ? getTierFromPrice(sub) : "free";
      await updateUserTier(sub.customer as string, tier, sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await updateUserTier(sub.customer as string, "free");
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
