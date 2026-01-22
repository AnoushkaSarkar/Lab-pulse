import { database } from '../firebase';
import { ref, set, get, push, onValue, remove } from 'firebase/database';

export const databaseService = {
  // Initialize lab session
  initializeLabSession: async (labId, labData) => {
    const labRef = ref(database, `labs/${labId}`);
    await set(labRef, {
      ...labData,
      createdAt: new Date().toISOString(),
      isActive: true
    });
  },

  // Add students to lab
  addStudentsToLab: async (labId, students) => {
    const studentsRef = ref(database, `labs/${labId}/students`);
    await set(studentsRef, students);
  },

  // Add tasks to lab
  addTasksToLab: async (labId, tasks) => {
    const tasksRef = ref(database, `labs/${labId}/tasks`);
    await set(tasksRef, tasks);
  },

  // Get lab data
  getLabData: (labId, callback) => {
    const labRef = ref(database, `labs/${labId}`);
    onValue(labRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  },

  // Submit student work
  submitWork: async (labId, studentId, taskId, submission) => {
    const submissionRef = ref(database, `labs/${labId}/submissions/${studentId}/${taskId}`);
    await set(submissionRef, {
      ...submission,
      submittedAt: new Date().toISOString(),
      status: 'completed'
    });
  },

  // Update task status
  updateTaskStatus: async (labId, studentId, taskId, status) => {
    const statusRef = ref(database, `labs/${labId}/status/${studentId}/${taskId}`);
    await set(statusRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  },

  // Get real-time status updates
  getStatusUpdates: (labId, callback) => {
    const statusRef = ref(database, `labs/${labId}/status`);
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  },

  // Get submissions
  getSubmissions: (labId, callback) => {
    const submissionsRef = ref(database, `labs/${labId}/submissions`);
    onValue(submissionsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  },

  // Initialize demo data
  initializeDemoData: async () => {
    const demoLabId = 'demo-lab-1';
    
    // Demo lab data
    await databaseService.initializeLabSession(demoLabId, {
      name: 'Introduction to React',
      description: 'Basic React concepts and components',
      facultyId: 'faculty-1',
      facultyName: 'Dr. Smith'
    });

    // Demo students
    const demoStudents = {
      'student-1': { name: 'Alice Johnson', email: 'alice@university.edu' },
      'student-2': { name: 'Bob Smith', email: 'bob@university.edu' },
      'student-3': { name: 'Charlie Brown', email: 'charlie@university.edu' },
      'student-4': { name: 'Diana Prince', email: 'diana@university.edu' },
      'student-5': { name: 'Eve Wilson', email: 'eve@university.edu' }
    };
    await databaseService.addStudentsToLab(demoLabId, demoStudents);

    // Demo tasks
    const demoTasks = {
      'task-1': { 
        title: 'Setup React Environment', 
        description: 'Create a new React application using create-react-app',
        difficulty: 'Easy'
      },
      'task-2': { 
        title: 'Create Component', 
        description: 'Build a reusable Button component with props',
        difficulty: 'Easy'
      },
      'task-3': { 
        title: 'State Management', 
        description: 'Implement useState hook for form handling',
        difficulty: 'Medium'
      },
      'task-4': { 
        title: 'API Integration', 
        description: 'Fetch data from a public API and display it',
        difficulty: 'Medium'
      },
      'task-5': { 
        title: 'Final Project', 
        description: 'Build a complete todo application',
        difficulty: 'Hard'
      }
    };
    await databaseService.addTasksToLab(demoLabId, demoTasks);

    return demoLabId;
  }
};
