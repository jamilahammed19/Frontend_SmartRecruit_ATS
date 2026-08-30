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
import PublicJobList from "./pages/public/PublicJobList";
import CandidateJobList from "./pages/candidate/CandidateJobList";
import MyApplications from "./pages/candidate/MyApplications";
import HrApplicationList from "./pages/hr/HrApplicationList";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateInterviews from "./pages/candidate/CandidateInterviews";
import HrPendingJobs from "./pages/hr/HrPendingJobs";
import HrJobDashboard from "./pages/hr/HrJobDashboard";
import HrCandidateSelection from "./pages/hr/HrCandidateSelection";
import HrSelectedCandidates from "./pages/hr/HrSelectedCandidates";
import HrInterviews from "./pages/hr/HrInterviews";
import HrCompletedJobs from "./pages/hr/HrCompletedJobs";
import AiScanner from "./pages/candidate/AiScanner";

export default function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<PublicJobList />} /> {/* NEW ROUTE */}
      {/* --- GUESTS ONLY --- */}
      <Route element={<GuestRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CandidateRegister />} />
      </Route>
      {/* --- CANDIDATE ONLY ROUTES --- */}
      <Route element={<CandidateRoute userRole={userRole} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/find-jobs" element={<CandidateJobList />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/interviews" element={<CandidateInterviews />} />
          <Route path="/candidate/ai-scanner" element={<AiScanner />} />
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

          <Route path="/hr/pending-jobs" element={<HrPendingJobs />} />
          <Route path="/hr/pending-jobs/:jobId" element={<HrJobDashboard />} />
          <Route
            path="/hr/pending-jobs/:jobId/candidates"
            element={<HrCandidateSelection />}
          />
          <Route
            path="/hr/pending-jobs/:jobId/interviews"
            element={<HrSelectedCandidates />}
          />

          <Route path="/hr/candidates" element={<HrApplicationList />} />

          <Route path="/hr/interviews" element={<HrInterviews />} />
          <Route path="/hr/completed-jobs" element={<HrCompletedJobs />} />
        </Route>
      </Route>
    </Routes>
  );
}
