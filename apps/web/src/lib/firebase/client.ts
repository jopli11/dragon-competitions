import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase Config Check:", {
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeyStart: firebaseConfig.apiKey?.substring(0, 5),
  projectId: firebaseConfig.projectId
});

// @ts-ignore - Firebase types can be tricky in some environments
let app: FirebaseApp = null as any;
// @ts-ignore
let db: Firestore = null as any;
// @ts-ignore
let auth: Auth = null as any;

  if (typeof window !== "undefined") {
    try {
      if (!getApps().length) {
        if (process.env.NODE_ENV !== "production") {
          console.log("Initializing Firebase with config:", {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain
          });
        }
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }
      db = getFirestore(app);
      auth = getAuth(app);
      if (process.env.NODE_ENV !== "production") {
        console.log("Firebase Auth initialized successfully");
      }
    } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, db, auth };
