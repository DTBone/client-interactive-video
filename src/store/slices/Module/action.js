import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
import axiosInstance from '~/Config/axiosInstance';

export const createModule = createAsyncThunk(
    'module/addNewModule',
    async ({ courseId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `/learns/${courseId}/modules`,
                formData
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);