import axios from 'axios';
// import store from '../../store';
// import { setError } from '../../store/errorSlice';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',  // URL gốc cho API
    timeout: 100000,  // Giới hạn thời gian chờ,
    withCredentials: true,  // Gửi cookie khi gọi API từ domain khác
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Thêm token vào header Authorization
        'Access-Control-Allow-Origin': '*',
        // Thêm token hoặc các headers khác ở đây nếu cần
    }
});
 export default axiosInstance;