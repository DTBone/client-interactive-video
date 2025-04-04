import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
import axiosInstance from '~/Config/axiosInstance';

export const fetchCourses = createAsyncThunk(
    'search/fetchCourses',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/search/fetchCourses?page=${page}&limit=${limit}`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)