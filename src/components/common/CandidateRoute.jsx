import { Navigate, Outlet } from 'react-router-dom';

export default function CandidateRoute({ userRole }) {
    if (userRole === 'hr') {
        return <Navigate to="/hr/dashboard" replace />;
    }
    if (userRole !== 'candidate') {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}