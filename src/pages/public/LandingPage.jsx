import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LandingPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* --- PUBLIC NAVBAR --- */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl leading-none">S</span>
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Smart<span className="text-blue-600">Careers</span>
                            </span>
                        </div>
                        <div className="flex space-x-4 items-center">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>

                                    <Link to="/login" className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                                        Create Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="flex-grow">
                <div className="relative overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                        <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold tracking-wide border border-blue-400/30 mb-6">
                            Join Our Team
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-tight">
                            Build your career with us. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Do work that matters.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                            We are always looking for innovative, driven individuals to join our mission. Create your candidate profile today to easily apply for our open roles and track your application status.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/register" className="px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5">
                                Start Your Application
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- FEATURES SECTION --- */}
                <div className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900">Your Journey Starts Here</h2>
                            <p className="mt-4 text-slate-500">A seamless application process designed with you in mind.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">One-Time Profile Setup</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Fill out your education, experience, and skills once. Use your profile to apply for any future openings with a single click.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Tracking</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    No more guessing. Log in at any time to see exactly where your application stands in our review process.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Data Privacy</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Your information is stored securely on our internal servers and is only visible to our authorized hiring managers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- SIMPLE PUBLIC FOOTER --- */}
            <footer className="bg-slate-900 border-t border-slate-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-400 text-sm">© 2026 Your Company Name. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}