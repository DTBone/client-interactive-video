import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
import axiosInstance from '~/Config/axiosInstance';
// Tạo async thunks
export const getAllCourse = createAsyncThunk(
    'course/getAllCourse',
    async (filter, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/learns", {
                params: {
                    page: filter?.page,
                    limit: filter?.limit,
                    search: filter?.search || '',
                    level: filter?.level || 'all',
                    tags: filter?.tags || [],
                    orderBy: filter?.orderBy,
                }
            });
            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCourseByID = createAsyncThunk(
    'course/getCourseByID',
    async (id, { rejectWithValue }) => {
        console.log('courseId', id);

        try {
            const { data } = await axiosInstance.get(`/learns/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCourseByInstructor = createAsyncThunk(
    'course/getCourseByInstructor',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/learns/getCourseByInstructor`);
            //console.log('course/getCourseByInstructor', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCourse = createAsyncThunk(
    'course/createCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post("/learns", courseData);
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create course';

            return rejectWithValue(errorMessage);
        }
    }
);

export const updateCourse = createAsyncThunk(
    'course/updateCourse',
    async ({ courseId, formData }, { rejectWithValue }) => {
        console.log("courseData", formData);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? value.name : value);
        }
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axiosInstance.put(
                `/learns/${courseId}`,
                formData,
                config
            );
            // console.log('data', data);
            // console.log('API request body:', JSON.stringify(courseData));
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update course';

            return rejectWithValue(errorMessage);
        }
    }
);
export const approveCourse = createAsyncThunk(
    'course/approveCourse',
    async ({ courseId, courseData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/learns/${courseId}/approve`, courseData, {
                user: {
                    id: localStorage.getItem('user')._id,
                }
            });
            console.log(data);
            return data;
        } catch (error) {
            console.log('get module item failed', error.message);
            return rejectWithValue(error.message);
        }
    }
)

export const enrollCourse = createAsyncThunk(
    'course/enrollCourse',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/learns/enroll/${courseId}`);
            console.log(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getCertificateByCourseId = createAsyncThunk(
    'course/getCertificateByCourseId',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/learns/${courseId}/certificate`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getAllCoursebyUser = createAsyncThunk(
    'course/getAllCoursebyUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/learns/my-learning`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
