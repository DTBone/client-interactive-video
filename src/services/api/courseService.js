import axiosInstance from "./axiosInstance_v2";

const courseService = {
    getCourses: async () => {
        try {
            const response = await axiosInstance.get('/learns');
            return response.data;
        } catch (error) {
            console.error("Error fetching courses", error);
            throw error;
        }
    },
    getCourseById: async (id, userId) => {
        try {
            const response = await axiosInstance.get(`/learns/${id}`, {
                params: {
                    userId: userId,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching course by ID", error);
            throw error;
        }
    },
    createCourse: async (course) => {
        try {
            const response = await axiosInstance.post('/learns', course);
            return response.data;
        } catch (error) {
            console.error("Error creating course", error);
            throw error;
        }
    },
    updateCourse: async (id, course) => {
        try {
            const response = await axiosInstance.put(`/learns/${id}`, course);
            return response.data;
        } catch (error) {
            console.error("Error updating course", error);
            throw error;
        }
    },
    deleteCourse: async (id) => {
        try {
            const response = await axiosInstance.delete(`/learns/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting course", error);
            throw error;
        }
    },
    getCoursesByStudentId: async (id) => {
        try {
            const response = await axiosInstance.get(`/learns/student/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching courses by student ID", error);
            throw error;
        }
    },
};

export default courseService;
