import { supabase } from '../supabase';

// Demo users for testing
const demoUsers = {
  faculty: {
    email: 'faculty@demo.com',
    password: 'password',
    role: 'faculty'
  },
  student: {
    email: 'student@demo.com', 
    password: 'password',
    role: 'student'
  }
};

export const authService = {
  // Sign in with username and password
  signIn: async (username, password) => {
    // Check if it's a demo user
    const demoUser = demoUsers[username];
    if (demoUser && demoUser.password === password) {
      // Create mock session for demo user
      const mockUser = {
        id: username === 'faculty' ? 'faculty-1' : 'student-1',
        email: demoUser.email,
        user_metadata: {
          username: username,
          role: demoUser.role
        }
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('lab-pulse-user', JSON.stringify(mockUser));
      
      return {
        user: mockUser,
        session: { user: mockUser }
      };
    }
    
    // For non-demo users, use Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    localStorage.removeItem('lab-pulse-user');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    // Check localStorage first for demo users
    const storedUser = localStorage.getItem('lab-pulse-user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Fall back to Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    // For demo users, we'll use a simple interval check
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem('lab-pulse-user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      callback('SIGNED_IN', { user });
    };

    // Initial check
    checkStoredUser();
    
    // Set up interval to check for changes
    const interval = setInterval(checkStoredUser, 1000);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => clearInterval(interval)
        }
      }
    };
  },

  // Get user role based on username or email
  getUserRole: (email, username) => {
    // Check username first
    if (username === 'faculty') return 'faculty';
    if (username === 'student') return 'student';
    
    // Fall back to email check
    if (email?.includes('faculty')) return 'faculty';
    if (email?.includes('student')) return 'student';
    
    return null;
  }
};
