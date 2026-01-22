import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import FacultyDashboard from './components/FacultyDashboard';
import StudentInterface from './components/StudentInterface';
import Login from './components/Login';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setUserRole(user.email.includes('faculty') ? 'faculty' : 'student');
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/faculty" 
            element={
              user && userRole === 'faculty' ? 
              <FacultyDashboard /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/student" 
            element={
              user && userRole === 'student' ? 
              <StudentInterface /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={
              user ? 
              <Navigate to={userRole === 'faculty' ? '/faculty' : '/student'} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
