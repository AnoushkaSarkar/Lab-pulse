// Test Firebase connection
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFaiyhBnrEeEry_kl71dsSULsPAImldzE",
  authDomain: "labpulse-71943.firebaseapp.com",
  projectId: "labpulse-71943",
  storageBucket: "labpulse-71943.firebasestorage.app",
  messagingSenderId: "261253505761",
  appId: "1:261253505761:web:997ecee955cb20dfa7cda0",
  measurementId: "G-1T7H1DSCEH"
};

console.log('Testing Firebase connection...');

try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized:', app);

  const database = getDatabase(app);
  console.log('Database reference:', database);

  // Test database connection
  const testRef = ref(database, 'test');
  set(testRef, { message: 'Firebase connection test', timestamp: new Date().toISOString() })
    .then(() => {
      console.log('✅ Firebase connection successful!');
    })
    .catch((error) => {
      console.error('❌ Firebase connection failed:', error);
    });

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}
