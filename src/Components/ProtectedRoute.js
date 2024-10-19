import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { role, isAuthenticated } = useSelector(state => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children;
}
