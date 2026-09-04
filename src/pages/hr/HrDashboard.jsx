import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import { getAllApplications } from "../../services/applicationService";
import { getMyInterviews } from "../../services/interviewService";

export default function HrDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    newApplications: 0,
    interviewsScheduled: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsData, appsData, interviewsData] = await Promise.all([
          getJobs(),
          getAllApplications(),
          getMyInterviews(),
        ]);

        const jobsList = Array.isArray(jobsData)
          ? jobsData
          : jobsData.results || [];
        const appsList = Array.isArray(appsData)
          ? appsData
          : appsData.results || [];
        const interviewsList = Array.isArray(interviewsData)
          ? interviewsData
          : interviewsData.results || [];

        const activeJobsCount = jobsList.filter(
          (job) => job.status === "open",
        ).length;

        const uniqueCandidates = new Set(appsList.map((app) => app.candidate))
          .size;

        const newAppsCount = appsList.filter(
          (app) => app.status === "applied",
        ).length;

        const now = new Date();
        const upcomingInterviewsCount = interviewsList.filter((item) => {
          const interviewDate = new Date(item.scheduled_time);
          return interviewDate >= now && item.application_status !== "rejected";
        }).length;

        setStats({
          activeJobs: activeJobsCount,
          totalCandidates: uniqueCandidates,
          newApplications: newAppsCount,
          interviewsScheduled: upcomingInterviewsCount,
        });

        const sortedApps = [...appsList]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setRecentApplications(sortedApps);
      } catch (err) {
        console.error("Failed to load HR dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "applied":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            New
          </span>
        );
      case "under_review":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Shortlisted
          </span>
        );
      case "interview_scheduled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            Interview Scheduled
          </span>
        );
      case "offered":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Offered
          </span>
        );
      case "hired":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            Hired
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
            {status?.replace("_", " ") || "N/A"}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statCards = [
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      trend: "Currently accepting applicants",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      trend: "Unique applicants in talent pool",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "New Applications",
      value: stats.newApplications,
      trend: "Pending initial review",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Interviews Scheduled",
      value: stats.interviewsScheduled,
      trend: "Upcoming interview sessions",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Dashboard metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Here is what is happening with your recruitment pipeline today.
          </p>
        </div>
        <Link
          to="/hr/jobs/new"
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-slate-500 font-medium text-sm">
                {stat.title}
              </h3>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-4">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-slate-400 mt-2">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">
            Recent Applications
          </h3>
          <Link
            to="/hr/candidates"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">Candidate Name</th>
                <th className="px-6 py-4 font-medium">Applied For</th>
                <th className="px-6 py-4 font-medium">Applied Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {recentApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No recent applications found.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {app.candidate_name || "Anonymous Candidate"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {app.job_title || `Job #${app.job}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/hr/pending-jobs/${app.job}/candidates`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
