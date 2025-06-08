import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('users/login', credentials);
            //console.log('API Response:', response);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            return rejectWithValue(error.response?.data.error || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('users/logout');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.error || 'Logout failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('users/register', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.error || 'Registration failed');
        }
    }
);

export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (credential, { rejectWithValue }) => {
        try {
            const response = await api.post('users/auth-google', credential);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.error || 'Google login failed');
        }
    }
);

export const getResetAccessToken = createAsyncThunk(
    'auth/getResetAccessToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`users/reset-access-token`);
            return response.data;
        } catch (error) {
            //console.error(error.status);
            return rejectWithValue(error.response?.data.error || 'Failed to reset access token');
        }
    }
);

export const verifyCaptcha = createAsyncThunk(
    'auth/verifyCaptcha',
    async (token, { rejectWithValue }) => {
        try {
            const response = await api.post(`users/verifyCaptcha`, {
                body: {
                    captchaToken: token
                }
            });
            return response.status;
        } catch (error) {
            console.error(error.status);
            return rejectWithValue(error.response?.data.error || 'Failed to verify CAPTCHA');
        }
    }
);
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await api.get('users/check-auth');
            //console.log('check status', response.data);
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            return rejectWithValue(error.response?.data.error || 'Authentication check failed');
        }
    }
);