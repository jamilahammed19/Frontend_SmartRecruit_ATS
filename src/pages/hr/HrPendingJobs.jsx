import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobService';

export default function HrPendingJobs() {
    const [pendingJobs, setPendingJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                const jobsArray = Array.isArray(data) ? data : data.results || [];
                
                // --- NEW LOGIC: Just trust the backend status! ---
                // We only want jobs that the backend has flipped to 'processing'
                const processingJobs = jobsArray.filter(job => job.status === 'processing');

                setPendingJobs(processingJobs);
            } catch (err) {
                console.error("Failed to load jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading pending processes...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Action Required: Pending Jobs</h1>
                <p className="text-slate-500 mt-2">These jobs have passed their deadline and require AI Candidate Selection.</p>
            </div>

            {pendingJobs.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-slate-500">
                    No pending jobs at the moment. All deadlines are in the future or processing is complete.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingJobs.map(job => (
                        <Link 
                            key={job.id} 
                            to={`/hr/pending-jobs/${job.id}`} 
                            className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group block"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full tracking-wider">
                                    Processing Stage
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                            <p className="text-sm text-slate-500 mt-1">{job.department} • {job.location}</p>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                                <span className="text-slate-500">Ended: {job.deadline}</span>
                                <span className="font-medium text-amber-600 group-hover:text-amber-700">Start Process →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}