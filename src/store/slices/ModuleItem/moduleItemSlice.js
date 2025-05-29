import { createSlice } from "@reduxjs/toolkit";
import { createModuleItemLecture, createModuleItemProgramming, createModuleItemQuiz, createModuleItemSupplement,  editLectureByItemId, editProgrammingByItemId, editQuizByItemId, editSupplementByItemId, getModuleItemById, preloadInteractiveQuestion } from "./action";

const moduleItemSlice = createSlice({
    name: 'module-item-slice',
    initialState: {
        loading: false,
        error: null,
        items: [],
        currentItem: null,
        refresh: false,
        isExpanded: false,
        currentQuestion: null,
        questions: [],
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
        },
        toggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded;
        },
        setSidebar: (state, action) => {
            state.isExpanded = action.payload;
        },
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


            .addCase(editSupplementByItemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editSupplementByItemId.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(editSupplementByItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(editLectureByItemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editLectureByItemId.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action: ", action.payload.data);
                state.currentItem = action.payload.data;
                state.error = null;
            })
            .addCase(editLectureByItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(editQuizByItemId.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editQuizByItemId.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(editQuizByItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(editProgrammingByItemId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProgrammingByItemId.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
                state.error = null;
            })
            .addCase(editProgrammingByItemId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(preloadInteractiveQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(preloadInteractiveQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
                state.error = null;
            })
            .addCase(preloadInteractiveQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentModule, clearError, toggleRefresh, setSidebar, toggleSidebar } = moduleItemSlice.actions;
export default moduleItemSlice.reducer;