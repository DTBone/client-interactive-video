import axiosInstance from "../api/axiosInstance_v2";

const streamService = {
    createStreamRoom: async ({instructorId, courseId, title, description}) => {
        try {
            const response = await axiosInstance.post('/livestreams', {
                instructorId: instructorId,
                courseId: courseId,
                title: title,
                description: description,
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
    getStreamRoom: async (streamId) => {
        try {
            const response = await axiosInstance.get(`/livestreams/${streamId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting stream room", error);
            throw error;
        }
    }
};

export default streamService;
