import * as admin from "firebase-admin";
import { getOptionalEnv } from "@/lib/env";

if (!admin.apps.length) {
  const projectId = getOptionalEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getOptionalEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getOptionalEnv("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (projectId) {
    // Fallback for local development or build time if projectId is present
    admin.initializeApp({ projectId });
  } else {
    // Last resort for build time to avoid crashing
    admin.initializeApp({ projectId: "placeholder-project-id" });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
