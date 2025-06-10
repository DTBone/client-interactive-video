import axios from 'axios';
// import store from '../../store';
// import { setError } from '../../store/errorSlice';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_URL_SERVER}/api/v1`,  // URL gốc cho API
    timeout: 100000,  // Giới hạn thời gian chờ,
    withCredentials: true,  // Gửi cookie khi gọi API từ domain khác
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `${import.meta.env.VITE_URL_SERVER}`,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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

// axiosInstance.interceptors.request.use(
//     res => res,
//     (error) => {
//         console.error("Error with request", error);
//         if (error.response) {
//             const errorMessage = error.response.data?.message || "An unknown error occurred";

//             // Dispatch act ion để set lỗi global
//             store.dispatch(setError(errorMessage));
//         } else if (error.request) {
//             // Xử lý lỗi khi không nhận được phản hồi từ server
//             store.dispatch(setError("No response received from server"));
//         } else {
//             // Xử lý các lỗi khác
//             store.dispatch(setError(error.message));
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;