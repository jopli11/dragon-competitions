import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getOptionalEnv } from "@/lib/env";

const firebaseConfig = {
  apiKey: getOptionalEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getOptionalEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getOptionalEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getOptionalEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getOptionalEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getOptionalEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

// @ts-ignore - Firebase types can be tricky in some environments
let app: FirebaseApp = null as any;
// @ts-ignore
let db: Firestore = null as any;
// @ts-ignore
let auth: Auth = null as any;

if (typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, db, auth };
