import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, update, get } from 'firebase/database';

// 🔥 REPLACE THIS WITH YOUR FIREBASE CONFIG
// Go to: https://console.firebase.google.com
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Create new session
export const createSession = async (sessionData) => {
    const sessionRef = push(ref(db, 'sessions'));
    const sessionId = sessionRef.key;

    await set(sessionRef, {
        ...sessionData,
        sessionId,
        createdAt: Date.now(),
        isActive: true
    });

    return sessionId;
};

// Join session as student
export const joinSession = async (sessionId, studentData) => {
    const studentRef = ref(db, `students/${sessionId}/${studentData.rollNo}`);
    const session = await getSession(sessionId);

    const taskStatus = {};
    session.tasks.forEach((_, index) => {
        taskStatus[index] = 'not-started';
    });

    await set(studentRef, {
        name: studentData.name,
        rollNo: studentData.rollNo,
        taskStatus,
        joinedAt: Date.now()
    });

    localStorage.setItem(`student_${sessionId}`, JSON.stringify(studentData));

    return true;
};

// Submit task
export const submitTask = async (sessionId, rollNo, taskIndex, submission) => {
    const updates = {};
    updates[`students/${sessionId}/${rollNo}/submissions/${taskIndex}`] = {
        ...submission,
        timestamp: Date.now()
    };
    updates[`students/${sessionId}/${rollNo}/taskStatus/${taskIndex}`] = 'completed';

    await update(ref(db), updates);
};

// Listen to real-time updates
export const listenToStudents = (sessionId, callback) => {
    const studentsRef = ref(db, `students/${sessionId}`);
    return onValue(studentsRef, (snapshot) => {
        callback(snapshot.val() || {});
    });
};

// Get session details
export const getSession = async (sessionId) => {
    const snapshot = await get(ref(db, `sessions/${sessionId}`));
    return snapshot.val();
};