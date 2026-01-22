// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFaiyhBnrEeEry_kl71dsSULsPAImldzE",
  authDomain: "labpulse-71943.firebaseapp.com",
  projectId: "labpulse-71943",
  storageBucket: "labpulse-71943.firebasestorage.app",
  messagingSenderId: "261253505761",
  appId: "1:261253505761:web:997ecee955cb20dfa7cda0",
  measurementId: "G-1T7H1DSCEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
