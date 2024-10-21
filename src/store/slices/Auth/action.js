import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('users/login', credentials);
            console.log('API Response:', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('users/logout');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Logout failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('users/register', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (credential, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('users/auth-google', credential);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Google login failed');
        }
    }
);

export const getResetAccessToken = createAsyncThunk(
    'auth/getResetAccessToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`users/reset-access-token`);
            return response.data;
        } catch (error) {
            console.error(error.status);
            return rejectWithValue(error.response?.data || 'Failed to reset access token');
        }
    }
);

export const verifyCaptcha = createAsyncThunk(
    'auth/verifyCaptcha',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`users/verifyCaptcha`, {
                body: {
                    captchaToken: token
                }
            });
            return response.status;
        } catch (error) {
            console.error(error.status);
            return rejectWithValue(error.response?.data || 'Failed to verify CAPTCHA');
        }
    }
);
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('users/check-auth');
            console.log('check status', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Authentication check failed');
        }
    }
);