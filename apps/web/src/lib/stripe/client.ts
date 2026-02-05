import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";

export const stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2025-01-27-ac" as any, // Using the latest stable version
  typescript: true,
});
