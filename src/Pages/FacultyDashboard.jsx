import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listenToStudents, getSession } from '../firebase';

function FacultyDashboard() {
    const { sessionId } = useParams();
    const [students, setStudents] = useState({});
    const [session, setSession] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        getSession(sessionId).then(setSession);
        const unsubscribe = listenToStudents(sessionId, (data) => {
            setStudents(data);
        });
        return () => unsubscribe();
    }, [sessionId]);

    const getStatusColor = (status) => {
        const colors = {
            'not-started': 'bg-gray-700 border-gray-600',
            'in-progress': 'bg-yellow-500 border-yellow-400',
            'completed': 'bg-green-500 border-green-400'
        };
        return colors[status] || 'bg-gray-700 border-gray-600';
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return '✓';
        if (status === 'in-progress') return '⋯';
        return '○';
    };

    const viewSubmission = (student, taskIdx) => {
        const submission = student.submissions?.[taskIdx];
        if (submission) {
            setSelectedSubmission({
                studentName: student.name,
                rollNo: student.rollNo,
                taskIdx,
                ...submission
            });
        }
    };

    const calculateProgress = () => {
        let total = 0;
        let completed = 0;

        Object.values(students).forEach(student => {
            Object.values(student.taskStatus || {}).forEach(status => {
                total++;
                if (status === 'completed') completed++;
            });
        });

        return total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    };

    const getTaskStats = (taskIdx) => {
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;

        Object.values(students).forEach(student => {
            const status = student.taskStatus?.[taskIdx];
            if (status === 'completed') completed++;
            else if (status === 'in-progress') inProgress++;
            else notStarted++;
        });

        return { completed, inProgress, notStarted };
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    const progress = calculateProgress();
    const totalStudents = Object.keys(students).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black p-6">
            {/* Header Dashboard */}
            <div className="mb-6">
                <div className="bg-gradient-to-r from-maroon-700 to-maroon-900 rounded-2xl shadow-2xl p-8 border border-maroon-600">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">{session.name}</h1>
                            <p className="text-maroon-200">Faculty Mission Control</p>
                        </div>
                        <div className="bg-black/30 px-6 py-3 rounded-xl border border-maroon-500">
                            <div className="text-xs text-maroon-300 uppercase tracking-wider mb-1">Session Code</div>
                            <div className="text-2xl font-mono font-bold text-white">{sessionId.slice(0, 8)}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Students Count */}
                        <div className="bg-black/40 rounded-xl p-4 border border-maroon-500/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-maroon-600 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">{totalStudents}</div>
                                    <div className="text-xs text-gray-400 uppercase">Active Students</div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="bg-black/40 rounded-xl p-4 border border-maroon-500/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-600 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">{progress}%</div>
                                    <div className="text-xs text-gray-400 uppercase">Completion</div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="bg-black/40 rounded-xl p-4 border border-maroon-500/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">{session.tasks.length}</div>
                                    <div className="text-xs text-gray-400 uppercase">Total Tasks</div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-black/40 rounded-xl p-4 border border-maroon-500/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-600 p-3 rounded-lg animate-pulse">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-green-400">LIVE</div>
                                    <div className="text-xs text-gray-400 uppercase">Session Active</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Overall Progress</span>
                            <span className="font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden border border-maroon-500/50">
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Headers with Stats */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-4 border border-maroon-500/30">
                <div className="grid gap-4" style={{ gridTemplateColumns: `250px repeat(${session.tasks.length}, 1fr)` }}>
                    <div className="font-bold text-white text-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Student
                    </div>
                    {session.tasks.map((task, idx) => {
                        const stats = getTaskStats(idx);
                        return (
                            <div key={idx} className="text-center">
                                <div className="font-bold text-white mb-2">Task {idx + 1}</div>
                                <div className="text-xs text-gray-400 mb-2">{task}</div>
                                <div className="flex gap-1 justify-center text-xs">
                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                        ✓ {stats.completed}
                                    </span>
                                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">
                                        ⋯ {stats.inProgress}
                                    </span>
                                    <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded border border-gray-500/30">
                                        ○ {stats.notStarted}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Student Grid */}
            <div className="space-y-3">
                {Object.entries(students).map(([rollNo, student]) => (
                    <div key={rollNo} className="bg-black/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-maroon-500/30 hover:border-maroon-400/50 transition-all">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `250px repeat(${session.tasks.length}, 1fr)` }}>
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-maroon-700 to-maroon-900 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-maroon-500">
                                    {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-white text-lg">{student.name}</div>
                                    <div className="text-sm text-gray-400 font-mono">{rollNo}</div>
                                </div>
                            </div>

                            {session.tasks.map((_, taskIdx) => {
                                const status = student.taskStatus?.[taskIdx] || 'not-started';
                                return (
                                    <div
                                        key={taskIdx}
                                        onClick={() => viewSubmission(student, taskIdx)}
                                        className={`${getStatusColor(status)} rounded-lg p-4 cursor-pointer
                               hover:scale-105 transition-all text-white font-bold
                               flex items-center justify-center text-3xl border-2
                               ${status === 'completed' ? 'shadow-lg shadow-green-500/50' : ''}`}
                                    >
                                        {getStatusIcon(status)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {totalStudents === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-12 border border-maroon-500/30 inline-block">
                            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <div className="text-gray-400 text-xl mb-2">No students have joined yet</div>
                            <div className="text-gray-500 mb-4">Share the session code with your students</div>
                            <div className="bg-maroon-900/50 px-8 py-4 rounded-xl border-2 border-maroon-600 inline-block">
                                <div className="text-sm text-maroon-300 mb-1">Session Code</div>
                                <div className="text-4xl font-mono font-bold text-white tracking-wider">{sessionId.slice(0, 8)}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            {selectedSubmission && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div
                        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-auto border-2 border-maroon-600 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-maroon-700 to-maroon-900 p-6 border-b border-maroon-600">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        {selectedSubmission.studentName}
                                    </h3>
                                    <div className="flex gap-4 text-sm text-maroon-200">
                                        <span className="font-mono">{selectedSubmission.rollNo}</span>
                                        <span>•</span>
                                        <span>Task {selectedSubmission.taskIdx + 1}: {session.tasks[selectedSubmission.taskIdx]}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="bg-black/30 hover:bg-black/50 p-2 rounded-lg transition"
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Code Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="font-bold text-xl text-white">Code Submission</h4>
                                </div>
                                <div className="bg-black/60 rounded-xl p-6 border border-maroon-500/30 overflow-auto max-h-96">
                                    <pre className="text-green-400 font-mono text-sm">
                                        <code>{selectedSubmission.code}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Output Section */}
                            {selectedSubmission.output && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <h4 className="font-bold text-xl text-white">Program Output</h4>
                                    </div>
                                    <div className="bg-black/60 rounded-xl p-6 border border-maroon-500/30 overflow-auto max-h-64">
                                        <pre className="text-blue-400 font-mono text-sm">
                                            <code>{selectedSubmission.output}</code>
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="text-center text-gray-500 text-sm">
                                Submitted {new Date(selectedSubmission.timestamp).toLocaleString()}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-black/60 p-6 border-t border-maroon-600 flex justify-end">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="bg-gradient-to-r from-maroon-700 to-maroon-900 text-white px-8 py-3 rounded-xl font-semibold
                         hover:from-maroon-600 hover:to-maroon-800 transition border border-maroon-500 shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add shimmer animation to CSS */}
            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    );
}

export default FacultyDashboard;