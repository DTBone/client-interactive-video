import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getAllCourse = createAsyncThunk(
    'course/getAllCourse',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/learns");
            return data;
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

export const createCourse = createAsyncThunk(
    'course/createCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/learns", courseData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
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
            return rejectWithValue(error.message);
        }
    }
);