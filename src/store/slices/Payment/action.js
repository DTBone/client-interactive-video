import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getPaymentByFilter = createAsyncThunk(
    'payments/getPaymentByFilter',
    async (params, { rejectWithValue }) => {
        try {
            const data = await api.get("/payments",{
                params : {
                    fromMonth: params.from,
                    toMonth: params.to,
                    year: params.year ? params.year : new Date().getFullYear(),
                    userId: params?.userId
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get payment failed');
        }
    }
);

export const getPaymentById = createAsyncThunk(
    'payments/getPaymentById',
    async (paymentId, { rejectWithValue }) => {
        try {
            const data = await api.get(`/payments/${paymentId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get payment failed');
        }
    }
);

