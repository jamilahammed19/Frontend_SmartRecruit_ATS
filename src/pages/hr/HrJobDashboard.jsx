import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getJobs,
  updateJobStatus,
  generateJobSummary,
  generateJobQuestions,
  getJobQuestions,
} from "../../services/jobService";
import { getAllApplications } from "../../services/applicationService";
import { sendNotification } from "../../services/notificationService";

export default function HrJobDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // AI State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageData, setMessageData] = useState({ title: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, appsData] = await Promise.all([
          getJobs(),
          getAllApplications(),
        ]);

        const jobsArray = Array.isArray(jobsData)
          ? jobsData
          : jobsData.results || [];
        setJob(jobsArray.find((j) => j.id.toString() === jobId));

        const appsArray = Array.isArray(appsData)
          ? appsData
          : appsData.results || [];
        setApplicants(appsArray.filter((app) => app.job.toString() === jobId));
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
        await updateJobStatus(job.id, { status: "completed" });
        alert("Job successfully marked as completed!");
        navigate("/hr/completed-jobs");
      } catch (err) {
        console.error(err);
        alert("Failed to complete job.");
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const data = await generateJobSummary(job.id);
      setJob({ ...job, ai_short_description: data.ai_short_description });
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleOpenQuestions = async () => {
    setShowQuestionsModal(true);
    setIsQuestionsLoading(true);
    try {
      const qs = await getJobQuestions(job.id);
      setQuestions(Array.isArray(qs) ? qs : qs.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsQuestionsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const data = await generateJobQuestions(job.id);
      setQuestions(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions. Ensure FastAPI is running.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleSendNotifications = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0)
      return alert("Please select at least one candidate.");
    setIsSending(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          sendNotification({
            user: userId,
            title: messageData.title,
            message: messageData.message,
            notification_type: "general",
          }),
        ),
      );
      alert("Messages sent successfully!");
      setShowNotifyModal(false);
      setMessageData({ title: "", message: "" });
      setSelectedUsers([]);
    } catch (err) {
      alert("Failed to send messages.");
    } finally {
      setIsSending(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === applicants.length) setSelectedUsers([]);
    else setSelectedUsers(applicants.map((app) => app.candidate_user_id));
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

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-indigo-900">
            ✨ AI Short Description
          </h2>
          {job.ai_short_description && (
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 bg-white px-3 py-1 rounded border border-indigo-200 shadow-sm"
            >
              {isGeneratingSummary ? "Generating..." : "Regenerate"}
            </button>
          )}
        </div>
        <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">
          {job.ai_short_description ? (
            job.ai_short_description
          ) : (
            <div className="flex flex-col items-start gap-3 mt-3">
              <span className="italic opacity-80">
                AI insights have not been generated for this job posting yet.
              </span>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
              >
                {isGeneratingSummary
                  ? "Generating Summary..."
                  : "Generate AI Summary"}
              </button>
            </div>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            View selected candidates and schedule times.
          </p>
        </Link>

        <button
          onClick={() => setShowNotifyModal(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 transition-all text-left"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Notify Candidates
          </h3>
          <p className="text-sm text-slate-500">
            Send custom messages to selected users.
          </p>
        </button>

        <button
          onClick={handleOpenQuestions}
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

      {showQuestionsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-amber-50">
              <div>
                <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                  ✨ AI Interview Questions
                </h2>
                <p className="text-sm text-amber-700 mt-1">
                  Generated strictly based on requirements for:{" "}
                  <span className="font-bold">{job.title}</span>
                </p>
              </div>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1.5 border shadow-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow bg-slate-50">
              {isQuestionsLoading ? (
                <div className="text-center py-10 text-slate-500 font-medium">
                  Loading questions...
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 mb-4">
                    No AI questions generated for this job yet.
                  </p>
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    className="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-sm hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isGeneratingQuestions
                      ? "Analyzing Job & Generating... (Takes ~10s)"
                      : "Generate Questions Now"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                    >
                      <h4 className="font-bold text-slate-900 text-base mb-2">
                        <span className="text-amber-500 mr-2">Q{idx + 1}.</span>
                        {q.question}
                      </h4>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Expected Answer / Key Points
                        </p>
                        <p className="text-sm text-slate-700">{q.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {questions.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGeneratingQuestions}
                  className="text-sm font-bold text-amber-600 hover:text-amber-800 disabled:opacity-50"
                >
                  {isGeneratingQuestions
                    ? "Regenerating..."
                    : "↻ Regenerate All"}
                </button>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showNotifyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden max-h-[85vh]">
            <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">
                  Select Recipients
                </h3>
                <button
                  onClick={selectAllUsers}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  {selectedUsers.length === applicants.length &&
                  applicants.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="overflow-y-auto flex-grow p-2 space-y-1">
                {applicants.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 text-center">
                    No applicants found.
                  </div>
                ) : (
                  applicants.map((app) => (
                    <label
                      key={app.id}
                      className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 shadow-sm"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mr-3"
                        checked={selectedUsers.includes(app.candidate_user_id)}
                        onChange={() =>
                          toggleUserSelection(app.candidate_user_id)
                        }
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {app.candidate_name}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">
                          {app.status.replace("_", " ")}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="w-2/3 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Compose Message
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Sending to {selectedUsers.length} selected candidates.
                  </p>
                </div>
                <button
                  onClick={() => setShowNotifyModal(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 border"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSendNotifications}
                className="p-6 flex-grow flex flex-col space-y-4 bg-white"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Update regarding your application"
                    value={messageData.title}
                    onChange={(e) =>
                      setMessageData({ ...messageData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    required
                    placeholder="Type your message to the candidates here..."
                    value={messageData.message}
                    onChange={(e) =>
                      setMessageData({
                        ...messageData,
                        message: e.target.value,
                      })
                    }
                    className="w-full flex-grow p-4 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNotifyModal(false)}
                    className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || selectedUsers.length === 0}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isSending ? "Sending..." : "Send Message ✉️"}
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
