// Server-only helpers — depend on the firebase-admin SDK, which throws at
// import time in the browser. No explicit "server-only" import needed because
// the adminDb dependency makes this implicitly server-only.

import { adminDb } from "@/lib/firebase/admin";

export type WinnerContactSource = "users_doc" | "email_only";

export interface WinnerContact {
  email: string;
  uid: string | null;
  firstName: string | null;
  lastName: string | null;
  mobile: string | null;
  source: WinnerContactSource;
}

/**
 * Server-side existence check for `users/{uid}` with a completed profile.
 *
 * Returns true only when both the doc exists AND `profileCompletedAt` is set —
 * a defensive check so a half-written doc (e.g. a future schema migration that
 * pre-creates the row before the user fills it in) is treated as incomplete.
 */
export async function hasCompletedProfile(uid: string): Promise<boolean> {
  if (!uid) return false;
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return false;
  return Boolean(snap.data()?.profileCompletedAt);
}

/**
 * Resolves a winner's contact details from their order.
 *
 * Walks `orders/{orderId} → users/{order.uid}` so admins can call/text the
 * winner directly. Backwards-compat: legacy orders without a `uid`, or users
 * without a profile doc, fall through to `email_only` so the caller knows to
 * do manual outreach via email.
 */
export async function getWinnerContact(
  orderId: string,
  fallbackEmail: string
): Promise<WinnerContact> {
  const emailOnly: WinnerContact = {
    email: fallbackEmail,
    uid: null,
    firstName: null,
    lastName: null,
    mobile: null,
    source: "email_only",
  };

  if (!orderId) return emailOnly;

  const orderSnap = await adminDb.collection("orders").doc(orderId).get();
  if (!orderSnap.exists) return emailOnly;

  const orderData = orderSnap.data() ?? {};
  const uid: string | undefined = orderData.uid;
  // Prefer the order's email (it's what the rest of the draw pipeline keys on)
  // but fall back to the caller-supplied one if the order doc is missing it.
  const email: string = orderData.email || fallbackEmail;

  if (!uid) {
    return { ...emailOnly, email };
  }

  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) {
    return { ...emailOnly, email, uid };
  }

  const userData = userSnap.data() ?? {};
  if (!userData.profileCompletedAt) {
    return { ...emailOnly, email, uid };
  }

  return {
    email,
    uid,
    firstName: userData.firstName ?? null,
    lastName: userData.lastName ?? null,
    mobile: userData.mobile ?? null,
    source: "users_doc",
  };
}
