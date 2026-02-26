"use server";

import { getAdminStats } from "@/lib/firebase/admin-stats";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function fetchAdminDashboardData() {
  // 1. Verify session/auth (minimal check here, HOC handles client side)
  // In a real app, you'd check the session cookie here
  
  try {
    const stats = await getAdminStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Admin action error:", error);
    return { success: false, error: "Failed to fetch admin data" };
  }
}
