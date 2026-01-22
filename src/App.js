import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FacultyDashboard from './components/FacultyDashboard';
import StudentInterface from './components/StudentInterface';
import QuickLogin from './components/QuickLogin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/student" element={<StudentInterface />} />
          <Route path="/" element={<QuickLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
