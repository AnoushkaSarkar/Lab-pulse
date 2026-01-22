import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { databaseService } from '../services/databaseService';
import { Monitor, Users, CheckCircle, Clock, AlertCircle, LogOut } from 'lucide-react';

const FacultyDashboard = () => {
  const [labData, setLabData] = useState(null);
  const [statusData, setStatusData] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const initializeDemo = async () => {
      const labId = await databaseService.initializeDemoData();
      
      // Get lab data
      databaseService.getLabData(labId, (data) => {
        setLabData(data);
      });

      // Get status updates
      databaseService.getStatusUpdates(labId, (data) => {
        setStatusData(data || {});
      });

      // Get submissions
      databaseService.getSubmissions(labId, (data) => {
        setSubmissions(data || {});
      });
    };

    initializeDemo();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-not-started';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!labData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const students = labData.students || {};
  const tasks = labData.tasks || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Monitor className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Lab Pulse</h1>
                <p className="text-sm text-gray-500">{labData.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(students).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(statusData).flatMap(studentStatuses => 
                    Object.values(studentStatuses).filter(status => status?.status === 'completed').length
                  ).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(statusData).flatMap(studentStatuses => 
                    Object.values(studentStatuses).filter(status => status?.status === 'in-progress').length
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix View */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mission Control</h2>
            <p className="text-sm text-gray-600">Real-time student progress matrix</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  {Object.entries(tasks).map(([taskId, task]) => (
                    <th key={taskId} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-24">
                        <div className="font-semibold">{task.title}</div>
                        <div className="text-gray-400 mt-1">{task.difficulty}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(students).map(([studentId, student]) => (
                  <tr key={studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    {Object.entries(tasks).map(([taskId, task]) => {
                      const status = statusData[studentId]?.[taskId]?.status;
                      const submission = submissions[studentId]?.[taskId];
                      
                      return (
                        <td key={taskId} className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setSelectedTask(task);
                            }}
                            className={`status-cell ${getStatusColor(status)} hover:scale-105 cursor-pointer`}
                            title={`${student.name} - ${task.title}`}
                          >
                            {getStatusIcon(status)}
                          </button>
                          {submission && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(submission.submittedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submission Details Modal */}
        {selectedStudent && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedStudent.name} - {selectedTask.title}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedTask.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setSelectedTask(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                {(() => {
                  const studentId = Object.keys(students).find(id => students[id].name === selectedStudent.name);
                  const taskId = Object.keys(tasks).find(id => tasks[id].title === selectedTask.title);
                  const submission = submissions[studentId]?.[taskId];
                  
                  if (submission) {
                    return (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Submitted Code:</h4>
                          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                            {submission.code || 'No code submitted'}
                          </pre>
                        </div>
                        {submission.output && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Output:</h4>
                            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                              {submission.output}
                            </pre>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  
                  return <p className="text-gray-500">No submission yet</p>;
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
