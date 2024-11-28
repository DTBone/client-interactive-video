import { createSlice } from "@reduxjs/toolkit";
import { compileRunCode, getProgramming } from "./action";
const compileSlice = createSlice({
    name: 'compile-slice',
    initialState: {
        loading: false,
        error: null,
        output: null,
        refresh: false,
        problem: null,
        list: [],
        compile: null,
        submission: null
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
            });
    }
});

export const { clearError, toggleRefresh } = compileSlice.actions;

export default compileSlice.reducer;