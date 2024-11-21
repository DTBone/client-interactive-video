import { asyncThunkCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';
import { api } from '~/Config/api';

export const createLecture = createAsyncThunk(
    'module/addNewModuleItem',
    async (formData, { rejectWithValue }) => {
        try {
            console.log("form data: ", formData.get('video'))
            const { data } = await api.post(
                `/modules/${formData.get('moduleId')}/videos`,
                {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    references: JSON.parse(formData.get('references')),
                    video: formData.get('video')
                }
            );

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

