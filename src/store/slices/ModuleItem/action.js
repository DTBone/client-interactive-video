import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';

export const createModuleItemSupplement = createAsyncThunk(
    'module/moduleItem/addNewSupplement',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {

            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axiosInstance.post(
                `/learns/${courseId}/modules/${moduleId}/supplement`,
                formData,
                config
            );
            //console.log('Response data:', data);
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemLecture = createAsyncThunk(
    'module/moduleItem/addNewLecture',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {
            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axiosInstance.post(
                `/learns/${courseId}/modules/${moduleId}/lecture`,
                formData,
                config
            );
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemQuiz = createAsyncThunk(
    'module/moduleItem/addNewQuiz',
    async ({ courseId, moduleId, quizData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/learns/${courseId}/modules/${moduleId}/quiz`, quizData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemProgramming = createAsyncThunk(
    'module/moduleItem/addNewProgramming',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/learns/${courseId}/modules/${moduleId}/programming`, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getModuleItemById = createAsyncThunk(
    'module/moduleItem/getModuleItemById',
    async ({ moduleItemId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/learns/moduleitem/${moduleItemId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

