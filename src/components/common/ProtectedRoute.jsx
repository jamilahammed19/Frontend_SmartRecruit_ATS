import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    // If the user is NOT logged in, kick them back to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, let them access the protected pages
    return <Outlet />;
}