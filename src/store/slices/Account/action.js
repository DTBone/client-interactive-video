import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getAllAccount = createAsyncThunk(
    'accounts/getAllAccount',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await api.get("/users",{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get payment failed');
        }
    }
);
//Update account
export const updateAccount = createAsyncThunk(
    'accounts/updateAccount',
    async (data, { rejectWithValue }) => {
        const adminId = JSON.parse(localStorage.getItem('user'))._id
        try {
            const result = await api.put(`/users/update-by-admin/${adminId}`, data, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
            } catch (error) {
                return rejectWithValue(error || 'Update account failed');
            }
        }
)

export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (data, { rejectWithValue }) => {
        try {
            const result = await api.post(`/users`, data, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
        }
        catch (error) {
            return rejectWithValue(error || 'Create account failed');
        }
    })

