import { Link } from 'react-router-dom';

export default function HrDashboard() {
    // Mock Data - We will replace this with real API data later!
    const stats = [
        { title: 'Active Jobs', value: '12', trend: '+2 this week', color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Total Candidates', value: '843', trend: '+18 this week', color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'New Applications', value: '47', trend: 'Needs review', color: 'text-amber-600', bg: 'bg-amber-100' },
        { title: 'Interviews Scheduled', value: '8', trend: 'Next 7 days', color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    const recentApplications = [
        { id: 1, name: 'Alice Johnson', job: 'Senior Frontend Engineer', date: 'Today, 10:30 AM', status: 'New' },
        { id: 2, name: 'Michael Smith', job: 'Product Manager', date: 'Yesterday', status: 'Screening' },
        { id: 3, name: 'Sarah Williams', job: 'Backend Developer (Django)', date: 'Oct 24, 2026', status: 'Interview' },
        { id: 4, name: 'David Brown', job: 'HR Coordinator', date: 'Oct 22, 2026', status: 'Offer Sent' },
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'New': return 'bg-blue-100 text-blue-700';
            case 'Screening': return 'bg-amber-100 text-amber-700';
            case 'Interview': return 'bg-purple-100 text-purple-700';
            case 'Offer Sent': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Here is what is happening with your recruitment pipeline today.</p>
                </div>
                <Link to="/hr/jobs/new" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Post New Job
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start">
                            <h3 className="text-slate-500 font-medium text-sm">{stat.title}</h3>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                {/* Just a simple dot icon for layout aesthetics */}
                                <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mt-4">{stat.value}</p>
                        <p className="text-sm font-medium text-slate-400 mt-2">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Applications</h3>
                    <Link to="/hr/candidates" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 text-sm text-slate-500">
                                <th className="px-6 py-4 font-medium">Candidate Name</th>
                                <th className="px-6 py-4 font-medium">Applied For</th>
                                <th className="px-6 py-4 font-medium">Applied Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentApplications.map((app) => (
                                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{app.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{app.job}</td>
                                    <td className="px-6 py-4 text-slate-500">{app.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
}