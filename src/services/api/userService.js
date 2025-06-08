import { api } from "~/Config/api";


const userService = {
    
    getUsers: async () => {
        try {
            const response = await api.get('/users/');
            return response.data;
        } catch (error) {
            console.error("Error fetching users", error);
            throw error;
        }
    },

    getUserById: async (id, token) => {

        try {
            const response = await api.get(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID", error);
            throw error;
        }
    },
    getResetAccessToken: async () => {
        try {
            const response = await api.post(`/reset-access-token`);
            return response.data;
        } catch (error) {
            console.error(error.status);
            throw error;
        }
    },
    verifyCaptcha : async (token) =>{
        try {
            const response = await api.post(`/verifyCaptcha`, {
                body: {
                    captchaToken: token
                }
            });
            return response.status;
        } catch (error) {
            console.error(error.status);
            throw error;
        }
    }
};

export default userService;