import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import CreateSession from './Pages/CreateSession';
import JoinSession from './Pages/JoinSession';
import FacultyDashboard from './Pages/FacultyDashboard';
import StudentView from './Pages/StudentView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/join" element={<JoinSession />} />
        <Route path="/faculty/:sessionId" element={<FacultyDashboard />} />
        <Route path="/student/:sessionId" element={<StudentView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;