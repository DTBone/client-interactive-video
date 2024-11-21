import { asyncThunkCreator, createAsyncThunk } from '@reduxjs/toolkit';
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

export const getAllModules = createAsyncThunk(
    'module/getAllModules',
    async (courseId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/learns/${courseId}/modules`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getModuleById = createAsyncThunk(
    'module/getModuleById',
    async ({ moduleId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/learns/modules/${moduleId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateModule = createAsyncThunk(
    'module/updateModule',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(
                `/learns/${courseId}/modules/${moduleId}`,
                formData
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteModule = createAsyncThunk(
    'module/deleteModule',
    async ({ courseId, moduleId, password }, { rejectWithValue }) => {
        try {
            const verifyResponse = await axiosInstance.post('/auth/verify-password', {
                password
            });
            if (!verifyResponse.data.success) {
                throw new Error('Invalid password');
            }
            // If verification successful, proceed with deletion
            if (verifyResponse.status === 200) {
                const deleteResponse = await axiosInstance.delete(`/learns/${courseId}/modules/${moduleId}`);
                return moduleId;
            }

        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Invalid password');
            }
            if (error.response?.status === 403) {
                return rejectWithValue('You are not allowed to delete this module');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to delete module');
        }
    }
)

