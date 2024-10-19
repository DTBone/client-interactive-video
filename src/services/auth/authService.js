import axiosInstance from '../api/axiosInstance';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/login', credentials);
            return response.data;
        } catch (error) {
            console.error("Error logging in", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post('/logout');
            return response.data;
        } catch (error) {
            console.error("Error logging out", error);
            throw error;
        }
    },
    register: async (credentials) => {
        try {
            const response = await axiosInstance.post('/register', credentials);
            return response.data;
        } catch (error) {
            console.error("Error registering", error);
            throw error;
        }
    },
    loginWithGoogle: async (credential) => {
        try {
            const response = await axiosInstance.post('/auth-google', credential);
            return response.data;
        } catch (error) {
            console.error("Error logging in with Google", error);
            throw error;
        }
    },
};

export default authService;