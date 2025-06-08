import { api } from '~/Config/api';


const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            console.error("Error logging in", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/users/logout');
            return response.data;
        } catch (error) {
            console.error("Error logging out", error);
            throw error;
        }
    },
    register: async (credentials) => {
        try {
            const response = await api.post('/register', credentials);
            return response.data;
        } catch (error) {
            console.error("Error registering", error);
            throw error;
        }
    },
    loginWithGoogle: async (credential) => {
        try {
            const response = await api.post('/auth-google', credential);
            return response.data;
        } catch (error) {
            console.error("Error logging in with Google", error);
            throw error;
        }
    },
};

export default authService;