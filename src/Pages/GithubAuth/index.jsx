import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '~/Config/api';
function GithubAuth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = location.state || {};
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/github/auth/callback?code=${code}&state=${state}`);
                setData(response.data);
                if (response.data) {
                    handleLogin(response.data);
                }
            } catch (error) {
                setError(error);
            }
            finally {
                setIsLoading(false);
            }
        };
        if (code) {
            fetchData();
        }
    }, [code, state]);

    const handleLogin = async (data) => {
        try {
            const response = await api.post('/github/auth/login', data);
            if (response.data.success === true) {
                navigate('/codespace', { state: { isLoggedIn: true } });
            }
        } catch (error) {
            setError(error);
        }
    }

    return ( 
        <>
            {isLoading && <div>Loading...</div>}
        </>
     );
}

export default GithubAuth;