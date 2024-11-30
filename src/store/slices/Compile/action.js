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
    '/compile/runcode',
    async ({ userCode, userLang, userInput, itemId, codeExecute }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/problem/runcode/${itemId}`, {
                code: userCode,
                language: userLang.toLowerCase(),
                input: userInput,
                codeExecute: codeExecute,
            });
            return data.data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)

export const compileSubmitCode = createAsyncThunk(
    '/compile/submitcode',
    async ({ userCode, userLang, itemId, testcases, codeExecute }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/problem/submitcode/${itemId}`, {
                code: userCode,
                language: userLang.toLowerCase(),
                testcases,
                codeExecute,
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)