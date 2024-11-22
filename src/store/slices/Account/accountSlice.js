import { createSlice } from '@reduxjs/toolkit';
import { getAllAccount, updateAccount } from './action';

const paymentSlice = createSlice({
    name: 'account',
    initialState: {
        accounts: [],
        count: 0,
        accountDetails: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload.data.users;
                state.count = action.payload.count;
            })
            .addCase(getAllAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                   state.loading = false
                   state.accountDetails = action.payload.data
            })
            .addCase(updateAccount.rejected, (state, action) => {
                  state.loading = false
                  state.error = action.payload
            })
            ;
    },
});

export default paymentSlice.reducer;