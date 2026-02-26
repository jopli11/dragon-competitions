import * as admin from "firebase-admin";
import { getOptionalEnv } from "@/lib/env";

if (!admin.apps.length) {
  const projectId = getOptionalEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getOptionalEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getOptionalEnv("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n").replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  
  if (projectId && clientEmail && privateKey && privateKey.includes("BEGIN PRIVATE KEY") && process.env.NODE_ENV === "production") {
    console.log("Firebase Admin: Initializing with Cert Strategy (Production)");
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
      admin.initializeApp({ projectId });
    }
  } else if (projectId) {
    console.log("Firebase Admin: Initializing with Project ID fallback");
    admin.initializeApp({ projectId });
  } else {
    admin.initializeApp({ projectId: "placeholder-project-id" });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
