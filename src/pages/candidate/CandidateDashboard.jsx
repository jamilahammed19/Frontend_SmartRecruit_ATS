import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../services/applicationService';

export default function CandidateDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getMyApplications();
                setApplications(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error("Failed to load applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // Calculate metrics
    const totalApps = applications.length;
    const activeApps = applications.filter(a => ['applied', 'under_review', 'interview_scheduled'].includes(a.status)).length;
    const offers = applications.filter(a => ['offered', 'hired'].includes(a.status)).length;
    
    // Get only the 3 most recent applications for the preview list
    const recentApps = applications.slice(0, 3);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'under_review': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'interview_scheduled': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'offered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'hired': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
            
            {/* --- HEADER --- */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back! <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">✨</span>
                </h1>
                <p className="mt-2 text-lg text-slate-500">Here is what's happening with your job applications today.</p>
            </div>

            {/* --- METRICS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Metric Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Applications</p>
                        <p className="text-3xl font-bold text-slate-900">{loading ? '-' : totalApps}</p>
                    </div>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active / In Review</p>
                        <p className="text-3xl font-bold text-slate-900">{loading ? '-' : activeApps}</p>
                    </div>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Offers Received</p>
                        <p className="text-3xl font-bold text-slate-900">{loading ? '-' : offers}</p>
                    </div>
                </div>
            </div>

            {/* --- MAIN LAYOUT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
                        <Link to="/my-applications" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                            Loading your data...
                        </div>
                    ) : recentApps.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No applications yet</h3>
                            <p className="text-slate-500 text-sm mt-1 mb-6">You haven't applied to any open positions.</p>
                            <Link to="/find-jobs" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                            {recentApps.map((app) => (
                                <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">{app.job_title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border capitalize ${getStatusStyle(app.status)}`}>
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Quick Actions & Profile Status */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col space-y-3">
                        <Link to="/find-jobs" className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl transition-all group">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">🔍 Search Open Roles</span>
                            <span className="text-slate-400 group-hover:text-blue-600">→</span>
                        </Link>
                        <Link to="/profile-edit" className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl transition-all group">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">📝 Update My CV</span>
                            <span className="text-slate-400 group-hover:text-blue-600">→</span>
                        </Link>
                    </div>

                    {/* Profile Completeness Widget */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-bold mb-2 relative z-10">Stand Out!</h3>
                        <p className="text-slate-300 text-sm mb-6 relative z-10 leading-relaxed">
                            Complete your profile by adding your latest experiences and projects to boost your chances.
                        </p>
                        <Link to="/profile-edit" className="inline-flex w-full justify-center px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/10 transition-colors relative z-10">
                            Edit Profile
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}