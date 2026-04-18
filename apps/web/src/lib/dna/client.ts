import crypto from "crypto";
import { getRequiredEnv, getOptionalEnv } from "@/lib/env";

const DNA_URLS = {
  test: {
    oauth: "https://test-oauth.dnapayments.com/oauth2/token",
    api: "https://test-api.dnapayments.com",
    widgetScript: "https://test-pay.dnapayments.com/checkout/payment-api.js",
  },
  live: {
    oauth: "https://oauth.dnapayments.com/oauth2/token",
    api: "https://api.dnapayments.com",
    widgetScript: "https://pay.dnapayments.com/checkout/payment-api.js",
  },
} as const;

type DnaEnv = "test" | "live";

function getDnaEnv(): DnaEnv {
  const env = getOptionalEnv("DNA_ENV") || "test";
  if (env !== "test" && env !== "live") {
    throw new Error(`Invalid DNA_ENV: ${env}. Must be "test" or "live".`);
  }
  return env;
}

export function getDnaUrls() {
  return DNA_URLS[getDnaEnv()];
}

function getClientId() {
  return getRequiredEnv("DNA_CLIENT_ID");
}

function getClientSecret() {
  return getRequiredEnv("DNA_CLIENT_SECRET");
}

function getTerminalId() {
  return getRequiredEnv("DNA_TERMINAL_ID");
}

export function penceToDnaAmount(pence: number): string {
  return (pence / 100).toFixed(2);
}

export function dnaAmountToPence(amount: number): number {
  return Math.round(amount * 100);
}

// ----- OAuth -----

interface DnaAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export async function getCheckoutAccessToken({
  invoiceId,
  amountPence,
}: {
  invoiceId: string;
  amountPence: number;
}): Promise<DnaAuthResponse> {
  const urls = getDnaUrls();
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "payment integration_embedded",
    client_id: getClientId(),
    client_secret: getClientSecret(),
    invoiceId,
    amount: penceToDnaAmount(amountPence),
    currency: "GBP",
    terminal: getTerminalId(),
  });

  const res = await fetch(urls.oauth, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DNA auth failed (${res.status}): ${text}`);
  }

  return res.json();
}

let cachedWebApiToken: { token: string; expiresAt: number } | null = null;

export async function getWebApiAccessToken(): Promise<string> {
  if (cachedWebApiToken && Date.now() < cachedWebApiToken.expiresAt) {
    return cachedWebApiToken.token;
  }

  const urls = getDnaUrls();
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "webapi",
    client_id: getClientId(),
    client_secret: getClientSecret(),
  });

  const res = await fetch(urls.oauth, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DNA webapi auth failed (${res.status}): ${text}`);
  }

  const data: DnaAuthResponse = await res.json();
  cachedWebApiToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

// ----- Signature verification -----

export interface DnaPaymentResult {
  signature: string;
  id: string;
  amount: number;
  currency: string;
  invoiceId: string;
  errorCode: number;
  success: boolean;
  message: string;
  authCode?: string;
  responseCode?: string;
  paymentMethod?: string;
  cardPanStarred?: string;
  cardSchemeName?: string;
  cardTokenId?: string;
  settled?: boolean;
  rrn?: string;
  accountId?: string;
  cardholderName?: string;
  [key: string]: unknown;
}

export function verifyPaymentSignature(result: DnaPaymentResult): boolean {
  const secret = getClientSecret();
  const message =
    String(result.id) +
    String(result.amount) +
    String(result.currency) +
    String(result.invoiceId) +
    String(result.errorCode) +
    String(result.success).toLowerCase();

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const computed = hmac.digest("base64");

  return computed === result.signature;
}

// ----- Transaction management -----

interface RefundRequest {
  transactionId: string;
  amountPence?: number;
  reason?: string;
}

interface RefundResponse {
  id: string;
  amount: number;
  currency: string;
  invoiceId: string;
  message: string;
  success: boolean;
  settled: boolean;
  parentTransactionId: string;
  errorCode: number;
  [key: string]: unknown;
}

export async function refundTransaction({
  transactionId,
  amountPence,
  reason,
}: RefundRequest): Promise<RefundResponse> {
  const token = await getWebApiAccessToken();
  const urls = getDnaUrls();

  const payload: Record<string, unknown> = { id: transactionId };
  if (amountPence !== undefined) {
    // DNA's JSON API requires `amount` as a float64, not a string.
    // Round-trip via toFixed to avoid float precision artefacts (e.g. 0.1 + 0.2).
    payload.amount = Number((amountPence / 100).toFixed(2));
  }
  if (reason) {
    payload.reason = reason;
  }

  const res = await fetch(`${urls.api}/transaction/operation/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DNA refund failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function reverseTransaction({
  transactionId,
  reason,
}: {
  transactionId: string;
  reason?: string;
}): Promise<RefundResponse> {
  const token = await getWebApiAccessToken();
  const urls = getDnaUrls();

  const payload: Record<string, unknown> = { id: transactionId };
  if (reason) {
    payload.reason = reason;
  }

  const res = await fetch(`${urls.api}/transaction/operation/reversal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DNA reversal failed (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Attempt reversal first (pre-settlement, avoids fees), fall back to refund.
 */
export async function reverseOrRefund({
  transactionId,
  amountPence,
  reason,
}: RefundRequest): Promise<RefundResponse> {
  try {
    return await reverseTransaction({ transactionId, reason });
  } catch {
    return await refundTransaction({ transactionId, amountPence, reason });
  }
}

export { getTerminalId };
