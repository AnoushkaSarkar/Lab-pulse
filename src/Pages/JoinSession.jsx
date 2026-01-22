import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinSession, getSession } from '../firebase';

function JoinSession() {
    const navigate = useNavigate();
    const [sessionCode, setSessionCode] = useState('');
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const session = await getSession(sessionCode);
            if (!session) {
                alert('❌ Invalid session code. Please check and try again.');
                setLoading(false);
                return;
            }

            await joinSession(sessionCode, { name, rollNo });
            navigate(`/student/${sessionCode}`);
        } catch (error) {
            alert('Error joining session: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-maroon-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-64 h-64 bg-maroon-700 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-maroon-300 transition z-10"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
            </button>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-maroon-700 to-maroon-900 p-1 rounded-2xl mb-4">
                        <div className="bg-black px-6 py-3 rounded-xl">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-maroon-400 to-white">
                                Join Session
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400">Enter your details to join the lab session</p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-maroon-600/50 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-maroon-700 to-maroon-900 p-6 border-b border-maroon-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-black/30 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Student Information</h2>
                                <p className="text-sm text-maroon-200">Fill in your details below</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Session Code */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                </svg>
                                Session Code
                            </label>
                            <input
                                type="text"
                                value={sessionCode}
                                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                                className="w-full bg-black/50 border-2 border-maroon-600/50 rounded-xl p-4 text-white text-center
                         placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition font-mono text-2xl tracking-widest uppercase"
                                placeholder="XXXXXXXX"
                                maxLength="8"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-400">Enter the code provided by your instructor</p>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-maroon-600/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-500">Your Details</span>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border-2 border-maroon-600/50 rounded-xl p-4 text-white 
                         placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition"
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>

                        {/* Roll Number */}
                        <div>
                            <label className="flex items-center gap-2 font-semibold text-white mb-3">
                                <svg className="w-5 h-5 text-maroon-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Roll Number / ID
                            </label>
                            <input
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                                className="w-full bg-black/50 border-2 border-maroon-600/50 rounded-xl p-4 text-white 
                         placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 
                         focus:ring-maroon-500/50 transition font-mono uppercase"
                                placeholder="e.g., CS21001"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
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
                                        Joining Session...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Join Lab Session
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have a session code? Ask your instructor.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default JoinSession;