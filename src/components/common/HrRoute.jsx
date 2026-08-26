import { Navigate, Outlet } from 'react-router-dom';

export default function HrRoute({ userRole }) {
    if (userRole === 'candidate') {
        return <Navigate to="/dashboard" replace />;
    }
    if (userRole !== 'hr') {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}