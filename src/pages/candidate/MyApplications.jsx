import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/applicationService';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getMyApplications();
                setApplications(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // Helper to color-code status badges
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

    if (loading) return <div className="p-10 text-center text-slate-500">Loading your applications...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
            <p className="text-slate-500 mb-8">Track the status of roles you have applied for.</p>

            {applications.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-slate-200 text-slate-500">
                    You haven't applied to any jobs yet.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Applied</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {applications.map((app) => (
                                <tr key={app.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                        {app.job_title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusStyle(app.status)}`}>
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}