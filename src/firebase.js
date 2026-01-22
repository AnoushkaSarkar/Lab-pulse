import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDemoKey-ReplaceWithYourFirebaseConfig",
  authDomain: "lab-pulse-demo.firebaseapp.com",
  databaseURL: "https://lab-pulse-demo-default-rtdb.firebaseio.com",
  projectId: "lab-pulse-demo",
  storageBucket: "lab-pulse-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
