import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import {
  updateLocalProgress as updateLocalProgressAction,
  resetVideoProgress,
  selectVideoProgress,
  selectVideoLoading,
  selectVideoError,
  selectSentMilestones,
  selectProgressMilestones,
} from "~/store/slices/Progress/progressSlice.js";

import { getModuleItemProgress, getProgress, updateVideoProgress } from "~/store/slices/Progress/action.js";
import { useLocation } from "react-router-dom";

/**
 * OPTIMIZED VIDEO PROGRESS TRACKING HOOK - V2
 * 
 * MAJOR CHANGES:
 * - API calls ONLY when: user leaves page OR video reaches 100%
 * - Enhanced local state management for smooth UI
 * - Better synchronization between video currentTime and progressBar
 * - Reduced API calls for better performance
 * 
 * COMPLETED VIDEO HANDLING:
 * - Khi video đã completed (100%), ngăn chặn mọi progress updates
 * - Preserve completion state (100%, status: "completed") 
 * - Cho phép xem lại từ đầu mà không làm mất trạng thái completed
 * - Không auto-seek về cuối video khi completed để user có thể review
 */

const useVideoProgress = ({
  videoRef,
  progress,
  videoId,
  progressId, // ID của progress record
  onTimeUpdate, // Callback để đồng bộ với component cha
  onQuizSubmit, // Callback để đồng bộ với component cha
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const module = location.state?.module;
  const course = useSelector((state) => state.course.currentCourse);

  // Selectors
  const videoProgress = useSelector((state) =>
    selectVideoProgress(state, videoId)
  );
  const isLoading = useSelector((state) => selectVideoLoading(state, videoId));
  const error = useSelector((state) => selectVideoError(state, videoId));
  const sentMilestones = useSelector((state) =>
    selectSentMilestones(state, videoId)
  );
  const progressMilestones = useSelector(selectProgressMilestones);

  // Local state - Enhanced for better UI sync
  const [isPlayingProgress, setisPlayingProgress] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [localProgress, setLocalProgress] = useState({
    completionPercentage: 0,
    watchedDuration: 0,
    totalDuration: 0,
    lastPosition: 0,
    timeSpent: 0,
    status: "in-progress"
  });

  // Refs for tracking and optimization
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const progressDataRef = useRef(null);
  const hasTriggeredCompletion = useRef(false);
  const pendingSaveRef = useRef(false);

  // Load all module item statuses
  const moduleProgress = useSelector(
    (state) => state.module.currentModule?.data?.progress
  );

  const loadAllModuleItemStatuses = useCallback(async () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000);

    if (!module?.moduleItems?.length || !course?._id) {
      console.warn('Missing required data for loading module items');
      return;
    }

    try {
      const statusPromises = module.moduleItems.map(async (item) => {
        if (!item?._id) return null;

        try {
          await dispatch(getModuleItemProgress({ moduleItemId: item._id }));
          console.log("Loaded item:", item._id);
          return item._id;
        } catch (error) {
          console.error(`Error loading status for item ${item._id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(statusPromises);
      console.log('All items processed:', results.filter(Boolean));

      await dispatch(getProgress({ courseId: course._id }));
      console.log('Progress updated');
      console.log("moduleProgress useVideoProgress", moduleProgress);

    } catch (error) {
      console.error('Error in loadAllModuleItemStatuses:', error);
    }
  }, [dispatch, module, course, moduleProgress]);

  // Hàm tính toán tiến độ - Enhanced for real-time UI updates
  const calculateProgress = useCallback(() => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (!duration || duration === 0) return null;

    const timeSpent = localProgress.timeSpent || 0;
    let completionPercentage = Math.round((currentTime / duration) * 100);

    // Nếu progress đã completed, luôn giữ ở 100%
    if (progress?.status === "completed") {
      completionPercentage = 100;
      const progressData = {
        completionPercentage: 100,
        watchedDuration: duration,
        totalDuration: duration,
        lastPosition: duration,
        timeSpent,
        videoId,
        status: "completed"
      };

      return progressData;
    }

    const progressData = {
      completionPercentage,
      watchedDuration: currentTime,
      totalDuration: duration,
      lastPosition: currentTime,
      timeSpent,
      videoId,
      status: completionPercentage >= 100 ? "completed" : "in-progress"
    };

    return progressData;
  }, [videoId, localProgress.timeSpent, progress?.status]);

  // Enhanced debounced function để cập nhật local progress - chỉ local, không gọi API
  const debouncedLocalUpdate = useCallback(
    debounce((progressData) => {
      if (progressData) {
        // Chỉ cập nhật local state, không gọi API
        setLocalProgress(progressData);
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: progressData,
          })
        );
      }
    }, 100), // Giảm delay để UI responsive hơn
    [dispatch, videoId]
  );

  // Function để save progress lên server - chỉ gọi khi cần thiết
  const saveProgressToServer = useCallback(
    async (progressData, reason = "manual") => {
      if (!progressId || pendingSaveRef.current) {
        console.warn("progressId not available or save already pending");
        return;
      }

      pendingSaveRef.current = true;

      try {
        console.log(`Saving progress to server (${reason}):`, progressData);

        await dispatch(
          updateVideoProgress({
            progressId,
            progressVideo: {
              ...progressData,
              reason,
              updatedAt: Date.now(),
            },
          })
        ).unwrap();

        console.log(`Progress saved successfully for reason: ${reason}`);

        // Trigger onQuizSubmit nếu video completed
        if (progressData.completionPercentage >= 100 && onQuizSubmit && !hasTriggeredCompletion.current) {
          console.log("Video completed, triggering onQuizSubmit");
          hasTriggeredCompletion.current = true;
          onQuizSubmit("Video completed");
        }

        loadAllModuleItemStatuses();
      } catch (error) {
        console.error(`Failed to save progress (${reason}):`, error);
      } finally {
        pendingSaveRef.current = false;
      }
    },
    [dispatch, progressId, videoId, onQuizSubmit, loadAllModuleItemStatuses]
  );

  // Hàm cập nhật local progress - tối ưu cho UI mượt
  const updateLocalProgress = useCallback(() => {
    const now = Date.now();

    // Cập nhật mỗi 100ms để UI mượt hơn
    if (now - lastUpdateTimeRef.current < 100) return;
    lastUpdateTimeRef.current = now;

    const progressData = calculateProgress();
    if (!progressData) return;

    // Cập nhật thời gian đã xem nếu video đang phát
    if (isPlayingProgress && startTimeRef.current) {
      const timeSpentInThisSession = Math.floor(
        (now - startTimeRef.current) / 1000
      );
      const currentTimeSpent = localProgress.timeSpent || 0;
      progressData.timeSpent = currentTimeSpent + timeSpentInThisSession;
      startTimeRef.current = now;
    }

    // Kiểm tra nếu video đạt 100%
    const isCompleted = progressData.completionPercentage >= 100;
    const wasNotCompleted = progress?.status !== "completed";

    if (isCompleted && wasNotCompleted && !hasTriggeredCompletion.current) {
      console.log("Video reached 100%, will save to server");
      progressData.status = "completed";

      // Cập nhật local ngay lập tức để UI responsive
      debouncedLocalUpdate(progressData);

      // Gọi callback để đồng bộ với component cha
      if (onTimeUpdate) {
        onTimeUpdate(progressData);
      }

      // Save to server khi đạt 100%
      saveProgressToServer(progressData, "completion");
      return;
    }

    // Cập nhật local state thường xuyên để UI mượt
    debouncedLocalUpdate(progressData);

    // Cache progress data
    progressDataRef.current = progressData;

    // Gọi callback để đồng bộ với component cha
    if (onTimeUpdate) {
      onTimeUpdate(progressData);
    }
  }, [
    calculateProgress,
    isPlayingProgress,
    localProgress.timeSpent,
    progress?.status,
    debouncedLocalUpdate,
    onTimeUpdate,
    saveProgressToServer
  ]);

  // Throttled function để cập nhật progress - tăng tần suất cho UI mượt hơn
  const throttledUpdateProgress = useCallback(
    throttle(() => {
      updateLocalProgress();
    }, 100), // Giảm xuống 100ms để UI responsive hơn
    [updateLocalProgress]
  );

  // Event handlers
  const handlePlay = useCallback(() => {
    setisPlayingProgress(true);
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
    } else {
      startTimeRef.current = Date.now();
    }
  }, [hasStarted]);

  const handlePause = useCallback(() => {
    setisPlayingProgress(false);
    updateLocalProgress(); // Cập nhật khi pause
  }, [updateLocalProgress]);

  const handleTimeUpdate = useCallback(() => {
    throttledUpdateProgress();
  }, [throttledUpdateProgress]);

  const handleEnded = useCallback(() => {
    setisPlayingProgress(false);

    // Khi video ended, tự động mark là completed
    if (progress?.status !== "completed") {
      console.log("Video ended event - marking as completed");

      const video = videoRef.current;
      if (video) {
        const finalProgressData = {
          completionPercentage: 100,
          watchedDuration: video.duration || 0,
          totalDuration: video.duration || 0,
          lastPosition: video.duration || 0,
          timeSpent: localProgress.timeSpent || 0,
          videoId,
          status: "completed"
        };

        // Cập nhật local
        setLocalProgress(finalProgressData);
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: finalProgressData,
          })
        );

        // Gọi callback
        if (onTimeUpdate) {
          onTimeUpdate(finalProgressData);
        }

        // Save to server
        saveProgressToServer(finalProgressData, "video_ended");
      }
    } else {
      updateLocalProgress();
    }
  }, [updateLocalProgress, progress?.status, videoId, onTimeUpdate, dispatch, localProgress.timeSpent, saveProgressToServer]);

  const handleLoadedMetadata = useCallback(() => {
    // Reset khi load video mới
    if (videoProgress && !videoProgress.totalDuration) {
      const video = videoRef.current;
      if (video && video.duration) {
        const updatedProgress = {
          ...localProgress,
          totalDuration: video.duration,
          lastPosition: videoProgress.lastPosition || 0,
        };

        setLocalProgress(updatedProgress);
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: updatedProgress,
          })
        );

        // Chỉ seek đến vị trí cuối cùng nếu video chưa completed
        if (progress?.status !== "completed" && videoProgress.lastPosition > 0) {
          video.currentTime = videoProgress.lastPosition;
          console.log(`Resuming video at ${videoProgress.lastPosition}s`);
        } else if (progress?.status === "completed") {
          console.log("Video completed - starting from beginning for review");
          video.currentTime = 0;
        }
      }
    }
  }, [dispatch, videoId, videoProgress, videoRef, localProgress, progress?.status]);

  // Setup event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleEnded,
    handleLoadedMetadata,
    videoRef,
  ]);

  // Sync local progress with video progress from store
  useEffect(() => {
    if (videoProgress) {
      setLocalProgress(prev => ({
        ...prev,
        ...videoProgress
      }));
      progressDataRef.current = videoProgress;
    }
  }, [videoProgress]);

  // Handle page unload - Save progress when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentProgressData = calculateProgress();
      if (currentProgressData && progressId && !pendingSaveRef.current) {
        console.log("Page unload - saving progress");
        // Fallback: sync call as last resort
        saveProgressToServer(currentProgressData, "page_unload");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const currentProgressData = calculateProgress();
        if (currentProgressData && progressId) {
          console.log("Page hidden - saving progress");
          saveProgressToServer(currentProgressData, "page_hidden");
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateProgress, progressId, saveProgressToServer]);

  // Cleanup khi unmount - Save final progress
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Save progress when component unmounts
      const currentProgressData = calculateProgress();
      if (currentProgressData && progressId) {
        console.log("Component unmount - saving progress");
        saveProgressToServer(currentProgressData, "component_unmount");
      }
    };
  }, [calculateProgress, progressId, saveProgressToServer]);

  // Public methods
  const resetProgress = useCallback(() => {
    dispatch(resetVideoProgress({ videoId }));
    setHasStarted(false);
    setisPlayingProgress(false);
    setLocalProgress({
      completionPercentage: 0,
      watchedDuration: 0,
      totalDuration: 0,
      lastPosition: 0,
      timeSpent: 0,
      status: "in-progress"
    });
    startTimeRef.current = null;
    progressDataRef.current = null;
    lastUpdateTimeRef.current = 0;
    hasTriggeredCompletion.current = false;
    pendingSaveRef.current = false;

    console.log("Progress reset - cleared all tracking data");
  }, [dispatch, videoId]);

  const forceSync = useCallback(() => {
    const progressData = calculateProgress();
    if (progressData && progressId) {
      return saveProgressToServer(progressData, "manual_sync");
    }
  }, [calculateProgress, progressId, saveProgressToServer]);

  return {
    // State - Sử dụng local progress để UI responsive hơn
    videoProgress: localProgress,
    isLoading,
    error,
    isPlayingProgress,
    hasStarted,

    // Progress info - Từ local state để đồng bộ tốt hơn
    completionPercentage: localProgress.completionPercentage || 0,
    watchedDuration: localProgress.watchedDuration || 0,
    totalDuration: localProgress.totalDuration || 0,
    timeSpent: localProgress.timeSpent || 0,
    lastPosition: localProgress.lastPosition || 0,

    // Milestone info
    sentMilestones,
    progressMilestones,

    // Methods
    resetProgress,
    forceSync,
    updateProgress: updateLocalProgress,
  };
};

export default useVideoProgress;
