import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getQuizById = createAsyncThunk(
    'quiz/getQuizById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await api.get(`/quizzes/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);

export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(`/quizzes/${data.quizId}/answer`, {
                answers: data.answers,
                timeSpent: parseInt(data.timeSpent)
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Submit quiz failed');
        }
    }
);


