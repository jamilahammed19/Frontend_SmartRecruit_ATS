import { useState, useEffect } from "react";
import {
  getMyApplications,
  deleteApplication,
} from "../../services/applicationService";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await getMyApplications();
      setApplications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e, appId) => {
    // 1. Completely stop React from triggering background clicks or reloading
    e.preventDefault();
    e.stopPropagation();

    // 2. Ask for confirmation
    const isConfirmed = window.confirm(
      "Are you sure you want to withdraw this application? This action cannot be undone.",
    );

    if (!isConfirmed) {
      return; // Stop if they click "Cancel"
    }

    setWithdrawing(true);

    try {
      // 3. Send request to Django
      await deleteApplication(appId);

      // 4. Instantly remove it from the screen
      setApplications(applications.filter((app) => app.id !== appId));
      setSelectedApp(null); // Close modal

      // Wait a tiny moment for state to update before alerting
      setTimeout(() => {
        alert("Application successfully withdrawn.");
      }, 100);
    } catch (err) {
      console.error("Delete error:", err);
      // Grab the exact error message whether it's from Django or a network failure
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to withdraw application.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setWithdrawing(false);
    }
  };

  // Helper to color-code status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "under_review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "interview_scheduled":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "offered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "hired":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading your applications...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans relative">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        My Applications
      </h1>
      <p className="text-slate-500 mb-8">
        Track the status of roles you have applied for or withdraw your
        application.
      </p>

      {applications.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-slate-200 text-slate-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {/* --- COMPACT APPLICATION LIST --- */}
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center group"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {app.job_title}
                </h2>
                <div className="text-sm text-slate-500 mt-1">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <span
                  className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border capitalize ${getStatusStyle(app.status)}`}
                >
                  {app.status.replace("_", " ")}
                </span>
                <span className="text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors hidden sm:block">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DETAILS & WITHDRAW MODAL --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedApp.job_title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Applied on{" "}
                  {new Date(selectedApp.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm border border-slate-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6 flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">
                  Current Status:
                </span>
                <span
                  className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border capitalize ${getStatusStyle(selectedApp.status)}`}
                >
                  {selectedApp.status.replace("_", " ")}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Your Cover Letter
                </h3>
                {selectedApp.cover_letter ? (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 text-sm whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {selectedApp.cover_letter}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    You did not include a cover letter with this application.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center relative z-50">
              <button
                type="button"
                onClick={(e) => handleWithdraw(e, selectedApp.id)}
                disabled={withdrawing}
                // Added relative and z-50 here!
                className="relative z-50 mt-3 sm:mt-0 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {withdrawing ? "Withdrawing..." : "Withdraw Application"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedApp(null);
                }}
                className="relative z-50 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
