import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../firebase';

function CreateSession() {
    const navigate = useNavigate();
    const [sessionName, setSessionName] = useState('');
    const [tasks, setTasks] = useState(['', '', '']);
    const [loading, setLoading] = useState(false);

    const handleTaskChange = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    const addTask = () => {
        setTasks([...tasks, '']);
    };

    const removeTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const sessionId = await createSession({
                name: sessionName,
                tasks: tasks.filter(t => t.trim() !== ''),
            });

            navigate(`/faculty/${sessionId}`);
        } catch (error) {
            alert('Error creating session: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center gap-2 text-white hover:text-maroon-300 transition"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
            </button>

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-maroon-700 to-maroon-900 p-1 rounded-2xl mb-4">
                        <div className="bg-black px-6 py-3 rounded-xl">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-maroon-400 to-white">
                                Create Lab Session
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400">Set up a new monitored lab session for your students</p>
                </div>

                {/* Form Container */}
                <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-maroon-600/50 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-maroon-700 to-maroon-900 p-6 border-b border-maroon-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-black/30 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Session Configuration</h2>
                                <p className="text-sm text-maroon-200">Configure your lab session details</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Session Name */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Session Name
                            </label>
                            <input
                                type="text"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                className="w-full bg-black/50 border-2 border-maroon-600/50 rounded-xl p-4 text-white 
                         placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition"
                                placeholder="e.g., Data Structures Lab - Week 5"
                                required
                            />
                        </div>

                        {/* Tasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 font-semibold text-white">
                                    <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    Lab Tasks ({tasks.length})
                                </label>
                                <span className="text-sm text-gray-400">Students will complete these in order</span>
                            </div>

                            <div className="space-y-3">
                                {tasks.map((task, index) => (
                                    <div key={index} className="flex gap-3 group">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-maroon-700 to-maroon-900 
                                  rounded-lg flex items-center justify-center text-white font-bold border-2 border-maroon-600">
                                            {index + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={task}
                                            onChange={(e) => handleTaskChange(index, e.target.value)}
                                            className="flex-1 bg-black/50 border-2 border-maroon-600/50 rounded-xl p-4 text-white 
                               placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 
                               focus:ring-maroon-500/50 transition"
                                            placeholder={`Task ${index + 1} - e.g., Implement Binary Search`}
                                            required
                                        />
                                        {tasks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTask(index)}
                                                className="flex-shrink-0 w-12 h-12 bg-red-600/20 hover:bg-red-600 border-2 border-red-600/50 
                                 rounded-lg flex items-center justify-center text-red-400 hover:text-white 
                                 transition group-hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Task Button */}
                            <button
                                type="button"
                                onClick={addTask}
                                className="mt-4 w-full bg-black/50 border-2 border-dashed border-maroon-600/50 rounded-xl p-4 
                         text-maroon-400 hover:text-maroon-300 hover:border-maroon-500 hover:bg-maroon-900/20 
                         transition flex items-center justify-center gap-2 font-semibold"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Another Task
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-maroon-600/30">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-maroon-700 to-maroon-900 text-white py-4 rounded-xl 
                         font-bold text-lg hover:from-maroon-600 hover:to-maroon-800 transition 
                         disabled:opacity-50 disabled:cursor-not-allowed border-2 border-maroon-600 
                         shadow-xl shadow-maroon-900/50 hover:shadow-2xl hover:scale-[1.02] 
                         active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Session...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Create Session & Start Monitoring
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex gap-3">
                        <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-200">
                            <p className="font-semibold mb-1">💡 Pro Tip</p>
                            <p>After creating the session, you'll receive a unique code. Share this code with your students so they can join and submit their work in real-time!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateSession;