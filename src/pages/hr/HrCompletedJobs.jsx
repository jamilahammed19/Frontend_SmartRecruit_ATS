import { useState, useEffect } from "react";
import { getJobs, updateJobStatus } from "../../services/jobService";

export default function HrCompletedJobs() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        const jobsArray = Array.isArray(data) ? data : data.results || [];

        const finished = jobsArray.filter((job) => job.status === "completed");
        setCompletedJobs(finished);
      } catch (err) {
        console.error("Failed to load completed jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleReopen = async (jobId) => {
    if (
      window.confirm(
        "Are you sure you want to reopen this job? It will be moved back to the Pending Processes dashboard.",
      )
    ) {
      setUpdatingId(jobId);
      try {
        await updateJobStatus(jobId, { status: "processing" });

        setCompletedJobs((prev) => prev.filter((job) => job.id !== jobId));
      } catch (err) {
        console.error("Failed to reopen job:", err);
        alert("Failed to reopen the job. Please try again.");
      } finally {
        setUpdatingId(null);
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Completed Jobs...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Completed Jobs</h1>
        <p className="text-slate-500 mt-2">
          History of successfully closed recruitment pipelines.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Job Title</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {completedJobs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No jobs have been marked as completed yet.
                </td>
              </tr>
            ) : (
              completedJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50 transition-colors opacity-90"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{job.department}</td>
                  <td className="px-6 py-4 text-slate-500">{job.location}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase rounded-full">
                      ✓ Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleReopen(job.id)}
                      disabled={updatingId === job.id}
                      className="px-4 py-2 bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-lg transition-colors text-xs disabled:opacity-50"
                    >
                      {updatingId === job.id ? "Reopening..." : "Reopen Job"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
