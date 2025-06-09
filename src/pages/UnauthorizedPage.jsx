
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate('/signin');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
            <h1 className="text-3xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
            <p className="text-lg text-gray-700 mb-6">You do not have permission to access this page.</p>
            <button
                onClick={handleGoToLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
                Signin
            </button>
        </div>
    );
};

export default UnauthorizedPage;

