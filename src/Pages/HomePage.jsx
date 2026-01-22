import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomePage() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-maroon opacity-10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-maroon opacity-10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className={`text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Logo/Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-900 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
                    Lab<span className="text-red-600">Pulse</span>
                </h1>

                {/* Subtitle */}
                <div className="mb-4">
                    <div className="inline-block bg-red-900 bg-opacity-20 border border-red-800 rounded-full px-6 py-2">
                        <p className="text-red-400 text-sm font-semibold tracking-wider uppercase">
                            Real-Time Lab Monitoring System
                        </p>
                    </div>
                </div>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Monitor student progress in real-time. No more black boxes.
                    Complete visibility during lab sessions.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-6 justify-center flex-wrap">
                    <button
                        onClick={() => navigate('/create')}
                        className="group relative bg-gradient-to-r from-red-900 to-red-700 text-white px-10 py-5 rounded-xl text-lg font-bold
                     hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-red-900/50 
                     transform hover:scale-105 hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <div>
                                <div>Create Session</div>
                                <div className="text-xs font-normal text-red-200 opacity-90">For Faculty</div>
                            </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
                    </button>

                    <button
                        onClick={() => navigate('/join')}
                        className="group relative bg-white text-gray-900 px-10 py-5 rounded-xl text-lg font-bold
                     hover:bg-gray-100 transition-all duration-300 shadow-2xl
                     transform hover:scale-105 hover:-translate-y-1 border-2 border-gray-800"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <div>
                                <div>Join Session</div>
                                <div className="text-xs font-normal text-gray-600">For Students</div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        { icon: "⚡", title: "Real-Time Updates", desc: "Instant status sync" },
                        { icon: "📊", title: "Visual Dashboard", desc: "Clear progress matrix" },
                        { icon: "🔒", title: "Simple & Secure", desc: "Easy session codes" }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900 bg-opacity-50 backdrop-blur border border-gray-800 rounded-xl p-6 
                         hover:border-red-900 transition-all duration-300 hover:bg-opacity-70"
                            style={{ animationDelay: `${idx * 0.2}s` }}
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;