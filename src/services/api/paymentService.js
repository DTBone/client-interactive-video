import { api } from "~/Config/api";

const paymentService = {
    createPayment: async (amount, courseId) => {
        try {
            const response = await api.post('/payments/create-payment', {
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
