import { createSlice } from "@reduxjs/toolkit"
import { getModuleById } from "../Module/action";
const progressSlice = createSlice({
    name: 'progress-slice',
    initialState: {
        progress: {},
        loading: false,
        error: null,
        refresh: false
    },
    reducers: {
        clearProgress: (state) => {
            state.progress = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        toggleRefresh: (state) => {
            state.refresh = !state.refresh;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getModuleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleById.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload.data.progress;
                state.error = null;
            })
            .addCase(getModuleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        }
})

export const { clearProgress, clearError, toggleRefresh } = progressSlice.actions;
export default progressSlice.reducer;