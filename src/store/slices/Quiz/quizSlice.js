// store/slices/Quiz/quizSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitQuiz, getQuizById } from './action';

const initialState = {
    quizProgress: null,
    currentQuiz: null,
    loading: false,
    error: null,
    moduleItems: [], // Add this to track module items
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        updateModuleItemStatus: (state, action) => {
            const { quizId, moduleId } = action.payload;
            // Update the status of the completed quiz in moduleItems
            state.moduleItems = state.moduleItems.map(item => {
                if (item.quiz === quizId && item.module === moduleId) {
                    return { ...item, status: 'completed' };
                }
                return item;
            });
        },
        setModuleItems: (state, action) => {
            state.moduleItems = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle submitQuiz action
            .addCase(submitQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.quizProgress = action.payload.data;
                    // Update the quiz status when submitted successfully
                    state.moduleItems = state.moduleItems.map(item => {
                        if (item.quiz === action.payload.data.quizId) {
                            return { ...item, status: 'completed' };
                        }
                        return item;
                    });
                }
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle getQuizById action
            .addCase(getQuizById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuizById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.currentQuiz = action.payload.data;
                    state.quizProgress = action.payload.quizProgress;
                }
            })
            .addCase(getQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { updateModuleItemStatus, setModuleItems } = quizSlice.actions;
export default quizSlice.reducer;