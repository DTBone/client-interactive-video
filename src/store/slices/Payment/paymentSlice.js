import { createSlice } from '@reduxjs/toolkit';
import { getPaymentByFilter, getPaymentById } from './action';


const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        payments: [],
        count: 0,
        paymentDetail: {},
        total: {},
        courses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPaymentByFilter.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload.data.payments;
                state.courses = action.payload.data.courses;
                state.total = action.payload.total;
                state.count = action.payload.count;
            })
            .addCase(getPaymentByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPaymentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentById.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentDetail = action.payload.data;
            })
            .addCase(getPaymentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            ;
    },
});

export default paymentSlice.reducer;