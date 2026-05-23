import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export const USER_PROFILE_SCHEMA_VERSION = 1;
export const USER_PROFILE_DEFAULT_REGION: CountryCode = "GB";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string; // stored as E.164, e.g. "+447700900000"
  displayName: string;
  profileCompletedAt: string | null;
  profileSchemaVersion: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserProfileInput {
  firstName: string;
  lastName: string;
  mobile: string;
}

export type ProfileValidationError =
  | { field: "firstName"; message: string }
  | { field: "lastName"; message: string }
  | { field: "mobile"; message: string };

export function validateProfileInput(
  input: UserProfileInput
): ProfileValidationError | null {
  const firstName = input.firstName?.trim() ?? "";
  const lastName = input.lastName?.trim() ?? "";
  const mobile = input.mobile?.trim() ?? "";

  if (firstName.length < 1 || firstName.length > 50) {
    return { field: "firstName", message: "Enter your first name." };
  }
  if (lastName.length < 1 || lastName.length > 50) {
    return { field: "lastName", message: "Enter your last name." };
  }

  const parsed = parsePhoneNumberFromString(mobile, USER_PROFILE_DEFAULT_REGION);
  if (!parsed || !parsed.isValid() || parsed.country !== USER_PROFILE_DEFAULT_REGION) {
    return {
      field: "mobile",
      message: "Enter a valid UK mobile number (e.g. 07700 900000).",
    };
  }
  if (parsed.getType() !== "MOBILE" && parsed.getType() !== "FIXED_LINE_OR_MOBILE") {
    return {
      field: "mobile",
      message: "Enter a UK mobile number — landlines are not accepted.",
    };
  }

  return null;
}

/** Normalises validated input — call only after validateProfileInput returns null. */
export function normaliseProfileInput(input: UserProfileInput): UserProfileInput {
  const parsed = parsePhoneNumberFromString(
    input.mobile.trim(),
    USER_PROFILE_DEFAULT_REGION
  );
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    mobile: parsed?.number ?? input.mobile.trim(), // E.164
  };
}

export function buildDisplayName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

/** Splits a displayName ("Jane Doe") into a best-guess first/last pair for pre-fill. */
export function splitDisplayName(displayName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!displayName) return { firstName: "", lastName: "" };
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Reads the current user's profile doc. Returns null if missing (i.e. the user
 * has not completed their profile yet). Safe to call without a profile existing.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    console.error("Firestore not initialized on client");
    return null;
  }

  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data() ?? {};
    return {
      uid,
      email: data.email ?? "",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      mobile: data.mobile ?? "",
      displayName:
        data.displayName ?? buildDisplayName(data.firstName ?? "", data.lastName ?? ""),
      profileCompletedAt:
        data.profileCompletedAt?.toDate?.()?.toISOString() ?? null,
      profileSchemaVersion: data.profileSchemaVersion ?? 0,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  return !!profile?.profileCompletedAt;
}
