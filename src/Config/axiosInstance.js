import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Full request config:', JSON.stringify(config, null, 2));
        return config;
    },
    (error) => {
        console.error('Error in axios interceptor:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Error in response:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default axiosInstance;