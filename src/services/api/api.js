import axios from "axios"

export const API_BASE_URL = "http://localhost:3000/api/v1"

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
    withCredentials: true,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    }
})