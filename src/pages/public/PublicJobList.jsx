import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import PublicNavbar from "../../components/public/PublicNavbar";
import PublicFooter from "../../components/public/PublicFooter";

export default function PublicJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        const jobsArray = Array.isArray(data) ? data : data.results || [];
        setJobs(jobsArray);
      } catch (err) {
        setError("Failed to load available jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Open Positions
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Join our team and do work that matters.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-12">
            Loading available jobs...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            There are currently no open positions. Please check back later!
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {job.title}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link
                      to="/find-jobs"
                      className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
