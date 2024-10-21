import axiosInstance from "./axiosInstance_v2";

const paymentService = {
    createPayment: async (amount, courseId) => {
        try {
            const response = await axiosInstance.post('/payments/create-payment', {
                amount: amount,
                courseId: courseId,
                userId: JSON.parse(localStorage.getItem('user'))._id,
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating payment", error);
            throw error;
        }
    },
};

export default paymentService;
