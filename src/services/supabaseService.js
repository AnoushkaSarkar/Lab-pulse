import { supabase } from '../supabase';

export const supabaseService = {
  // Initialize lab session
  initializeLabSession: async (labData) => {
    const { data, error } = await supabase
      .from('labs')
      .insert([{
        ...labData,
        created_at: new Date().toISOString(),
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add students to lab
  addStudentsToLab: async (labId, students) => {
    const studentRecords = Object.entries(students).map(([studentId, student]) => ({
      lab_id: labId,
      student_id: studentId,
      name: student.name,
      email: student.email
    }));

    const { data, error } = await supabase
      .from('lab_students')
      .insert(studentRecords)
      .select();

    if (error) throw error;
    return data;
  },

  // Add tasks to lab
  addTasksToLab: async (labId, tasks) => {
    const taskRecords = Object.entries(tasks).map(([taskId, task]) => ({
      lab_id: labId,
      task_id: taskId,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty
    }));

    const { data, error } = await supabase
      .from('lab_tasks')
      .insert(taskRecords)
      .select();

    if (error) throw error;
    return data;
  },

  // Get lab data
  getLabData: async (labId) => {
    const [labResult, studentsResult, tasksResult] = await Promise.all([
      supabase.from('labs').select('*').eq('id', labId).single(),
      supabase.from('lab_students').select('*').eq('lab_id', labId),
      supabase.from('lab_tasks').select('*').eq('lab_id', labId)
    ]);

    if (labResult.error) throw labResult.error;
    if (studentsResult.error) throw studentsResult.error;
    if (tasksResult.error) throw tasksResult.error;

    const students = {};
    studentsResult.data.forEach(student => {
      students[student.student_id] = {
        name: student.name,
        email: student.email
      };
    });

    const tasks = {};
    tasksResult.data.forEach(task => {
      tasks[task.task_id] = {
        title: task.title,
        description: task.description,
        difficulty: task.difficulty
      };
    });

    return {
      ...labResult.data,
      students,
      tasks
    };
  },

  // Submit student work
  submitWork: async (labId, studentId, taskId, submission) => {
    const { data, error } = await supabase
      .from('submissions')
      .upsert([{
        lab_id: labId,
        student_id: studentId,
        task_id: taskId,
        code: submission.code,
        output: submission.output,
        submitted_at: new Date().toISOString(),
        status: 'completed'
      }])
      .select()
      .single();

    if (error) throw error;

    // Update task status
    await supabase
      .from('task_status')
      .upsert([{
        lab_id: labId,
        student_id: studentId,
        task_id: taskId,
        status: 'completed',
        updated_at: new Date().toISOString()
      }]);

    return data;
  },

  // Update task status
  updateTaskStatus: async (labId, studentId, taskId, status) => {
    const { data, error } = await supabase
      .from('task_status')
      .upsert([{
        lab_id: labId,
        student_id: studentId,
        task_id: taskId,
        status,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get status updates
  subscribeToStatusUpdates: (labId, callback) => {
    const subscription = supabase
      .channel('task_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_status',
          filter: `lab_id=eq.${labId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  },

  // Get submissions
  subscribeToSubmissions: (labId, callback) => {
    const subscription = supabase
      .channel('submission_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `lab_id=eq.${labId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  },

  // Get current status data
  getCurrentStatus: async (labId) => {
    const { data, error } = await supabase
      .from('task_status')
      .select('*')
      .eq('lab_id', labId);

    if (error) throw error;

    const statusData = {};
    data.forEach(status => {
      if (!statusData[status.student_id]) {
        statusData[status.student_id] = {};
      }
      statusData[status.student_id][status.task_id] = {
        status: status.status,
        updatedAt: status.updated_at
      };
    });

    return statusData;
  },

  // Get current submissions
  getCurrentSubmissions: async (labId) => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('lab_id', labId);

    if (error) throw error;

    const submissionsData = {};
    data.forEach(submission => {
      if (!submissionsData[submission.student_id]) {
        submissionsData[submission.student_id] = {};
      }
      submissionsData[submission.student_id][submission.task_id] = {
        code: submission.code,
        output: submission.output,
        submittedAt: submission.submitted_at,
        status: submission.status
      };
    });

    return submissionsData;
  },

  // Initialize demo data
  initializeDemoData: async () => {
    try {
      // Create demo lab
      const labData = await supabaseService.initializeLabSession({
        name: 'Introduction to React',
        description: 'Basic React concepts and components',
        faculty_id: 'faculty-1',
        faculty_name: 'Dr. Smith'
      });

      const labId = labData.id;

      // Add demo students
      const demoStudents = {
        'student-1': { name: 'Alice Johnson', email: 'alice@university.edu' },
        'student-2': { name: 'Bob Smith', email: 'bob@university.edu' },
        'student-3': { name: 'Charlie Brown', email: 'charlie@university.edu' },
        'student-4': { name: 'Diana Prince', email: 'diana@university.edu' },
        'student-5': { name: 'Eve Wilson', email: 'eve@university.edu' }
      };
      await supabaseService.addStudentsToLab(labId, demoStudents);

      // Add demo tasks
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
      await supabaseService.addTasksToLab(labId, demoTasks);

      return labId;
    } catch (error) {
      console.error('Error initializing demo data:', error);
      throw error;
    }
  }
};
