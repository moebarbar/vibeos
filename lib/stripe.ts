import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID!,
  FOUNDER_MONTHLY: process.env.STRIPE_FOUNDER_PRICE_ID!,
} as const;
