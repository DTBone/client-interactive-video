import { createSlice } from "@reduxjs/toolkit";
import { compileRunCode, compileSubmitCode, getProgramming, getSubmission } from "./action";
const compileSlice = createSlice({
    name: 'compile-slice',
    initialState: {
        loading: false,
        error: null,
        output: null,
        refresh: false,
        problem: null,
        submissions: [],
        compile: null,
        submission: null,
        tc: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        toggleRefresh: (state) => {
            state.refresh = !state.refresh;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProgramming.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProgramming.fulfilled, (state, action) => {
                state.loading = false;
                state.problem = action.payload;
                state.error = null;
            })
            .addCase(getProgramming.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(compileRunCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(compileRunCode.fulfilled, (state, action) => {
                state.loading = false;
                state.compile = action.payload;
                state.error = null;
            })
            .addCase(compileRunCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(compileSubmitCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(compileSubmitCode.fulfilled, (state, action) => {
                state.loading = false;
                state.submission = action.payload.submission;
                state.tc = action.payload.testcases;
                state.error = null;
            })
            .addCase(compileSubmitCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubmission.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
                state.error = null;
            })
            .addCase(getSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearError, toggleRefresh } = compileSlice.actions;

export default compileSlice.reducer;