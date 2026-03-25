import * as admin from "firebase-admin";

function parsePrivateKey(): string | undefined {
  // Method 1: Check for a Base64-encoded key (most reliable for PaaS like Render)
  const b64Key = process.env.FIREBASE_PRIVATE_KEY_B64;
  if (b64Key) {
    try {
      return Buffer.from(b64Key, "base64").toString("utf-8");
    } catch {
      // not valid base64, ignore
    }
  }

  // Method 2: Standard raw key from env
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!rawKey) return undefined;

  return rawKey
    .replace(/\\n/g, "\n")
    .replace(/^"(.*)"$/s, "$1")
    .replace(/^'(.*)'$/s, "$1")
    .trim();
}

function initAdmin() {
  if (admin.apps.length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey();

  if (projectId && clientEmail && privateKey?.includes("BEGIN PRIVATE KEY")) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      console.log("Firebase Admin initialized with Service Account.");
      return;
    } catch (err: any) {
      console.error("Firebase Service Account init failed:", err.message);
    }
  }

  console.log("Firebase Admin initialized with Project ID only (no credentials).");
  admin.initializeApp({ projectId: projectId || "coast-competitions" });
}

initAdmin();

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
