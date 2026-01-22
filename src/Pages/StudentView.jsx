import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSession, submitTask, listenToStudents } from '../firebase';

function StudentView() {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [currentTask, setCurrentTask] = useState(0);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [myStatus, setMyStatus] = useState({});

    useEffect(() => {
        getSession(sessionId).then(setSession);

        const stored = localStorage.getItem(`student_${sessionId}`);
        if (stored) {
            const data = JSON.parse(stored);
            setStudentData(data);

            // Listen to own status updates
            const unsubscribe = listenToStudents(sessionId, (students) => {
                if (students[data.rollNo]) {
                    setMyStatus(students[data.rollNo].taskStatus || {});
                }
            });

            return () => unsubscribe();
        } else {
            window.location.href = '/join';
        }
    }, [sessionId]);

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert('⚠️ Please write some code first!');
            return;
        }

        setSubmitting(true);
        try {
            await submitTask(sessionId, studentData.rollNo, currentTask, {
                code,
                output
            });

            alert('✅ Submitted successfully!');
            setCode('');
            setOutput('');

            if (currentTask < session.tasks.length - 1) {
                setTimeout(() => setCurrentTask(currentTask + 1), 500);
            }
        } catch (error) {
            alert('Error submitting: ' + error.message);
        }
        setSubmitting(false);
    };

    const getTaskStatus = (taskIdx) => {
        return myStatus[taskIdx] || 'not-started';
    };

    const getTaskStatusBadge = (taskIdx) => {
        const status = getTaskStatus(taskIdx);
        if (status === 'completed') {
            return <span className="text-green-400">✓ Complete</span>;
        } else if (status === 'in-progress') {
            return <span className="text-yellow-400">⋯ In Progress</span>;
        }
        return <span className="text-gray-500">○ Not Started</span>;
    };

    if (!session || !studentData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    const completedTasks = Object.values(myStatus).filter(s => s === 'completed').length;
    const progressPercent = (completedTasks / session.tasks.length * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black p-6">
            <div className="max-w-6xl mx-auto">
                {/* Student Header */}
                <div className="bg-gradient-to-r from-maroon-700 to-maroon-900 rounded-2xl shadow-2xl p-6 mb-6 border border-maroon-600">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-black to-maroon-950 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-maroon-500">
                                {studentData.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{session.name}</h1>
                                <div className="flex gap-4 text-sm text-maroon-200">
                                    <span>{studentData.name}</span>
                                    <span>•</span>
                                    <span className="font-mono">{studentData.rollNo}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Badge */}
                        <div className="bg-black/40 px-6 py-3 rounded-xl border border-maroon-500">
                            <div className="text-xs text-maroon-300 uppercase tracking-wider mb-1">Your Progress</div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-white">{progressPercent}%</div>
                                <div className="text-sm text-gray-400">
                                    {completedTasks}/{session.tasks.length} tasks
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-maroon-500/50">
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Task Navigator */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-xl p-4 mb-6 border border-maroon-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-white">Select Task</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {session.tasks.map((task, idx) => {
                            const status = getTaskStatus(idx);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentTask(idx)}
                                    className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition border-2 flex-shrink-0
                    ${currentTask === idx
                                            ? 'bg-gradient-to-r from-maroon-700 to-maroon-900 text-white border-maroon-500 shadow-lg'
                                            : status === 'completed'
                                                ? 'bg-green-900/30 text-green-400 border-green-500/30 hover:bg-green-900/50'
                                                : 'bg-black/30 text-gray-300 border-maroon-600/30 hover:bg-black/50'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {status === 'completed' && <span>✓</span>}
                                        <span>Task {idx + 1}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Current Task Card */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-maroon-500/30 overflow-hidden">
                    {/* Task Header */}
                    <div className="bg-gradient-to-r from-maroon-700/50 to-maroon-900/50 p-6 border-b border-maroon-600/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-black/50 px-3 py-1 rounded-lg text-maroon-300 text-sm font-mono">
                                        Task {currentTask + 1} of {session.tasks.length}
                                    </span>
                                    {getTaskStatusBadge(currentTask)}
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    {session.tasks[currentTask]}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Task Body */}
                    <div className="p-6 space-y-6">
                        {/* Code Editor */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Your Code
                            </label>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-80 bg-black/60 border-2 border-maroon-600/50 rounded-xl p-4 text-green-400 
                         font-mono text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition resize-none"
                                placeholder="// Write your code here...
// Example:
function binarySearch(arr, target) {
    // Your implementation
}"
                            />
                        </div>

                        {/* Output */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Program Output (Optional)
                            </label>
                            <textarea
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                className="w-full h-40 bg-black/60 border-2 border-maroon-600/50 rounded-xl p-4 text-blue-400 
                         font-mono text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition resize-none"
                                placeholder="Paste your program output here..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-maroon-700 to-maroon-900 text-white py-4 rounded-xl 
                       font-bold text-lg hover:from-maroon-600 hover:to-maroon-800 transition 
                       disabled:opacity-50 disabled:cursor-not-allowed border-2 border-maroon-600 
                       shadow-xl shadow-maroon-900/50 hover:shadow-2xl hover:scale-[1.02] 
                       active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Submit Task {currentTask + 1}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex gap-3">
                        <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-200">
                            <p className="font-semibold mb-1">💡 Tip</p>
                            <p>Your instructor can see your progress in real-time. Submit each task as you complete it!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentView;