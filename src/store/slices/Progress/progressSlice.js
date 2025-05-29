import { createSlice } from "@reduxjs/toolkit";
import { getModuleById } from "../Module/action";

import {
  getProgrammingProgressByProblemId,
  updateProgrammingProgress,
  getProgress,
  getGradeProgress,
  getModuleItemProgress,
  sendProgressToServer,
  updateSupplementProgress,
  getModuleProgress,
  updateVideoProgress,
} from "./action";

const progressSlice = createSlice({
  name: "progress-slice",
  initialState: {
    progress: {},
    loading: {},
    error: {},
    errors: {},
    refresh: false,
    moduleProgress: null,
    moduleItemProgress: null,
    grade: {},
    checkProgress: false,
    courseCompletion: {},
    videoProgresses: {},
    progressMilestones: [10, 25, 50, 75, 90, 95, 100], // Milestones for progress tracking
    sentMilestones: {},
  },
  reducers: {
    clearProgress: (state) => {
      state.progress = [];
      state.error = null;
    },
    clearError: (state, action) => {
      const { videoId } = action.payload;
      delete state.errors[videoId];
    },
    toggleRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    updateLocalProgress: (state, action) => {
      const { videoId, progress } = action.payload;
      if (!state.videoProgresses[videoId]) {
        state.videoProgresses[videoId] = {
          completionPercentage: 0,
          watchedDuration: 0,
          totalDuration: 0,
          lastPosition: 0,
          timeSpent: 0,
          startTime: Date.now(),
        };
      }

      state.videoProgresses[videoId] = {
        ...state.videoProgresses[videoId],
        ...progress,
        lastUpdated: Date.now(),
      };
    },
    // Đánh dấu milestone đã được gửi
    markMilestoneSent: (state, action) => {
      const { videoId, milestone } = action.payload;
      if (!state.sentMilestones[videoId]) {
        state.sentMilestones[videoId] = [];
      }
      if (!state.sentMilestones[videoId].includes(milestone)) {
        state.sentMilestones[videoId].push(milestone);
      }
    },

    // Reset trạng thái cho video mới
    resetVideoProgress: (state, action) => {
      const { videoId } = action.payload;
      delete state.videoProgresses[videoId];
      delete state.sentMilestones[videoId];
      delete state.loading[videoId];
      delete state.errors[videoId];
    },
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
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGradeProgress.pending, (state) => {
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
      .addCase(getModuleProgress.pending, (state) => {
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
      .addCase(getModuleItemProgress.pending, (state) => {
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
      .addCase(sendProgressToServer.pending, (state) => {
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

      .addCase(updateSupplementProgress.pending, (state) => {
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
      .addCase(updateVideoProgress.pending, (state, action) => {
        // Lấy videoId an toàn
        const videoId = action.meta?.arg?.progressVideo?.videoId;

        // Kiểm tra videoId có tồn tại không
        if (!videoId) {
          console.error("videoId is undefined in updateVideoProgress.pending");
          return; // Thoát sớm nếu không có videoId
        }

        // Đảm bảo loading và errors là objects
        if (typeof state.loading !== "object" || state.loading === null) {
          state.loading = {};
        }
        if (typeof state.errors !== "object" || state.errors === null) {
          state.errors = {};
        }

        // Set loading = true cho pending state
        state.loading[videoId] = true;
        // Clear previous error if any
        if (state.errors[videoId]) {
          delete state.errors[videoId];
        }
      })
      .addCase(updateVideoProgress.fulfilled, (state, action) => {
        const videoId = action.meta.arg.progressVideo.videoId;
        state.loading[videoId] = false;

        // Cập nhật dữ liệu từ server response
        if (action.payload.data) {
          const serverProgress = action.payload.data.moduleItemProgresses?.find(
            (item) => item.result?.video?.videoId === videoId
          );

          if (serverProgress) {
            state.videoProgresses[videoId] = {
              ...state.videoProgresses[videoId],
              ...serverProgress.result.video,
              serverSynced: true,
            };
          }
        }
      })
      .addCase(updateVideoProgress.rejected, (state, action) => {
        const videoId = action.meta.arg.progressVideo.videoId;
        // Đảm bảo loading và errors là objects
        if (typeof state.loading !== "object" || state.loading === null) {
          state.loading = {};
        }
        if (typeof state.errors !== "object" || state.errors === null) {
          state.errors = {};
        }

        state.loading[videoId] = false;
        state.errors[videoId] = action.payload;
      });
  },
});

export const {
  clearProgress,
  clearError,
  toggleRefresh,
  updateLocalProgress,
  markMilestoneSent,
  resetVideoProgress,
} = progressSlice.actions;
export default progressSlice.reducer;

// Selectors
export const selectVideoProgress = (state, videoId) =>
  state?.progress?.videoProgresses[videoId] || null;

export const selectVideoLoading = (state, videoId) =>
  state?.progress?.loading[videoId] || false;

export const selectVideoError = (state, videoId) =>
  state?.progress?.errors[videoId] || null;

export const selectSentMilestones = (state, videoId) =>
  state?.progress?.sentMilestones[videoId] || [];

export const selectProgressMilestones = (state) =>
  state?.progress?.progressMilestones;
