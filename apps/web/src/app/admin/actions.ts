"use server";

import { getAdminStats } from "@/lib/firebase/admin-stats";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function fetchAdminDashboardData(idToken: string) {
  if (!idToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    // 1. Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return { success: false, error: "Invalid token: missing email" };
    }

    // 2. Check if the user is an admin in Firestore
    const adminDoc = await adminDb.collection("admin_users").doc(email).get();
    const isAdmin = adminDoc.exists && adminDoc.data()?.isAdmin === true;

    if (!isAdmin) {
      console.warn(`Unauthorized admin access attempt by ${email}`);
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // 3. Fetch the stats
    const stats = await getAdminStats();
    return { success: true, data: stats };
  } catch (error: any) {
    console.error("Admin action error:", error);
    return { success: false, error: error.message || "Failed to fetch admin data" };
  }
}
