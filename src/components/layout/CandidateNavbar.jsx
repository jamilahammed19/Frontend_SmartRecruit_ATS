import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "./NotificationBell";

export default function CandidateNavbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo & Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className="text-2xl font-bold text-blue-600 tracking-tight"
              >
                SmartRecruit
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive("/dashboard") ? "border-blue-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile-edit"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive("/profile-edit") ? "border-blue-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}
              >
                My Profile & CV
              </Link>

              <Link
                to="/find-jobs"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive("/find-jobs") ? "border-blue-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}
              >
                Find Jobs
              </Link>
              <Link
                to="/my-applications"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive("/my-applications") ? "border-blue-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}
              >
                My Applications
              </Link>
              <Link
                to="/interviews"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive("/interviews") ? "border-blue-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}
              >
                Interviews
              </Link>
              <div className="flex items-center space-x-4">
                <NotificationBell />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
