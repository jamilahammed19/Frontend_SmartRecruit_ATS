import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllApplications, updateApplicationStatus } from '../../services/applicationService';

export default function HrCandidateSelection() {
    const { jobId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [viewingCandidate, setViewingCandidate] = useState(null);

    const [filterEdu, setFilterEdu] = useState('');
    const [filterExp, setFilterExp] = useState('');
    const [searchSkill, setSearchSkill] = useState('');
    const [sortBy, setSortBy] = useState('ai_score'); 

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await getAllApplications();
                const appsArray = Array.isArray(data) ? data : data.results || [];
                setCandidates(appsArray.filter(app => app.job.toString() === jobId));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, [jobId]);

    const processedCandidates = useMemo(() => {
        let filtered = candidates.filter(candidate => {
            if (filterEdu && candidate.candidate_education && !candidate.candidate_education.toLowerCase().includes(filterEdu.toLowerCase())) return false;
            const exp = candidate.candidate_experience || 0;
            if (filterExp === '1-3' && (exp < 1 || exp > 3)) return false;
            if (filterExp === '3-5' && (exp < 3 || exp > 5)) return false;
            if (filterExp === '5+' && exp < 5) return false;
            if (searchSkill && candidate.candidate_skills && !candidate.candidate_skills.toLowerCase().includes(searchSkill.toLowerCase())) return false;
            return true;
        });

        return filtered.sort((a, b) => {
            if (sortBy === 'ai_score') return (b.ai_match_score || 0) - (a.ai_match_score || 0);
            if (sortBy === 'experience_high') return (b.candidate_experience || 0) - (a.candidate_experience || 0);
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            return 0;
        });
    }, [candidates, filterEdu, filterExp, searchSkill, sortBy]);

    const handleShortlist = async (appId) => {
        setUpdatingId(appId);
        try {
            await updateApplicationStatus(appId, 'under_review');
            setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status: 'under_review' } : c));
            if (viewingCandidate && viewingCandidate.id === appId) {
                setViewingCandidate(prev => ({...prev, status: 'under_review'}));
            }
        } catch (err) {
            alert("Failed to shortlist candidate.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading Candidates...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 space-y-4 md:space-y-0">
                <div>
                    <Link to={`/hr/pending-jobs/${jobId}`} className="text-sm font-medium text-slate-500 hover:text-blue-600 mb-4 inline-block">
                        ← Back to Job Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Candidate Selection</h1>
                    <p className="text-slate-500 mt-2">Filter, review full profiles, and shortlist applicants.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-slate-300 rounded-lg text-sm shadow-sm focus:ring-blue-500">
                        <option value="ai_score">AI Score (Highest)</option>
                        <option value="experience_high">Experience (Highest)</option>
                        <option value="newest">Newest First</option>
                    </select>
                    <Link to={`/hr/pending-jobs/${jobId}/interviews`} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 shadow-sm transition-colors">
                        Schedule Interviews ➡️
                    </Link>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-bold uppercase">Filters</h2>
                            <button onClick={() => { setFilterEdu(''); setFilterExp(''); setSearchSkill(''); }} className="text-xs text-blue-600 hover:text-blue-800">Clear</button>
                        </div>
                        <select className="w-full text-sm border-slate-300 rounded-lg bg-slate-50 p-2.5" value={filterEdu} onChange={(e) => setFilterEdu(e.target.value)}>
                            <option value="">All Education</option>
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree</option>
                            <option value="phd">PhD</option>
                        </select>
                        <select className="w-full text-sm border-slate-300 rounded-lg bg-slate-50 p-2.5" value={filterExp} onChange={(e) => setFilterExp(e.target.value)}>
                            <option value="">All Experience</option>
                            <option value="1-3">1 - 3 Years</option>
                            <option value="3-5">3 - 5 Years</option>
                            <option value="5+">5+ Years</option>
                        </select>
                        <input type="text" placeholder="Search skills (e.g. Python)" className="w-full text-sm border-slate-300 rounded-lg bg-slate-50 p-2.5" value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} />
                    </div>
                </div>

                {/* Candidate List */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {processedCandidates.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No matching candidates.</div>
                    ) : (
                        processedCandidates.map((candidate, index) => (
                            <div key={candidate.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-50 transition-colors">
                                <div className="flex space-x-4 mb-4 md:mb-0">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm border flex-shrink-0">#{index + 1}</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{candidate.candidate_name}</h3>
                                        <div className="text-sm text-slate-600 mt-1">Exp: {candidate.candidate_experience || 0} Yrs | Edu: <span className="capitalize">{candidate.candidate_education || 'N/A'}</span></div>
                                        <div className="text-sm text-slate-500 mt-1 line-clamp-1">Skills: {candidate.candidate_skills || 'None listed'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6 w-full md:w-auto ml-12 md:ml-0">
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${candidate.ai_match_score >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>{candidate.ai_match_score || 'N/A'}%</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400">AI Match</div>
                                    </div>
                                    
                                    <div className="flex flex-col space-y-2">
                                        <button onClick={() => setViewingCandidate(candidate)} className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                            View Full Profile
                                        </button>
                                        
                                        {candidate.status === 'applied' ? (
                                            <button onClick={() => handleShortlist(candidate.id)} disabled={updatingId === candidate.id} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors">
                                                {updatingId === candidate.id ? 'Saving...' : 'Shortlist'}
                                            </button>
                                        ) : (
                                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-lg text-center">
                                                ✓ Shortlisted
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- FULL CANDIDATE PROFILE MODAL --- */}
            {viewingCandidate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
                        
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold uppercase">
                                    {viewingCandidate.candidate_name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{viewingCandidate.candidate_name}</h2>
                                    <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                                        <span>✉️ {viewingCandidate.candidate_email || 'No email provided'}</span>
                                        <span>•</span>
                                        <span>Applied {new Date(viewingCandidate.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewingCandidate(null)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-grow space-y-8">
                            
                            {/* Key Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Experience</div>
                                    <div className="text-lg font-semibold text-slate-900">{viewingCandidate.candidate_experience || 0} Years</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Education</div>
                                    <div className="text-lg font-semibold text-slate-900 capitalize">{viewingCandidate.candidate_education || 'N/A'}</div>
                                </div>
                                <div className={`p-4 rounded-xl border ${viewingCandidate.ai_match_score >= 80 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                                    <div className="text-xs uppercase font-bold mb-1 opacity-75">AI Match Score</div>
                                    <div className="text-lg font-black">{viewingCandidate.ai_match_score || 'N/A'}%</div>
                                </div>
                            </div>

                            {/* Bio / About Me */}
                            {viewingCandidate.candidate_bio && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About Candidate</h3>
                                    <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                                        {viewingCandidate.candidate_bio}
                                    </p>
                                </div>
                            )}

                            {/* Links & Attachments */}
                            <div className="flex flex-wrap gap-4">
                                {viewingCandidate.candidate_resume && (
                                    <a href={viewingCandidate.candidate_resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                        📄 Download Resume
                                    </a>
                                )}
                                {viewingCandidate.candidate_portfolio && (
                                    <a href={viewingCandidate.candidate_portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                                        🔗 View Portfolio
                                    </a>
                                )}
                            </div>

                            {/* AI Summary Section */}
                            {viewingCandidate.ai_match_summary && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
                                        ✨ AI Summary & Recommendation
                                    </h3>
                                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
                                        {viewingCandidate.ai_match_summary}
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Reported Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {viewingCandidate.candidate_skills ? (
                                        viewingCandidate.candidate_skills.split(',').map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white shadow-sm text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
                                                {skill.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No specific skills listed.</span>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter Section */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Application Cover Letter</h3>
                                {viewingCandidate.cover_letter ? (
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                        {viewingCandidate.cover_letter}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        Candidate did not provide a cover letter for this specific role.
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center flex-shrink-0 relative z-50">
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${
                                viewingCandidate.status === 'applied' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                                Status: {viewingCandidate.status.replace('_', ' ')}
                            </span>
                            
                            <div className="flex space-x-3">
                                <button onClick={() => setViewingCandidate(null)} className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                                    Close Profile
                                </button>
                                
                                {viewingCandidate.status === 'applied' && (
                                    <button 
                                        onClick={() => handleShortlist(viewingCandidate.id)}
                                        disabled={updatingId === viewingCandidate.id}
                                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                    >
                                        {updatingId === viewingCandidate.id ? 'Shortlisting...' : 'Shortlist Candidate'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}