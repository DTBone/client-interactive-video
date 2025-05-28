import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '~/index.css';

function HomeAdmin() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the new dashboard
        navigate('/admin/dashboard');
    }, [navigate]);

    return null; // No rendering needed as we're redirecting
}

export default HomeAdmin;