import { useState, useEffect } from 'react';
import { getMyInterviews, deleteInterview } from '../../services/interviewService';
import { updateApplicationStatus } from '../../services/applicationService'; // <-- NEW IMPORT

export default function HrInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null); // Track button loading states

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await getMyInterviews();
                setInterviews(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error("Failed to fetch interviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    const formatDateTime = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this interview? This will move the candidate back to the Shortlisted stage.")) {
            try {
                await deleteInterview(id);
                setInterviews(prev => prev.filter(interview => interview.id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete the interview.");
            }
        }
    };

    // --- NEW: Handle Accept or Reject Decision ---
    const handleDecision = async (applicationId, decisionStatus, interviewId) => {
        const actionText = decisionStatus === 'offered' ? 'ACCEPT and Offer' : 'REJECT';
        if (window.confirm(`Are you sure you want to ${actionText} this candidate?`)) {
            setUpdatingId(interviewId);
            try {
                // Update the status in Django
                await updateApplicationStatus(applicationId, decisionStatus);
                
                // Instantly update the React UI
                setInterviews(prev => prev.map(inv =>
                    inv.id === interviewId ? { ...inv, application_status: decisionStatus } : inv
                ));
            } catch (err) {
                console.error("Failed to record decision:", err);
                alert("Failed to save decision. Please try again.");
            } finally {
                setUpdatingId(null);
            }
        }
    };

    const now = new Date();
    const upcomingInterviews = [];
    const pastInterviews = [];
    const cancelledInterviews = [];

    // Valid statuses for active interviews
    const activeStatuses = ['interview_scheduled', 'offered', 'hired'];

    interviews.forEach(interview => {
        if (!activeStatuses.includes(interview.application_status)) {
            cancelledInterviews.push(interview);
        } else if (new Date(interview.scheduled_time) >= now) {
            upcomingInterviews.push(interview);
        } else {
            pastInterviews.push(interview);
        }
    });

    if (loading) return <div className="p-10 text-center text-slate-500">Loading Interview Schedule...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Interview Schedule</h1>
                <p className="text-slate-500 mt-2">Manage upcoming interviews and evaluate candidates.</p>
            </div>

            {/* --- 1. UPCOMING INTERVIEWS --- */}
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Upcoming Interviews</h2>
            {upcomingInterviews.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-slate-500 mb-10">
                    No upcoming interviews scheduled.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {upcomingInterviews.map((interview) => {
                        const hasReschedule = interview.reschedule_requests?.some(req => req.status === 'pending');
                        return (
                            <div key={interview.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-all">
                                <div className="bg-purple-50 p-4 border-b border-purple-100 flex justify-between rounded-t-2xl relative group">
                                    <button onClick={() => handleDelete(interview.id)} className="absolute top-3 right-3 p-1.5 bg-white text-red-500 hover:text-white hover:bg-red-500 border border-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                    <div>
                                        <div className="text-xs font-bold text-purple-600 uppercase mb-1">{formatDateTime(interview.scheduled_time)}</div>
                                        <h3 className="font-bold text-slate-900 pr-8">{interview.candidate_name}</h3>
                                        <p className="text-sm text-slate-600 line-clamp-1">{interview.job_title}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-purple-100 text-center h-12 flex-shrink-0">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Mins</div>
                                        <div className="font-black text-purple-700 leading-none">{interview.duration}</div>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow space-y-3">
                                    {hasReschedule && <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs text-amber-800 font-bold">⚠️ Reschedule Requested</div>}
                                    <div className="text-sm text-slate-600"><span className="font-bold">Location:</span> {interview.location || 'Virtual'}</div>
                                    {interview.notes && <div className="text-sm text-slate-600"><span className="font-bold">Notes:</span> {interview.notes}</div>}
                                </div>

                                {/* --- UPCOMING ACTIONS (Join / Accept / Reject) --- */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col space-y-3">
                                    {interview.meeting_link ? (
                                        <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-sm transition-colors">📹 Join Meeting</a>
                                    ) : (
                                        <button className="w-full text-center px-4 py-2 bg-slate-200 text-slate-500 font-bold rounded-lg cursor-not-allowed">No Link Provided</button>
                                    )}

                                    {interview.application_status === 'interview_scheduled' ? (
                                        <div className="flex space-x-2 w-full">
                                            <button onClick={() => handleDecision(interview.application, 'rejected', interview.id)} disabled={updatingId === interview.id} className="flex-1 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg text-sm transition-colors disabled:opacity-50">Reject</button>
                                            <button onClick={() => handleDecision(interview.application, 'offered', interview.id)} disabled={updatingId === interview.id} className="flex-1 py-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold rounded-lg text-sm transition-colors disabled:opacity-50">Accept</button>
                                        </div>
                                    ) : (
                                        <div className="w-full text-center py-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-sm">✓ Candidate Accepted</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- 2. PAST INTERVIEWS --- */}
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Past Interviews (Awaiting Decision)</h2>
            {pastInterviews.length === 0 ? (
                <div className="bg-white p-6 text-center rounded-xl border border-slate-200 text-slate-500 mb-10">No past interviews awaiting review.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {pastInterviews.map((interview) => (
                        <div key={interview.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 relative group flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <button onClick={() => handleDelete(interview.id)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 bg-white rounded border border-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">{formatDateTime(interview.scheduled_time)}</div>
                                <h3 className="font-bold text-slate-800 pr-6">{interview.candidate_name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{interview.job_title}</p>
                            </div>

                            {/* --- PAST ACTIONS (Evaluate Candidate) --- */}
                            <div className="mt-5 pt-4 border-t border-slate-200">
                                {interview.application_status === 'interview_scheduled' ? (
                                    <div className="flex space-x-2 w-full">
                                        <button onClick={() => handleDecision(interview.application, 'rejected', interview.id)} disabled={updatingId === interview.id} className="flex-1 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">Reject</button>
                                        <button onClick={() => handleDecision(interview.application, 'offered', interview.id)} disabled={updatingId === interview.id} className="flex-1 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">Accept</button>
                                    </div>
                                ) : (
                                    <div className="w-full text-center py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold">✓ Candidate Accepted</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- 3. CANCELLED / REJECTED INTERVIEWS --- */}
            {cancelledInterviews.length > 0 && (
                <>
                    <h2 className="text-xl font-bold text-red-800 mb-4 border-b border-red-200 pb-2">Cancelled / Rejected</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                        {cancelledInterviews.map((interview) => (
                            <div key={interview.id} className="bg-red-50 rounded-xl border border-red-100 p-4 relative overflow-hidden group">
                                <button onClick={() => handleDelete(interview.id)} className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-white hover:bg-red-500 bg-white rounded border border-red-200 opacity-0 group-hover:opacity-100 transition-all z-10">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">
                                    {interview.application_status.replace('_', ' ')}
                                </div>
                                <div className="text-xs font-bold text-red-400 line-through mb-1">{formatDateTime(interview.scheduled_time)}</div>
                                <h3 className="font-bold text-slate-800 pr-6">{interview.candidate_name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{interview.job_title}</p>
                                
                                <p className="text-xs text-red-500 mt-2 italic font-medium">
                                    {interview.application_status === 'rejected' 
                                        ? 'Candidate was rejected after review.' 
                                        : 'Pipeline status changed. Interview invalidated.'}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}