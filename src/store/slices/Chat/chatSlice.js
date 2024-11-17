import { createSlice } from '@reduxjs/toolkit';
import { getConversations } from './action';



const chatSlice = createSlice({
    name: 'chats',
    initialState: {
        conversations: [],
        count: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getConversations.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload.data;
                state.count = action.payload.count;
            })
            .addCase(getConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            ;
    },
});

export default chatSlice.reducer;