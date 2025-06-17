import axios from 'axios';
// import store from '../../store';
// import { setError } from '../../store/errorSlice';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_URL_SERVER}/api/v1`,  // URL gốc cho API
    timeout: 100000,  // Giới hạn thời gian chờ,
    withCredentials: true,  // Gửi cookie khi gọi API từ domain khác
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Thêm token vào header Authorization
        'Access-Control-Allow-Origin': '*',
        // Thêm token hoặc các headers khác ở đây nếu cần
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

 export default axiosInstance;