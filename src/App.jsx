import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import CandidateRegister from "./pages/auth/CandidateRegister";
import ProfileEdit from "./pages/candidate/ProfileEdit";
import CandidateLayout from "./layouts/CandidateLayout";
import LandingPage from "./pages/public/LandingPage";
import GuestRoute from "./components/common/GuestRoute";
import CandidateRoute from "./components/common/CandidateRoute";
import HrRoute from "./components/common/HrRoute";
import HrLayout from "./layouts/HrLayout";
import HrDashboard from "./pages/hr/HrDashboard";
import { useAuth } from "./hooks/useAuth";
import JobList from "./pages/hr/JobList";
import JobForm from "./pages/hr/JobForm";

export default function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* --- GUESTS ONLY --- */}
      <Route element={<GuestRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CandidateRegister />} />
      </Route>

      {/* --- CANDIDATE ONLY ROUTES --- */}
      <Route element={<CandidateRoute userRole={userRole} />}>
        <Route element={<CandidateLayout />}>
          <Route
            path="/dashboard"
            element={
              <div className="py-20 text-center">
                <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
                <Link
                  to="/profile-edit"
                  className="mt-4 inline-block text-blue-600"
                >
                  Edit My CV
                </Link>
              </div>
            }
          />
          <Route path="/profile-edit" element={<ProfileEdit />} />
        </Route>
      </Route>

      {/* --- HR ONLY ROUTES --- */}
      <Route element={<HrRoute userRole={userRole} />}>
        {/* Wrap all HR pages in the Sidebar Layout */}
        <Route element={<HrLayout />}>
          <Route path="/hr/dashboard" element={<HrDashboard />} />

          {/* Placeholder routes for upcoming HR features */}
          {/* NEW JOB ROUTES */}
          <Route path="/hr/jobs" element={<JobList />} />
          <Route path="/hr/jobs/new" element={<JobForm />} />
          <Route path="/hr/jobs/edit/:id" element={<JobForm />} />
          
          <Route
            path="/hr/candidates"
            element={<div className="p-6">Candidate Database coming soon</div>}
          />
          <Route
            path="/hr/interviews"
            element={<div className="p-6">Interview Schedule coming soon</div>}
          />
        </Route>
      </Route>
    </Routes>
  );
}
