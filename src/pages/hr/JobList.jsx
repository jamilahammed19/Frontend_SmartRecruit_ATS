import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, deleteJob } from '../../services/jobService';

export default function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            // DRF might return paginated data (e.g., data.results) or a flat array.
            setJobs(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError('Failed to fetch jobs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            try {
                await deleteJob(id);
                setJobs(jobs.filter(job => job.id !== id));
            } catch (err) {
                alert("Failed to delete job.");
            }
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'open': return 'bg-emerald-100 text-emerald-700';
            case 'processing': return 'bg-amber-100 text-amber-700';
            case 'completed': return 'bg-slate-100 text-slate-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading jobs...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all company open roles and hiring statuses.</p>
                </div>
                <Link to="/hr/jobs/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                    + Post New Job
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Job Title</th>
                                <th className="px-6 py-4 font-medium">Department</th>
                                <th className="px-6 py-4 font-medium">Deadline</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No jobs found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {job.title}
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">{job.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{job.department}</td>
                                        <td className="px-6 py-4 text-slate-600">{job.deadline}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link to={`/hr/jobs/edit/${job.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                                            <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}