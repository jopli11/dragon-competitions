import * as admin from "firebase-admin";

function initAdmin() {
  if (admin.apps.length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  const privateKey = rawKey
    ?.replace(/\\n/g, "\n")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");

  if (projectId && clientEmail && privateKey?.includes("BEGIN PRIVATE KEY")) {
    try {
      console.log("Initializing Firebase Admin with Service Account...");
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      return;
    } catch (err: any) {
      console.error("Firebase Service Account init failed:", err.message);
      // Fall through
    }
  }

  console.log("Initializing Firebase Admin with Project ID only (ADC)...");
  admin.initializeApp({ projectId: projectId || "coast-competitions" });
}

initAdmin();

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
