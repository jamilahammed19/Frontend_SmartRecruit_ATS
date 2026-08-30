import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobs, updateJobStatus } from "../../services/jobService";
import { getAllApplications } from "../../services/applicationService"; // NEW
import { sendNotification } from "../../services/notificationService"; // NEW

export default function HrJobDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // --- NOTIFICATION MODAL STATE ---
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageData, setMessageData] = useState({ title: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, appsData] = await Promise.all([
          getJobs(), 
          getAllApplications()
        ]);
        
        const jobsArray = Array.isArray(jobsData) ? jobsData : jobsData.results || [];
        setJob(jobsArray.find((j) => j.id.toString() === jobId));

        // Grab applicants for this specific job to populate the messaging list
        const appsArray = Array.isArray(appsData) ? appsData : appsData.results || [];
        setApplicants(appsArray.filter(app => app.job.toString() === jobId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleMarkCompleted = async () => {
    if (
      window.confirm(
        "Mark as Completed? This will close the pipeline and move this job to the Completed Jobs list.",
      )
    ) {
      setIsCompleting(true);
      try {
        // Send PATCH request to Django to change status
        await updateJobStatus(job.id, { status: "completed" });
        alert("Job successfully marked as completed!");
        navigate("/hr/completed-jobs"); // Redirect HR to the new page
      } catch (err) {
        console.error("Failed to complete job:", err.response?.data || err);
        alert("Failed to complete job. Please try again.");
      } finally {
        setIsCompleting(false);
      }
    }
  };

  // --- BULK MESSAGING LOGIC ---
  const handleSendNotifications = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return alert("Please select at least one candidate.");
    
    setIsSending(true);
    try {
        // Loop through selected users and send a notification to each
        await Promise.all(selectedUsers.map(userId => 
            sendNotification({
                user: userId,
                title: messageData.title,
                message: messageData.message,
                notification_type: 'general'
            })
        ));
        
        alert("Messages sent successfully!");
        setShowNotifyModal(false);
        setMessageData({ title: '', message: '' });
        setSelectedUsers([]);
    } catch (err) {
        console.error(err);
        alert("Failed to send messages.");
    } finally {
        setIsSending(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === applicants.length) {
        setSelectedUsers([]); // Deselect all
    } else {
        setSelectedUsers(applicants.map(app => app.candidate_user_id)); // Select all
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Job Dashboard...</div>;
  if (!job)
    return <div className="p-10 text-center text-red-500">Job not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <Link
        to="/hr/pending-jobs"
        className="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-block"
      >
        ← Back to Pending Jobs
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-slate-500 mt-1">
            {job.department} • Deadline Passed
          </p>
        </div>
        <button
          onClick={handleMarkCompleted}
          disabled={isCompleting}
          className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 font-medium rounded-lg border border-slate-200 disabled:opacity-50"
        >
          {isCompleting ? "Completing..." : "Mark as Completed"}
        </button>
      </div>

      {/* AI Summary Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-indigo-900 mb-2">
          ✨ AI Short Description
        </h2>
        <p className="text-indigo-800 text-sm leading-relaxed">
          Based on the job description, this role requires strong foundational
          knowledge in backend architecture. AI recommends prioritizing
          candidates with proven experience in optimizing database queries and
          API design.
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CANDIDATE SELECTION (Leads to Level 3) */}
        <Link
          to={`/hr/pending-jobs/${job.id}/candidates`}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Candidate Selection
          </h3>
          <p className="text-sm text-slate-500">
            Filter and view AI-sorted applicants.
          </p>
        </Link>

        <Link
          to={`/hr/pending-jobs/${job.id}/interviews`}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Interview Dates
          </h3>
          <p className="text-sm text-slate-500">
            View selected candidates and schedule their interview times.
          </p>
        </Link>

        {/* --- UPDATED NOTIFY BUTTON --- */}
        <button
          onClick={() => setShowNotifyModal(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 transition-all text-left"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Notify Candidates
          </h3>
          <p className="text-sm text-slate-500">
            Send interview links to selected users.
          </p>
        </button>

        <button
          onClick={() => alert("Generating questions...")}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-500 transition-all text-left"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            AI Interview Q's
          </h3>
          <p className="text-sm text-slate-500">
            Generate custom behavioral & technical questions.
          </p>
        </button>
      </div>

      {/* --- NOTIFY CANDIDATES MODAL --- */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden max-h-[85vh]">
                
                {/* Sidebar: Candidate Selector */}
                <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">Select Recipients</h3>
                        <button onClick={selectAllUsers} className="text-xs text-blue-600 font-bold hover:underline">
                            {selectedUsers.length === applicants.length && applicants.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-grow p-2 space-y-1">
                        {applicants.length === 0 ? (
                            <div className="p-4 text-xs text-slate-500 text-center">No applicants found.</div>
                        ) : (
                            applicants.map(app => (
                                <label key={app.id} className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mr-3"
                                        checked={selectedUsers.includes(app.candidate_user_id)}
                                        onChange={() => toggleUserSelection(app.candidate_user_id)}
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-slate-900">{app.candidate_name}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">{app.status.replace('_', ' ')}</div>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Body: Message Composer */}
                <div className="w-2/3 flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Compose Message</h2>
                            <p className="text-sm text-slate-500 mt-1">Sending to {selectedUsers.length} selected candidates.</p>
                        </div>
                        <button onClick={() => setShowNotifyModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 border">✕</button>
                    </div>

                    <form onSubmit={handleSendNotifications} className="p-6 flex-grow flex flex-col space-y-4 bg-white">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject / Title</label>
                            <input 
                                type="text" required
                                placeholder="e.g. Update regarding your application"
                                value={messageData.title}
                                onChange={e => setMessageData({...messageData, title: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                            />
                        </div>
                        <div className="flex-grow flex flex-col">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Message Body</label>
                            <textarea 
                                required
                                placeholder="Type your message to the candidates here..."
                                value={messageData.message}
                                onChange={e => setMessageData({...messageData, message: e.target.value})}
                                className="w-full flex-grow p-4 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm resize-none"
                            />
                        </div>
                        
                        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                            <button type="button" onClick={() => setShowNotifyModal(false)} className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSending || selectedUsers.length === 0}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isSending ? 'Sending...' : 'Send Message ✉️'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}