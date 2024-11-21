import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getReviews = createAsyncThunk(
    'reviews/getReviews',
    async (params, { rejectWithValue }) => {
        try {
            const data = await api.get("/reviews",{
                params : {
                    limit: params.limit,
                    page: params.page,
                    course: params.courseId,
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (params, { rejectWithValue }) => {
        try {
            const data = await api.post("/reviews", params);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Create review failed');
        }
    }
);
