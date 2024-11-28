import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';

export const getProgramming = createAsyncThunk(
    'compile/getProgramming',
    async ({ problemId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/problem/${problemId}`);
            return data.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const compileRunCode = createAsyncThunk(
    '/compile',
    async ({ userCode, userLang, userInput, itemId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/problem/runcode/${itemId}`, {
                code: userCode,
                language: userLang.toLowerCase(),
                input: userInput,
            });
            return data.data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)