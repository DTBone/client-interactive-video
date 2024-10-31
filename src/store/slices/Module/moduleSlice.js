import { createSlice, current } from "@reduxjs/toolkit";
import { createModule } from "./action";

const moduleSlice = createSlice({
    name: 'module-slice',
    initialState: {
        modules: [],
        currentModule: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentModule: (state) => {
            state.currentModule = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModule.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModule = action.payload;
                state.error = null;
            })
            .addCase(createModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearCurrentModule, clearError } = moduleSlice.actions;

export default moduleSlice.reducer;