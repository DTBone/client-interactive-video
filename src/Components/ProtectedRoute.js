import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const auth = useSelector(state => state.auth);
    const role = auth?.user?.role;
    const isAuthenticated = auth?.isAuthenticated
    const isLoading = auth?.isLoading;
    console.log('protect route: ', role, isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation();
    console.log('role :', role);

    if (isLoading) {
        console.log('loading', isLoading);
        return;
    }

    if (!isAuthenticated) {
        console.log('isAuthenticated :', isAuthenticated);
        navigate("/signin", { state: { from: location }, replace: true });
        return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        navigate("/unauthorized", { replace: true });
        return;
    }




    if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(role))) {
        return null; // or you could return a loading spinner here
    }

    return children;
};

export default ProtectedRoute;