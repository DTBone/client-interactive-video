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
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCourseByID = createAsyncThunk(
    'course/getCourseByID',
    async (courseId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/learns/${courseId}`);
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
            console.log('course/getCourseByInstructor', data);
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
            const { data } = await api.post("/learns", courseData);
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
    async ({ courseId, courseData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/learns/${courseId}`, courseData);
            console.log('data', data);
            console.log('API request body:', JSON.stringify(courseData));
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
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)