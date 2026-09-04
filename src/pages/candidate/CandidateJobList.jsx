import { useState, useEffect } from "react";
import { getJobs } from "../../services/jobService";
import {
  getMyApplications,
  applyForJob,
} from "../../services/applicationService";
import { getProfile } from "../../services/candidateService";
import { checkProfileCompletion } from "../../utils/profileValidation";

export default function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isProfileReady, setIsProfileReady] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, appsData, profileData] = await Promise.all([
          getJobs(),
          getMyApplications(),
          getProfile(),
        ]);

        setJobs(Array.isArray(jobsData) ? jobsData : jobsData.results || []);

        const appsArray = Array.isArray(appsData)
          ? appsData
          : appsData.results || [];
        setAppliedJobIds(new Set(appsArray.map((app) => app.job)));

        const { isComplete } = checkProfileCompletion(profileData);
        setIsProfileReady(isComplete);
      } catch (err) {
        setError("Failed to load available jobs or profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setModalMode("view");
    setCoverLetter("");
    setApplyError("");
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError("");

    try {
      await applyForJob(selectedJob.id, coverLetter);
      setAppliedJobIds((prev) => new Set(prev).add(selectedJob.id));
      setSelectedJob(null);
      alert("Application submitted successfully!");
    } catch (err) {
      setApplyError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors ||
          "Failed to submit application.",
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Find Your Next Role
        </h1>
        <p className="mt-2 text-slate-500">
          Browse open positions, view details, and apply.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Loading open positions...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500">
          No open positions at the moment. Please check back later.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            return (
              <div
                key={job.id}
                onClick={() => handleOpenDetails(job)}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer flex justify-between items-center group transition-all"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                    {job.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">
                      Closes: {job.deadline}
                    </span>
                  </div>
                </div>
                <div>
                  {hasApplied ? (
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                      ✓ Applied
                    </span>
                  ) : (
                    <span className="px-4 py-2 text-sm font-medium bg-slate-50 text-slate-600 border rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      View Details
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedJob.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedJob.department} • {selectedJob.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {modalMode === "view" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Job Description
                    </h3>
                    <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>
                  {selectedJob.requirements && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Requirements
                      </h3>
                      <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
                        {selectedJob.requirements}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Your SmartRecruit CV profile will be automatically
                      attached to this application.
                    </p>
                  </div>
                  {applyError && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                      {applyError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      rows="6"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Introduce yourself..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex flex-col relative z-50">
              {!isProfileReady &&
                modalMode === "view" &&
                !appliedJobIds.has(selectedJob.id) && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-100 flex items-start gap-2">
                    <span className="text-lg leading-none mt-0.5">*</span>
                    <span>
                      You must complete your profile (Photo, Personal Details,
                      Present Address, SSC & HSC, and 2 References) before
                      applying for jobs.
                    </span>
                  </div>
                )}

              <div className="flex justify-end space-x-3">
                {modalMode === "view" ? (
                  <>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Close
                    </button>

                    {!appliedJobIds.has(selectedJob.id) && (
                      <button
                        onClick={() => setModalMode("apply")}
                        disabled={!isProfileReady}
                        className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${
                          isProfileReady
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Apply for this Job
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setModalMode("view")}
                      className="px-5 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={applying}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                    >
                      {applying ? "Sending..." : "Submit Application"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
