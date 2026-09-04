import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PublicNavbar() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">
                S
              </span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart<span className="text-blue-600">Careers</span>
            </span>
          </div>
          <div className="flex space-x-4 items-center">
            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mr-2"
            >
              Available Jobs
            </Link>

            {isAuthenticated ? (
              <Link
                to={userRole === "hr" ? "/hr/dashboard" : "/dashboard"}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  Create Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
