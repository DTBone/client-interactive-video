import { createSlice } from "@reduxjs/toolkit"
import { getModuleById } from "../Module/action";

import { getProgrammingProgressByProblemId, updateProgrammingProgress, getProgress } from "./action";

const progressSlice = createSlice({
    name: 'progress-slice',
    initialState: {
        progress: {},
        loading: false,
        error: null,
        refresh: false,
        moduleProgress: null,
        moduleItemProgress: null,
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

            .addCase(updateProgrammingProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProgrammingProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleProgress = action.payload.moduleProgress;
                state.moduleItemProgress = action.payload.moduleItemProgress;
                state.error = null;
                //console.log("updateProgrammingProgress", state.moduleItemProgress);
            })
            .addCase(updateProgrammingProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProgrammingProgressByProblemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProgrammingProgressByProblemId.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleProgress = action.payload.moduleProgress;
                state.moduleItemProgress = action.payload.moduleItemProgress;
                state.error = null;
            })
            .addCase(getProgrammingProgressByProblemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload.data;
                state.error = null;
            })
            .addCase(getProgress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        }

})

export const { clearProgress, clearError, toggleRefresh } = progressSlice.actions;
export default progressSlice.reducer;