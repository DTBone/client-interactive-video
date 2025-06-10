import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_URL_SERVER}/api/v1`,
    timeout: 100000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `${import.meta.env.VITE_URL_SERVER}`,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        //console.log('Token from localStorage:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            //console.log('Form data request:', config.data);
            delete config.headers['Content-Type'];
        }
        //console.log('Full request config:', JSON.stringify(config, null, 2));
        return config;
    },
    (error) => {
        console.error('Error in axios interceptor:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        //console.log('Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Error in response:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default axiosInstance;