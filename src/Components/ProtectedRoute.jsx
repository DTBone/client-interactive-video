/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import spinnerLoading from '~/assets/spinnerLoading.gif';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy user từ localStorage nếu không có trong state
    const getUserFromStorage = () => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    };

    // Lấy user từ Redux state hoặc localStorage
    const user = auth?.user || getUserFromStorage();
    const role = user?.role || '';
    const isAuthenticated = auth?.isAuthenticated || localStorage.getItem('isAuthenticated');
    const isLoading = auth?.isLoading || false;

    console.log('protected user', user, role, isAuthenticated, isLoading)

    useEffect(() => {
        const checkAuth = () => {
            // Đợi cho đến khi loading kết thúc
            if (isLoading) {
                return;
            }

            // Kiểm tra authentication
            if (!isAuthenticated) {
                navigate("/signin", {
                    state: { from: location.pathname },
                    replace: true
                });
                return;
            }

            // Kiểm tra quyền truy cập
            if (allowedRoles && role && !allowedRoles.includes(role)) {
                navigate("/unauthorized", { replace: true });
                return;
            }
        };

        checkAuth();
    }, [isAuthenticated, isLoading, role, allowedRoles, navigate, location.pathname]);

    // Hiển thị loading khi đang kiểm tra authentication
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <img alt="Loading" src={spinnerLoading} />
            </div>
        );
    }


    // Kiểm tra quyền truy cập
    if (!isAuthenticated || !user) {
        navigate("/unauthorized", { replace: true });
        return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        navigate("/unauthorized", { replace: true });
        return;
    }

    return children;
};

export default ProtectedRoute;