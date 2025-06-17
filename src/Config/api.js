import axios from "axios"


// API_BASE_URL = "http://localhost:5000/api/v1"
export const API_BASE_URL = `http://localhost:3000/api/v1`
const token = localStorage.getItem("token")

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 150000,
  withCredentials: true,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': `http://localhost:3000/api/v1`
  }
})

// Luôn cập nhật token trước mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);