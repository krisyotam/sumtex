import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "texnique-v3.firebaseapp.com",
  projectId: "texnique-v3",
  storageBucket: "texnique-v3.firebasestorage.app",
  messagingSenderId: "REDACTED_SENDER_ID",
  appId: "1:REDACTED_SENDER_ID:web:f780a0440e4e78d0c1dd7e",
  measurementId: "REDACTED_MEASUREMENT_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
