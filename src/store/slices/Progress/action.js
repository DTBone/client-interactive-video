import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../Config/api';
import axiosInstance from '~/Config/axiosInstance';


export const updateLectureProgress = createAsyncThunk(
    'progress/updateLectureProgress',
    async (data, { rejectWithValue }) => {
        try {
            console.log('data', data);
            const res = await api.put(`/progress/${data.progressId}/video`, {
                progressVideo: data.progressVideo
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);

export const updateSupplementProgress = createAsyncThunk(
    'progress/updateSupplementProgress',
    async (data, { rejectWithValue }) => {
        try {
            console.log('data', data);
            const res = await api.put(`/progress/${data.progressId}/supplement`, {
                progressSupplement: data.progressSupplement

            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);


export const updateProgrammingProgress = createAsyncThunk(
    'programming/updateProgrammingProgress',
    async ({ moduleItemId, moduleId, data }, { rejectWithValue }) => {
        try {
            //console.log('data programming', data, moduleItemId, moduleId);
            const res = await axiosInstance.put(`/progress/${moduleItemId}/programming`, {
                progressProgramming: data,
                moduleId: moduleId,
                moduleItemId: moduleItemId
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);


export const getProgrammingProgressByProblemId = createAsyncThunk(
    'programming/getProgrammingProgressByProblemId',
    async ({ problemId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/progress/${problemId}/programming`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get programming progress failed');
        }
    }
)

export const getProgress = createAsyncThunk(
    'progress/getProgress',
    async (courseId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/progress`, {
                params: {
                    courseId
                }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

