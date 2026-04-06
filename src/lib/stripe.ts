export const SITE_URL = "https://duxbill.com";

export const STRIPE_PRICE_IDS = {
  pro: {
    monthly: "price_1TG0paLqrZZEjlA4SI9ox83k",
    annual: "price_1TG0paLqrZZEjlA4dZsB2VIl",
  },
  premium: {
    monthly: "price_1TG0paLqrZZEjlA4YOOHNIZU",
    annual: "price_1TG0pbLqrZZEjlA42edteDCz",
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PRICE_IDS;
export type StripeBilling = keyof typeof STRIPE_PRICE_IDS.pro;

export function getPriceId(plan: string, billing: string = "monthly"): string | null {
  if (plan !== "pro" && plan !== "premium") return null;
  if (billing !== "monthly" && billing !== "annual") return null;
  return STRIPE_PRICE_IDS[plan][billing];
}

export function getPlanFromPriceId(priceId?: string | null): StripePlan | null {
  if (!priceId) return null;

  if (
    priceId === STRIPE_PRICE_IDS.pro.monthly ||
    priceId === STRIPE_PRICE_IDS.pro.annual
  ) {
    return "pro";
  }

  if (
    priceId === STRIPE_PRICE_IDS.premium.monthly ||
    priceId === STRIPE_PRICE_IDS.premium.annual
  ) {
    return "premium";
  }

  return null;
}
