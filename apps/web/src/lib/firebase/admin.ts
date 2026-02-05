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
  } else {
    // Fallback for local development if using FIREBASE_AUTH_EMULATOR_HOST or similar
    if (process.env.NODE_ENV === "development" && projectId) {
      admin.initializeApp({ projectId });
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
