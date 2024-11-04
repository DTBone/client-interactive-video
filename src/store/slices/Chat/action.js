import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getConversations = createAsyncThunk(
    'chats/getConversations',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await api.get("/conversations",{
                params : {
                    userId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get chats failed');
        }
    }
);