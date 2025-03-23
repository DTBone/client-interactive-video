import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';
export const clearState = () => ({
    type: "CLEAR_STATE",
});

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/users');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getAllCourseByUser = createAsyncThunk(
    'user/getAllCourseByUser',
    async ({ rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/users/coursebyuser`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)