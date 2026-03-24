import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";

const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");

// Runtime Validation for Production
if (process.env.NODE_ENV === "production") {
  if (!secretKey.startsWith("sk_live_")) {
    console.warn("⚠️ WARNING: Using Stripe TEST KEY in PRODUCTION environment!");
  }
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-01-27-ac" as any, // Using the latest stable version
  typescript: true,
});
