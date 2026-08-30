import { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/applicationService';

export default function HrApplicationList() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null); // For viewing cover letter

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await getAllApplications();
            setApplications(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError('Failed to fetch applications.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            // Update local state instantly so the UI feels fast
            setApplications(applications.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert("Failed to update status. Please try again.");
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'under_review': return 'bg-purple-100 text-purple-800';
            case 'interview_scheduled': return 'bg-amber-100 text-amber-800';
            case 'offered': return 'bg-emerald-100 text-emerald-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading applications...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Candidate Applications</h1>
                <p className="text-slate-500 text-sm mt-1">Review applicants and manage the hiring pipeline.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Candidate</th>
                                <th className="px-6 py-4 font-medium">Job Title</th>
                                <th className="px-6 py-4 font-medium">Applied Date</th>
                                <th className="px-6 py-4 font-medium">Pipeline Status</th>
                                <th className="px-6 py-4 font-medium text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {app.candidate_name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {app.job_title}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* INSTANT PIPELINE UPDATE DROPDOWN */}
                                            <select 
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer outline-none ${getStatusStyle(app.status)}`}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="under_review">Under Review</option>
                                                <option value="interview_scheduled">Interview Scheduled</option>
                                                <option value="offered">Offered</option>
                                                <option value="hired">Hired</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedApp(app)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- REVIEW MODAL --- */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative">
                        <button 
                            onClick={() => setSelectedApp(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl"
                        >
                            ✕
                        </button>
                        
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900">{selectedApp.candidate_name}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Applying for: <span className="text-slate-800">{selectedApp.job_title}</span></p>
                            
                            {/* AI Match Score Placeholder for later */}
                            {selectedApp.ai_match_score && (
                                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
                                    ✨ AI Match Score: {selectedApp.ai_match_score}%
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Cover Letter</h3>
                            {selectedApp.cover_letter ? (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto">
                                    {selectedApp.cover_letter}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm italic">No cover letter provided.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-4 flex justify-between items-center">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                {/* Link to Candidate's full CV profile will go here eventually */}
                                View Full Candidate Profile ↗
                            </button>
                            <button 
                                onClick={() => setSelectedApp(null)} 
                                className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}