import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllApplications } from '../../services/applicationService';
import { createInterview } from '../../services/interviewService';

export default function HrSelectedCandidates() {
    const { jobId } = useParams();
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [schedulingApp, setSchedulingApp] = useState(null);
    const [interviewData, setInterviewData] = useState({ 
        scheduled_time: '', 
        duration: 30, 
        location: '', 
        meeting_link: '', 
        notes: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await getAllApplications();
                const appsArray = Array.isArray(data) ? data : data.results || [];
                const shortlisted = appsArray.filter(app => 
                    app.job.toString() === jobId && ['under_review', 'interview_scheduled'].includes(app.status)
                ).sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0));
                setSelectedCandidates(shortlisted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, [jobId]);

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                application: schedulingApp.id,
                scheduled_time: new Date(interviewData.scheduled_time).toISOString(),
                duration: parseInt(interviewData.duration, 10),
                meeting_link: interviewData.meeting_link ? interviewData.meeting_link : null,
                location: interviewData.location ? interviewData.location : null,
                notes: interviewData.notes ? interviewData.notes : null,
            };

            await createInterview(payload);
            
            setSelectedCandidates(prev => prev.map(app => 
                app.id === schedulingApp.id ? { ...app, status: 'interview_scheduled' } : app
            ));
            
            setSchedulingApp(null);
            setInterviewData({ scheduled_time: '', duration: 30, location: '', meeting_link: '', notes: '' });
            alert("Interview scheduled successfully!");
            
        } catch (err) {
            console.error("Backend Error:", err);
            
            let errorMessage = "Failed to schedule interview. Ensure the date/time are valid.";
            
            if (err.response) {
                if (err.response.status === 404) {
                    errorMessage = "404 Error: Django cannot find the '/api/interviews/schedules/' URL. Please check your Django urls.py!";
                } else if (typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
                    errorMessage = "Django crashed and returned an HTML page. Check your Django terminal for the real error.";
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            }
            
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <Link to={`/hr/pending-jobs/${jobId}/candidates`} className="text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center">
                ← Back to Selection Room
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Schedule Interviews</h1>
                <p className="text-slate-500 mt-2">Manage your shortlisted candidates.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {selectedCandidates.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No candidates have been shortlisted yet.</div>
                ) : (
                    selectedCandidates.map((candidate) => (
                        <div key={candidate.id} className="p-6 flex justify-between items-center hover:bg-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{candidate.candidate_name}</h3>
                                <div className="text-sm text-slate-500 mt-1">Exp: {candidate.candidate_experience || 0} Yrs | AI Match: {candidate.ai_match_score || 'N/A'}%</div>
                            </div>
                            <div>
                                {candidate.status === 'under_review' ? (
                                    <button onClick={() => setSchedulingApp(candidate)} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700">
                                        📅 Schedule Interview
                                    </button>
                                ) : (
                                    <span className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-lg">✓ Scheduled</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Scheduling Modal */}
            {schedulingApp && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold">Schedule: {schedulingApp.candidate_name}</h2></div>
                        <form onSubmit={handleScheduleSubmit}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Date & Time *</label>
                                        <input type="datetime-local" required className="w-full border rounded p-2 text-sm" value={interviewData.scheduled_time} onChange={e => setInterviewData({...interviewData, scheduled_time: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Duration (mins) *</label>
                                        <input type="number" required min="15" className="w-full border rounded p-2 text-sm" value={interviewData.duration} onChange={e => setInterviewData({...interviewData, duration: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Meeting Link (Virtual)</label>
                                    <input type="url" className="w-full border rounded p-2 text-sm" value={interviewData.meeting_link} onChange={e => setInterviewData({...interviewData, meeting_link: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Physical Location</label>
                                    <input type="text" className="w-full border rounded p-2 text-sm" value={interviewData.location} onChange={e => setInterviewData({...interviewData, location: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Notes to Candidate</label>
                                    <textarea rows="2" className="w-full border rounded p-2 text-sm" value={interviewData.notes} onChange={e => setInterviewData({...interviewData, notes: e.target.value})} />
                                </div>
                            </div>
                            <div className="p-6 border-t flex justify-end space-x-3">
                                <button type="button" onClick={() => setSchedulingApp(null)} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 text-sm font-bold">
                                    {isSubmitting ? 'Confirming...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}