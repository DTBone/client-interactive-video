import { createSlice } from "@reduxjs/toolkit";
import { createModuleItemLecture, createModuleItemProgramming, createModuleItemQuiz, createModuleItemSupplement, getModuleItemById } from "./action";

const moduleItemSlice = createSlice({
    name: 'module-item-slice',
    initialState: {
        loading: false,
        error: null,
        items: [],
        currentItem: null,
        refresh: false
    },
    reducers: {
        clearCurrentModule: (state) => {
            state.currentItem = null;
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
            //moduleItem
            .addCase(createModuleItemSupplement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModuleItemSupplement.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(createModuleItemSupplement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred';
            })
            .addCase(createModuleItemLecture.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModuleItemLecture.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(createModuleItemLecture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createModuleItemQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModuleItemQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(createModuleItemQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createModuleItemProgramming.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModuleItemProgramming.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(createModuleItemProgramming.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //get current module item by id
            .addCase(getModuleItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(getModuleItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearCurrentModule, clearError, toggleRefresh } = moduleItemSlice.actions;
export default moduleItemSlice.reducer;