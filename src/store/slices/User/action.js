import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
export const clearState = () => ({
    type: "CLEAR_STATE",
});

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users');
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
            const { data } = await api.get(`/users/coursebyuser`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)