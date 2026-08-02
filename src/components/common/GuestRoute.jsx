import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function GuestRoute() {
    const { isAuthenticated } = useAuth();

    // If the user is already logged in, redirect them away from auth pages
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Otherwise, let them see the login/register page
    return <Outlet />;
}