import { useState, useEffect } from "react";
import {
  getMyInterviews,
  requestReschedule,
} from "../../services/interviewService";
import Button from "../../components/common/Button";

export default function CandidateInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule form state
  const [rescheduleId, setRescheduleId] = useState(null);
  const [requestedTime, setRequestedTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

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

  const handleRescheduleSubmit = async (e, interviewId) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRequest = await requestReschedule(
        interviewId,
        requestedTime,
        reason,
      );

      setInterviews(
        interviews.map((inv) => {
          if (inv.id === interviewId) {
            return {
              ...inv,
              reschedule_requests: [newRequest, ...inv.reschedule_requests],
            };
          }
          return inv;
        }),
      );

      setRescheduleId(null);
      setRequestedTime("");
      setReason("");
      alert("Reschedule request submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail || 
        "Failed to submit request. Please make sure the date and time are valid."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "denied":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // --- TIME CALCULATIONS FOR FRONTEND VALIDATION ---

  // 1. Checks if the currently scheduled interview is MORE than 2 hours away
  const canReschedule = (scheduledTime) => {
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
    return new Date(scheduledTime) > twoHoursFromNow;
  };

  // 2. Calculates minimum allowed datetime-local string (Current time + 2 hours)
  const getMinRescheduleTime = () => {
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 2);
    minTime.setMinutes(minTime.getMinutes() - minTime.getTimezoneOffset());
    return minTime.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Interviews</h1>
        <p className="mt-2 text-slate-500">
          View upcoming schedules, meeting links, and manage reschedule
          requests.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-12">
          Loading schedules...
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-slate-200 text-slate-500">
          You have no scheduled interviews at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {interviews.map((interview) => {
            const hasPendingRequest = interview.reschedule_requests.some(
              (req) => req.status === "pending",
            );
            
            // Evaluates to true if interview is >= 2h away
            const isReschedulable = canReschedule(interview.scheduled_time);

            return (
              <div
                key={interview.id}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {interview.job_title}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Application for {interview.candidate_name}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 mt-4">
                      <div className="flex items-center text-slate-700 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-fit">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {new Date(interview.scheduled_time).toLocaleString(
                            [],
                            { dateStyle: "full", timeStyle: "short" },
                          )}
                        </span>
                        <span className="ml-2 text-slate-400 font-normal">
                          ({interview.duration} mins)
                        </span>
                      </div>

                      {interview.location && (
                        <div className="flex items-center text-sm text-slate-600 px-1">
                          📍 {interview.location}
                        </div>
                      )}

                      {interview.meeting_link && (
                        <div className="flex items-center text-sm px-1">
                          🔗{" "}
                          <a
                            href={interview.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 font-medium text-blue-600 hover:text-blue-800 underline"
                          >
                            Join Virtual Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {interview.notes && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                        <strong>HR Notes:</strong> {interview.notes}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 md:mt-0 md:ml-6 min-w-[200px]">
                    {!hasPendingRequest && rescheduleId !== interview.id && (
                      <>
                        <button
                          onClick={() => setRescheduleId(interview.id)}
                          disabled={!isReschedulable}
                          title={!isReschedulable ? "Must request 2h before the interview starts." : ""}
                          className={`w-full px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${
                            isReschedulable 
                              ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50" 
                              : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          Request Reschedule
                        </button>
                        {!isReschedulable && (
                           <p className="text-[10px] text-red-500 mt-2 text-center font-bold">
                             Too close to interview time
                           </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {rescheduleId === interview.id && (
                  <form
                    onSubmit={(e) => handleRescheduleSubmit(e, interview.id)}
                    className="mt-6 pt-6 border-t border-slate-100 bg-slate-50 p-4 rounded-xl border"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-4">
                      Request a New Time
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Proposed Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          required
                          min={getMinRescheduleTime()} // <-- PREVENTS CHOOSING INVALID TIME
                          value={requestedTime}
                          onChange={(e) => setRequestedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Must be at least 2 hours from now.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Reason (Optional)
                        </label>
                        <textarea
                          rows="1"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                          placeholder="E.g., I have a university class..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setRescheduleId(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <Button type="submit" isLoading={submitting}>
                        Submit Request
                      </Button>
                    </div>
                  </form>
                )}

                {interview.reschedule_requests.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Reschedule Requests
                    </h3>
                    <div className="space-y-3">
                      {interview.reschedule_requests.map((req) => (
                        <div
                          key={req.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              Proposed:{" "}
                              {new Date(req.requested_time).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                            {req.reason && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                "{req.reason}"
                              </p>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span
                              className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border capitalize ${getStatusStyle(req.status)}`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}