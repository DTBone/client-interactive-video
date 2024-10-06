import axiosInstance from './axiosInstance';


const userService = {
    
    getUsers: async () => {
        try {
            const response = await axiosInstance.get('/');
            return response.data;
        } catch (error) {
            console.error("Error fetching users", error);
            throw error;
        }
    },

    getUserById: async (id, token) => {

        try {
            const response = await axiosInstance.get(`/${id}`, {
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
            const response = await axiosInstance.post(`/reset-access-token`);
            return response.data;
        } catch (error) {
            console.error(error.status);
            throw error;
        }
    },
    verifyCaptcha : async (token) =>{
        try {
            const response = await axiosInstance.post(`/verifyCaptcha`, {
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