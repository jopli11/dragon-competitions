"use client";

import Script from "next/script";

const DNA_SCRIPT_URLS = {
  test: "https://test-pay.dnapayments.com/checkout/payment-api.js",
  live: "https://pay.dnapayments.com/checkout/payment-api.js",
} as const;

export function DnaScript() {
  const env = (process.env.NEXT_PUBLIC_DNA_ENV || "test") as "test" | "live";
  const src = DNA_SCRIPT_URLS[env];

  return <Script src={src} strategy="afterInteractive" />;
}
