import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../Config/api';
import axiosInstance from '~/Config/axiosInstance';




export const updateSupplementProgress = createAsyncThunk(
    'progress/updateSupplementProgress',
    async ({ progressId, progressSupplement }, { rejectWithValue }) => {
        try {

            const res = await api.put(`/progress/supplement/${progressId}`, {
                progressSupplement: progressSupplement

            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update supplement progress failed');
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
    async (courseInput, { rejectWithValue }) => {
        try {
            // Chuẩn hóa courseId
            const courseId =
                typeof courseInput === 'object' && courseInput !== null
                    ? courseInput.courseId
                    : courseInput;

            console.log('Normalized courseId:', courseId);

            if (!courseId) {
                return rejectWithValue('Course ID is required');
            }

            const res = await api.get(`/progress`, {
                params: {
                    courseId: String(courseId)
                }
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Get progress failed');
        }
    }
);

export const getGradeProgress = createAsyncThunk(
    'progress/getGradeProgress',
    async ({ courseId, ids = [] }, { rejectWithValue }) => {
        try {
            console.log('ids', ids);
            const res = await axiosInstance.get(`/progress/${courseId}/grade`, {
                params: {
                    ids
                }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);




export const sendProgressToServer = createAsyncThunk(
    'progress/sendProgressToServer',
    async (moduleItemId, progressData, { rejectWithValue }) => {

        console.log('progressData', progressData);
        try {
            const res = await axiosInstance.post(`/progress/moduleItem/${moduleItemId}`, {
                params: {
                    progressData: progressData,
                    moduleItemId: moduleItemId
                }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'Send progress failed');
        }
    }
);

export const getModuleItemProgress = createAsyncThunk(
    'progress/getModuleItemProgress',
    async ({ moduleItemId }, { rejectWithValue }) => {
        console.log('moduleItemId', moduleItemId);
        try {
            const res = await api.get(`/progress/moduleItem/${moduleItemId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

export const getModuleProgress = createAsyncThunk(
    'progress/getModuleProgress',
    async ({ moduleId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/progress/module/${moduleId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

export const updateVideoProgress = createAsyncThunk(
    'progress/updateVideoProgress',
    async ({ progressId, progressVideo }, { rejectWithValue }) => {
        try {
            console.log('Updating video progress:', { progressId, progressVideo });
            const res = await axiosInstance.put(`/progress/lecture/${progressId}`, {
                progressVideo
            });
            return res.data;
        } catch (error) {
            console.error('Video progress update failed:', error);
            return rejectWithValue(error?.response?.data || 'Update video progress failed');
        }
    }
);


