import { adminAuth } from "@/lib/firebase/admin";

export async function setAdmin(email: string) {
  try {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin claim for user: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Error setting admin claim:", error);
    return { success: false, error };
  }
}
