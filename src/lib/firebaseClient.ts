"use client";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, update, remove } from "firebase/database";

// Your web app's Firebase configuration
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
let app: ReturnType<typeof initializeApp> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;

export function getFirebaseClient() {
  if (app && database) return { app, database };

  app = initializeApp(firebaseConfig);
  database = getDatabase(app);

  return { app, database };
}

// Helper functions for Firebase operations
export const firebaseOperations = {
  // Subscribe to real-time updates
  subscribeToPath: (path: string, callback: (data: any) => void) => {
    const { database } = getFirebaseClient();
    const dbRef = ref(database, path);
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    
    return unsubscribe;
  },

  // Write data
  writeData: (path: string, data: any) => {
    const { database } = getFirebaseClient();
    const dbRef = ref(database, path);
    return set(dbRef, data);
  },

  // Update data
  updateData: (path: string, data: any) => {
    const { database } = getFirebaseClient();
    const dbRef = ref(database, path);
    return update(dbRef, data);
  },

  // Push new data (generates unique key)
  pushData: (path: string, data: any) => {
    const { database } = getFirebaseClient();
    const dbRef = ref(database, path);
    return push(dbRef, data);
  },

  // Remove data
  removeData: (path: string) => {
    const { database } = getFirebaseClient();
    const dbRef = ref(database, path);
    return remove(dbRef);
  }
};
