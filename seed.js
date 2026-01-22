// Run this script to seed the database with sample users
// Usage: node seed.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFaiyhBnrEeEry_kl71dsSULsPAImldzE",
  authDomain: "labpulse-71943.firebaseapp.com",
  databaseURL: "https://labpulse-71943-default-rtdb.firebaseio.com",
  projectId: "labpulse-71943",
  storageBucket: "labpulse-71943.firebasestorage.app",
  messagingSenderId: "261253505761",
  appId: "1:261253505761:web:997ecee955cb20dfa7cda0",
  measurementId: "G-1T7H1DSCEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample users
const sampleUsers = {
  "faculty_1": {
    id: "faculty_1",
    username: "faculty",
    password: "faculty",
    role: "faculty",
    school: "STME",
    batchYear: "2nd year"
  },
  "student_1": {
    id: "student_1",
    username: "student",
    password: "student",
    role: "student",
    school: "STME",
    batchYear: "2nd year"
  },
  "faculty_2": {
    id: "faculty_2",
    username: "prof_john",
    password: "prof123",
    role: "faculty",
    school: "SOL",
    batchYear: "3rd year"
  },
  "student_2": {
    id: "student_2",
    username: "alice_student",
    password: "alice123",
    role: "student",
    school: "SOL",
    batchYear: "3rd year"
  }
};

// Seed the database
async function seedDatabase() {
  try {
    console.log('Seeding database with sample users...');
    
    await set(ref(database, 'users'), sampleUsers);
    
    console.log('✅ Sample users seeded successfully!');
    console.log('Login credentials:');
    console.log('Faculty: username=faculty, password=faculty');
    console.log('Student: username=student, password=student');
    console.log('Faculty 2: username=prof_john, password=prof123');
    console.log('Student 2: username=alice_student, password=alice123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
