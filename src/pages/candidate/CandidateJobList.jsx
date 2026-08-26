import { useState, useEffect } from 'react';
import { getJobs } from '../../services/jobService';
import { getMyApplications, applyForJob } from '../../services/applicationService';
import Button from '../../components/common/Button';

export default function CandidateJobList() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Modal State
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsData, appsData] = await Promise.all([
                    getJobs(),
                    getMyApplications()
                ]);
                
                const jobsArray = Array.isArray(jobsData) ? jobsData : jobsData.results || [];
                setJobs(jobsArray);

                const appsArray = Array.isArray(appsData) ? appsData : appsData.results || [];
                const appliedIds = new Set(appsArray.map(app => app.job));
                setAppliedJobIds(appliedIds);
            } catch (err) {
                setError('Failed to load available jobs.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenModal = (job) => {
        setSelectedJob(job);
        setCoverLetter('');
        setApplyError('');
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setApplying(true);
        setApplyError('');

        try {
            // No more resume file! Just passing ID and cover letter
            await applyForJob(selectedJob.id, coverLetter);
            setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
            setSelectedJob(null); // Close modal
            alert('Application submitted successfully!');
        } catch (err) {
            if (err.response?.data?.detail) {
                setApplyError(err.response.data.detail);
            } else if (err.response?.data?.non_field_errors) {
                setApplyError("You have already applied for this position.");
            } else {
                setApplyError("Failed to submit application. Ensure you have a candidate profile.");
            }
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Find Your Next Role</h1>
                <p className="mt-2 text-slate-500">Browse open positions and apply directly.</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-12">Loading available jobs...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
            ) : jobs.length === 0 ? (
                <div className="text-center text-slate-500 py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    No open positions at the moment.
                </div>
            ) : (
                <div className="space-y-6">
                    {jobs.map((job) => {
                        const hasApplied = appliedJobIds.has(job.id);
                        return (
                            <div key={job.id} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                                            <span className="bg-slate-100 px-2.5 py-1 rounded-md">{job.department}</span>
                                            <span>📍 {job.location}</span>
                                            <span className="text-amber-600">⌛ Apply by: {job.deadline}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        {hasApplied ? (
                                            <button disabled className="px-6 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg cursor-not-allowed">
                                                ✓ Applied
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleOpenModal(job)}
                                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-slate-600 whitespace-pre-line text-sm">{job.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- APPLY MODAL --- */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 md:p-8 relative">
                        <button 
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Apply for {selectedJob.title}</h2>
                        
                        {/* Updated instructions to reflect no file upload */}
                        <p className="text-sm text-slate-500 mb-6">Your SmartRecruit CV will be automatically attached. Include an optional cover letter below.</p>

                        {applyError && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{applyError}</div>}

                        <form onSubmit={handleSubmitApplication} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter (Optional)</label>
                                <textarea 
                                    rows="5" 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Why are you a great fit for this role?"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setSelectedJob(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <Button type="submit" isLoading={applying}>Submit Application</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}