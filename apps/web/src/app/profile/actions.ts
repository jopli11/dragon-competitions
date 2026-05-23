"use server";

import { adminAuth, adminDb, admin } from "@/lib/firebase/admin";
import {
  buildDisplayName,
  normaliseProfileInput,
  USER_PROFILE_SCHEMA_VERSION,
  validateProfileInput,
  type UserProfileInput,
} from "@/lib/firebase/user-profile";

type SaveProfileResult =
  | { success: true }
  | { success: false; error: string; field?: "firstName" | "lastName" | "mobile" };

/**
 * Saves (creates or updates) the authenticated user's profile in users/{uid}.
 *
 * Verifies the ID token server-side so we can trust the uid + email pair, and
 * also mirrors the displayName into Firebase Auth so existing call sites that
 * read `user.displayName` keep working.
 */
export async function saveUserProfile(
  idToken: string,
  input: UserProfileInput
): Promise<SaveProfileResult> {
  if (!idToken) {
    return { success: false, error: "You must be logged in to save your profile." };
  }

  let uid: string;
  let email: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    uid = decoded.uid;
    if (!decoded.email) {
      return { success: false, error: "Your account is missing an email address." };
    }
    email = decoded.email;
  } catch (err) {
    console.error("saveUserProfile: token verification failed", err);
    return { success: false, error: "Session expired. Please log in again." };
  }

  const validationError = validateProfileInput(input);
  if (validationError) {
    return { success: false, error: validationError.message, field: validationError.field };
  }

  const normalised = normaliseProfileInput(input);
  const displayName = buildDisplayName(normalised.firstName, normalised.lastName);
  const now = admin.firestore.FieldValue.serverTimestamp();

  try {
    const ref = adminDb.collection("users").doc(uid);
    const existing = await ref.get();

    const baseUpdate = {
      uid,
      email,
      firstName: normalised.firstName,
      lastName: normalised.lastName,
      mobile: normalised.mobile,
      displayName,
      profileCompletedAt: now,
      profileSchemaVersion: USER_PROFILE_SCHEMA_VERSION,
      updatedAt: now,
    };

    if (existing.exists) {
      await ref.update(baseUpdate);
    } else {
      await ref.set({ ...baseUpdate, createdAt: now });
    }

    // Best-effort mirror into Firebase Auth so legacy `user.displayName` reads
    // (e.g. dashboard greeting) reflect the new value. Failures here are
    // non-fatal — the Firestore profile is the source of truth.
    try {
      await adminAuth.updateUser(uid, { displayName });
    } catch (mirrorErr) {
      console.warn("saveUserProfile: failed to mirror displayName into Auth", mirrorErr);
    }

    return { success: true };
  } catch (err) {
    console.error("saveUserProfile: write failed", err);
    return {
      success: false,
      error: "Couldn't save your profile. Please try again.",
    };
  }
}
