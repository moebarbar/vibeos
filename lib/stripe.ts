import Stripe from "stripe";

// Lazy proxy — defers initialization until first use so build succeeds without env vars
let _instance: Stripe;
function getInstance(): Stripe {
  if (!_instance) {
    _instance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _instance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return Reflect.get(getInstance(), prop);
  },
});

export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID!,
  FOUNDER_MONTHLY: process.env.STRIPE_FOUNDER_PRICE_ID!,
} as const;
