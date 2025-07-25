import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
import axiosInstance from '~/Config/axiosInstance';

export const getProgramming = createAsyncThunk(
    'compile/getProgramming',
    async ({ problemId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/problem/${problemId}`);
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
            const { data } = await api.post(`/problem/runcode/${itemId}`, {
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
    async ({ userCode, userLang, itemId, testcases, codeExecute, progressData }, { rejectWithValue }) => {
        try {
            //console.log("progressData: ", progressData)
            const { data } = await api.post(`/problem/submitcode/${itemId}`, {
                code: userCode,
                language: userLang.toLowerCase(),
                testcases,
                codeExecute,
                progressData,
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)
export const getSubmission = createAsyncThunk(
    '/compile/getsubmission',
    async ({ problemId }, { rejectWithValue }) => {
        try {
            //console.log("problemID: ", problemId);
            const { data } = await api.get(`/problem/submitcode/${problemId}`);
            return data.data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)