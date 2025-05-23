import { createSlice } from "@reduxjs/toolkit"
import { getModuleById } from "../Module/action";

import { getProgrammingProgressByProblemId, updateProgrammingProgress, getProgress, getGradeProgress, getModuleItemProgress, sendProgressToServer, updateLectureProgress, updateSupplementProgress, getModuleProgress } from "./action";

const progressSlice = createSlice({
    name: 'progress-slice',
    initialState: {
        progress: {},
        loading: false,
        error: null,
        refresh: false,
        moduleProgress: null,
        moduleItemProgress: null,
        grade: {},
        checkProgress: false,
        courseCompletion: {},
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
                state.courseCompletion = action.payload.courseCompletion;
                state.error = null;
            })
            .addCase(getProgress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getGradeProgress.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGradeProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.grade = action.payload.data;
                state.error = null;
            })
            .addCase(getGradeProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // .addCase(getCheckProgress.pending, (state, action) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(getCheckProgress.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.checkProgress = action.payload.isAllCompleted;
            //     state.error = null;
            // })
            // .addCase(getCheckProgress.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload;
            // })
            .addCase(getModuleProgress.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleProgress = action.payload.data;
                state.error = null;
            })
            .addCase(getModuleProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getModuleItemProgress.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModuleItemProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleItemProgress = action.payload.data;
                state.error = null;
            })
            .addCase(getModuleItemProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendProgressToServer.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendProgressToServer.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload.data;
                state.error = null;
            })
            .addCase(sendProgressToServer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateLectureProgress.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLectureProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload.data;
                state.error = null;
            })
            .addCase(updateLectureProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSupplementProgress.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSupplementProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload.data;
                state.error = null;
            })
            .addCase(updateSupplementProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }

})

export const { clearProgress, clearError, toggleRefresh } = progressSlice.actions;
export default progressSlice.reducer;