import { createSlice, current } from "@reduxjs/toolkit";
import { createModule, deleteModule, getAllModules, getAllModulesByModuleItemId, getModuleById, getModuleByItemId, updateModule } from "./action";

const moduleSlice = createSlice({
    name: 'module-slice',
    initialState: {
        modules: [],
        currentModule: null,
        loading: false,
        error: null,
        refresh: false
    },
    reducers: {
        clearCurrentModule: (state) => {
            state.currentModule = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        toggleRefresh: (state) => {
            console.log('toggle refresh')
            state.refresh = !state.refresh;
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
            .addCase(getAllModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload;
                state.error = null;
            })
            .addCase(getAllModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(updateModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModule = action.payload;
                state.error = null;
            })
            .addCase(updateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteModule.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = state.modules.filter(module => module.index !== action.payload);
                state.error = null;
            })
            .addCase(deleteModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getModuleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModule = action.payload;
                state.error = null;
            })
            .addCase(getModuleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllModulesByModuleItemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllModulesByModuleItemId.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload)
                state.modules = action.payload;
                state.error = null;
            })
            .addCase(getAllModulesByModuleItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getModuleByItemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleByItemId.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModule = action.payload;
                state.error = null;
            })
            .addCase(getModuleByItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearCurrentModule, clearError, toggleRefresh } = moduleSlice.actions;

export default moduleSlice.reducer;