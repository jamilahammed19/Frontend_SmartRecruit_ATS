import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllApplications, updateApplicationStatus, runAiScoring } from '../../services/applicationService';

// IMPORTING FROM THE SAME FOLDER NOW
import CandidateProfileModal from './CandidateProfileModal';

export default function HrCandidateSelection() {
    const { jobId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [viewingCandidate, setViewingCandidate] = useState(null);

    const [isBulkScoring, setIsBulkScoring] = useState(false);
    const [scoringProgress, setScoringProgress] = useState(0);

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

    const unscoredCandidates = candidates.filter(c => c.ai_match_score === null);

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
            if (a.ai_match_score === null && b.ai_match_score !== null) return -1;
            if (a.ai_match_score !== null && b.ai_match_score === null) return 1;

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

    const handleBulkAiScoring = async () => {
        if (unscoredCandidates.length === 0) return;
        setIsBulkScoring(true);
        setScoringProgress(0);

        for (let i = 0; i < unscoredCandidates.length; i++) {
            const app = unscoredCandidates[i];
            try {
                const result = await runAiScoring(app.id);
                setCandidates(prev => prev.map(c => 
                    c.id === app.id ? { ...c, ai_match_score: result.ai_match_score, ai_match_summary: result.ai_match_summary } : c
                ));
            } catch (err) {
                console.error(`Failed to score app ${app.id}`, err);
            }
            setScoringProgress(i + 1);
        }
        setIsBulkScoring(false);
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
                {/* Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8 space-y-6">
                        {unscoredCandidates.length > 0 ? (
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-6">
                                <h3 className="text-sm font-bold text-indigo-900 mb-2">
                                    ⚠️ {unscoredCandidates.length} Pending AI Reviews
                                </h3>
                                <button 
                                    onClick={handleBulkAiScoring} 
                                    disabled={isBulkScoring}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isBulkScoring ? `Scoring ${scoringProgress} / ${unscoredCandidates.length}` : "✨ Run AI Match Scoring"}
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 flex items-center gap-2">
                                <span className="text-emerald-600">✓</span>
                                <span className="text-sm font-bold text-emerald-800">All Scored by AI</span>
                            </div>
                        )}

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
                            <div key={candidate.id} className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors ${candidate.ai_match_score === null ? 'bg-amber-50 hover:bg-amber-100/50' : 'hover:bg-slate-50'}`}>
                                <div className="flex space-x-4 mb-4 md:mb-0">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm border flex-shrink-0">#{index + 1}</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {candidate.full_profile?.full_name || candidate.candidate_name}
                                            {candidate.ai_match_score === null && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] uppercase font-bold rounded-full">Not Scanned</span>
                                            )}
                                        </h3>
                                        <div className="text-sm text-slate-600 mt-1">Exp: {candidate.candidate_experience || 0} Yrs | Edu: <span className="capitalize">{candidate.candidate_education || 'N/A'}</span></div>
                                        <div className="text-sm text-slate-500 mt-1 line-clamp-1">Skills: {candidate.candidate_skills || 'None listed'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6 w-full md:w-auto ml-12 md:ml-0">
                                    
                                    <div className="text-center w-24">
                                        {candidate.ai_match_score !== null ? (
                                            <>
                                                <div className={`text-2xl font-black ${candidate.ai_match_score >= 800 ? 'text-emerald-600' : candidate.ai_match_score >= 500 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {candidate.ai_match_score}
                                                </div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400">/ 1000 Points</div>
                                            </>
                                        ) : (
                                            <div className="text-sm font-bold text-slate-400 italic">Pending AI</div>
                                        )}
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

            {/* --- REUSABLE CANDIDATE PROFILE MODAL --- */}
            <CandidateProfileModal 
                candidate={viewingCandidate} 
                onClose={() => setViewingCandidate(null)} 
                onShortlist={() => handleShortlist(viewingCandidate.id)}
                isUpdating={updatingId === viewingCandidate?.id}
            />
        </div>
    );
}