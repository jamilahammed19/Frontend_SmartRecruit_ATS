import React from 'react';

export default function CandidateProfileModal({ candidate, onClose, onShortlist, isUpdating }) {
    if (!candidate) return null;

    const fp = candidate.full_profile || {};

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col relative overflow-hidden">

                {/* MODAL HEADER */}
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start flex-shrink-0">
                    <div className="flex items-center space-x-5">
                        {fp.photo ? (
                            <img src={fp.photo} alt="Candidate" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
                                {(fp.full_name || candidate.candidate_name || "?").charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{fp.full_name || candidate.candidate_name}</h2>
                            <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1 font-medium">
                                {(fp.verified_email || candidate.candidate_email) && <span>✉️ {fp.verified_email || candidate.candidate_email}</span>}
                                {fp.phone_number && <span>📞 {fp.phone_number}</span>}
                                {fp.nationality && <span>🌍 {fp.nationality}</span>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-2 border hover:bg-slate-100 transition-colors">✕</button>
                </div>

                {/* MODAL BODY (TWO COLUMNS) */}
                <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
                    
                    {/* LEFT COLUMN: AI Match, Cover Letter, Basic Info */}
                    <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto space-y-8">
                        
                        {/* AI Score Box */}
                        <div className={`p-6 rounded-2xl border shadow-sm text-center ${candidate.ai_match_score >= 800 ? 'bg-emerald-50 border-emerald-200' : candidate.ai_match_score === null ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="text-xs uppercase font-black tracking-wider mb-2 opacity-75">AI Match Score</div>
                            <div className="text-5xl font-black">{candidate.ai_match_score !== null ? `${candidate.ai_match_score}` : 'N/A'}</div>
                            <div className="text-sm font-bold mt-1 opacity-75">Out of 1000</div>
                        </div>

                        {/* AI Summary */}
                        {candidate.ai_match_summary && (
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span>✨</span> AI Analysis
                                </h3>
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed font-medium">
                                    {candidate.ai_match_summary}
                                </div>
                            </div>
                        )}

                        {/* Cover Letter */}
                        {candidate.cover_letter && (
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Cover Letter</h3>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed shadow-sm">
                                    {candidate.cover_letter}
                                </div>
                            </div>
                        )}

                        {/* Personal Information Table */}
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Personal Details</h3>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                                {fp.gender && <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 font-medium">Gender</span><span className="font-bold text-slate-900 capitalize">{fp.gender}</span></div>}
                                {fp.date_of_birth && <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 font-medium">DOB</span><span className="font-bold text-slate-900">{fp.date_of_birth}</span></div>}
                                {fp.marital_status && <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 font-medium">Marital</span><span className="font-bold text-slate-900 capitalize">{fp.marital_status}</span></div>}
                                {fp.religion && <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 font-medium">Religion</span><span className="font-bold text-slate-900 capitalize">{fp.religion}</span></div>}
                                {fp.blood_group && <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 font-medium">Blood Group</span><span className="font-bold text-slate-900">{fp.blood_group}</span></div>}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Full Resume Data */}
                    <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto space-y-10 bg-white">
                        
                        {/* SKILLS */}
                        {fp.skills?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">⚡ Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {fp.skills.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-slate-50 text-slate-800 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">
                                            {skill.skill_name} {skill.years_of_experience ? <span className="text-slate-400 font-normal ml-1">({skill.years_of_experience}y)</span> : ''}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EMPLOYMENT */}
                        {fp.employments?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">💼 Experience</h3>
                                <div className="space-y-4">
                                    {fp.employments.map((emp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                                            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                                            <h4 className="text-md font-bold text-slate-900">{emp.designation}</h4>
                                            <div className="text-sm font-medium text-blue-600 mb-1">{emp.organization_name} {emp.department && `• ${emp.department}`}</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                {emp.start_date || 'Unknown'} — {emp.is_current ? 'Present' : (emp.end_date || 'Unknown')}
                                            </div>
                                            {emp.responsibilities && <p className="text-sm text-slate-600 whitespace-pre-line">{emp.responsibilities}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EDUCATION */}
                        {fp.educations?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">🎓 Education</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fp.educations.map((edu, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                            <h4 className="font-bold text-slate-900">{edu.degree_title}</h4>
                                            <div className="text-sm font-medium text-slate-700">{edu.institution}</div>
                                            <div className="flex justify-between items-center mt-3 text-xs font-bold uppercase text-slate-500">
                                                <span>Class of {edu.passing_year || 'N/A'}</span>
                                                {edu.result && <span className="bg-white px-2 py-1 rounded border shadow-sm">GPA/Result: {edu.result}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* TRAININGS */}
                        {fp.trainings?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">📜 Certifications & Training</h3>
                                <div className="space-y-3">
                                    {fp.trainings.map((trn, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{trn.training_title}</h4>
                                                <div className="text-xs text-slate-500">{trn.institute} {trn.location && `• ${trn.location}`}</div>
                                            </div>
                                            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                {trn.start_date ? trn.start_date.split('-')[0] : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PORTFOLIOS & PROJECTS */}
                        {fp.portfolios_publications_projects?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">🚀 Projects & Portfolio</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {fp.portfolios_publications_projects.map((proj, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-slate-200">
                                            <h4 className="font-bold text-slate-900 flex justify-between items-start">
                                                {proj.title}
                                                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline ml-4 break-all">🔗 View Link</a>}
                                            </h4>
                                            {proj.description && <p className="text-sm text-slate-600 mt-2">{proj.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EXTRACURRICULARS */}
                        {fp.extracurricular_activities?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">🏃 Extracurriculars</h3>
                                <ul className="space-y-3">
                                    {fp.extracurricular_activities.map((ext, i) => (
                                        <li key={i} className="text-sm">
                                            <strong className="text-slate-900">{ext.activity_name}</strong>
                                            {ext.position_held && <span className="text-slate-500"> — {ext.position_held}</span>}
                                            {ext.description && <p className="text-slate-600 mt-1">{ext.description}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* REFERENCES */}
                        {fp.references?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-black text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">🤝 References</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fp.references.map((ref, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                            <h4 className="font-bold text-slate-900">{ref.name}</h4>
                                            <div className="text-sm text-slate-700">{ref.designation} at {ref.organization}</div>
                                            <div className="text-xs text-slate-500 mt-2 space-y-1">
                                                {ref.mobile_number && <div>📞 {ref.mobile_number}</div>}
                                                {ref.email && <div>✉️ {ref.email}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center flex-shrink-0 z-50">
                    <span className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider ${
                        candidate.status === 'applied' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                        Status: {candidate.status.replace('_', ' ')}
                    </span>

                    <div className="flex space-x-3">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                            Close Profile
                        </button>
                        
                        {/* Only show shortlist button if the prop is passed AND status is applied */}
                        {onShortlist && candidate.status === 'applied' && (
                            <button 
                                onClick={onShortlist}
                                disabled={isUpdating}
                                className="px-8 py-3 text-sm font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                            >
                                {isUpdating ? 'Saving...' : '✓ Shortlist Candidate'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}