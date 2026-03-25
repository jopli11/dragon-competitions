import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";

const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");

if (process.env.NODE_ENV === "production") {
  if (!secretKey.startsWith("sk_live_")) {
    console.warn("⚠️ WARNING: Using Stripe TEST KEY in PRODUCTION environment!");
  }
}

export const stripe = new Stripe(secretKey);
