import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import {
  updateLocalProgress as updateLocalProgressAction,
  markMilestoneSent,
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
 * OPTIMIZED VIDEO PROGRESS TRACKING HOOK
 * 
 * COMPLETED VIDEO HANDLING:
 * - Khi video đã completed (100%), ngăn chặn mọi progress updates
 * - Preserve completion state (100%, status: "completed") 
 * - Cho phép xem lại từ đầu mà không làm mất trạng thái completed
 * - Không auto-seek về cuối video khi completed để user có thể review
 * 
 * OPTIMIZATION FEATURES:
 * 1. THROTTLE API CALLS: Sử dụng throttle 1s cho timeupdate events
 * 2. MILESTONE-BASED UPDATES: Chỉ gửi API khi đạt mốc 10%, 25%, 50%... 
 * 3. SEPARATED LOGIC: Tách logic local update và server update
 * 4. REF-BASED TRACKING: Sử dụng useRef thay vì state để tránh re-render
 * 5. OPTIMIZED DEPENDENCIES: Loại bỏ dependencies gây loop trong useCallback
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

  // Local state
  const [isPlayingProgress, setisPlayingProgress] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs for tracking and optimization
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastSyncTimeRef = useRef(Date.now());
  const lastUpdateTimeRef = useRef(0);
  const lastMilestoneCheckRef = useRef(0);
  const progressDataRef = useRef(null);

  // Refs to prevent duplicate API calls
  const pendingApiCallsRef = useRef(new Set()); // Track pending API calls
  const lastApiCallTimeRef = useRef({}); // Track last call time for each milestone
  const API_COOLDOWN = 2000; // 2 seconds cooldown between same type calls

  // Hàm tính toán tiến độ - tối ưu dependencies
  const calculateProgress = useCallback(() => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (!duration || duration === 0) return null;

    // Sử dụng ref để lấy timeSpent thay vì dependency
    const currentVideoProgress = progressDataRef.current || videoProgress;
    const timeSpent = currentVideoProgress?.timeSpent || 0;

    let completionPercentage = Math.round((currentTime / duration) * 100);

    // Nếu progress đã completed, luôn giữ ở 100% và lastPosition ở cuối video
    if (progress?.status === "completed") {
      completionPercentage = 100;
      const progressData = {
        completionPercentage: 100,
        watchedDuration: duration, // Full duration khi completed
        totalDuration: duration,
        lastPosition: duration, // Vị trí cuối video
        timeSpent,
        videoId,
        status: "completed"
      };

      // Cache progress data
      progressDataRef.current = progressData;
      return progressData;
    }

    const progressData = {
      completionPercentage,
      watchedDuration: currentTime,
      totalDuration: duration,
      lastPosition: currentTime,
      timeSpent,
      videoId,
    };

    // Cache progress data
    progressDataRef.current = progressData;
    return progressData;
  }, [videoId]); // Chỉ dependency cần thiết


  // Load all module item statuses
  const moduleProgress = useSelector(
    (state) => state.module.currentModule?.data?.progress
  );

  const loadAllModuleItemStatuses = useCallback(async () => {
    // Helper function để delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Chờ 100ms trước khi bắt đầu
    await delay(2000);

    // Kiểm tra data trước khi thực hiện
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

      // Chờ tất cả items load xong
      const results = await Promise.all(statusPromises);
      console.log('All items processed:', results.filter(Boolean));

      // Load progress một lần cuối
      await dispatch(getProgress({ courseId: course._id }));
      console.log('Progress updated');
      console.log("moduleProgress useVideoProgress", moduleProgress);

    } catch (error) {
      console.error('Error in loadAllModuleItemStatuses:', error);
    }
  }, [dispatch, module, course, moduleProgress]);// dependencies

  // Debounced function để cập nhật local progress - tăng delay
  const debouncedLocalUpdate = useCallback(
    debounce((progressData) => {
      if (progressData) {
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: progressData,
          })
        );
        loadAllModuleItemStatuses();
      }
    }, 2000), // Tăng từ 500ms lên 1000ms
    [dispatch, videoId]
  );

  // Hàm gửi milestone lên server - tối ưu dependencies
  const sendMilestoneUpdate = useCallback(
    async (progressData, milestone) => {
      // Kiểm tra progressId hợp lệ
      if (!progressId) {
        console.warn("progressId is not available, skipping update");
        return;
      }

      // Tạo unique key cho API call
      const callKey = `${videoId}-${milestone}`;
      const now = Date.now();

      // Kiểm tra nếu đang có pending call cho milestone này
      if (pendingApiCallsRef.current.has(callKey)) {
        console.log(`API call for ${milestone} already pending, skipping`);
        return;
      }

      // Kiểm tra cooldown period (trừ first-time milestones)
      const allowedRepeatedUpdates = ["periodic", "position", "started"];
      const lastCallTime = lastApiCallTimeRef.current[callKey] || 0;

      if (allowedRepeatedUpdates.includes(milestone) && now - lastCallTime < API_COOLDOWN) {
        console.log(`Cooldown period active for ${milestone}, skipping (${now - lastCallTime}ms ago)`);
        return;
      }

      // Cho phép các loại update đặc biệt luôn được gửi
      const currentSentMilestones = sentMilestones;

      // Kiểm tra milestone đã gửi (chỉ cho milestones phần trăm)
      if (!allowedRepeatedUpdates.includes(milestone) && currentSentMilestones.includes(milestone)) {
        console.log(`Milestone ${milestone}% already sent, skipping`);
        return;
      }

      // Đánh dấu API call đang pending
      pendingApiCallsRef.current.add(callKey);
      lastApiCallTimeRef.current[callKey] = now;

      try {
        console.log(`Sending milestone update: ${milestone}`, {
          progressId,
          progressData,
        });

        await dispatch(
          updateVideoProgress({
            progressId,
            progressVideo: {
              ...progressData,
              milestone, // Đánh dấu milestone này
              updatedAt: now,
            },
          })
        ).unwrap();

        // Đánh dấu milestone đã gửi (chỉ cho milestones phần trăm, không cho periodic)
        if (!allowedRepeatedUpdates.includes(milestone)) {
          dispatch(markMilestoneSent({ videoId, milestone }));
        }
        if (milestone === 100 && onQuizSubmit) {
          console.log("Video completed, triggering onQuizSubmit");
          onQuizSubmit(true);
        }
        console.log(
          `Milestone ${milestone}% sent successfully for video ${videoId}`
        );
        loadAllModuleItemStatuses();
      } catch (error) {
        console.error(`Failed to send milestone ${milestone}%:`, error);
      } finally {
        // Xóa pending call
        pendingApiCallsRef.current.delete(callKey);
      }
    },
    [dispatch, progressId, videoId, sentMilestones, API_COOLDOWN]
  );

  // Logic kiểm tra và gửi milestones - tách riêng
  const checkAndSendMilestones = useCallback((progressData) => {
    // Ngăn chặn gửi milestone nếu progress đã completed (trừ khi đang complete lần đầu)
    if (progress?.status === "completed" && progressData.completionPercentage !== 100) {
      console.log("Video already completed, skipping milestone updates");
      return;
    }

    const currentPercentage = progressData.completionPercentage;

    // Gửi update ban đầu khi vừa bắt đầu xem (0-5% đầu tiên)
    if (currentPercentage > 0 && currentPercentage <= 5 && hasStarted && !sentMilestones.includes("started")) {
      console.log("Sending initial video start update");
      sendMilestoneUpdate(progressData, "started");
    }

    // Kiểm tra milestone theo phần trăm - chỉ gửi khi đạt mốc 10%, 25%, 50%...
    const milestoneToSend = progressMilestones?.find(
      (milestone) =>
        currentPercentage >= milestone && !sentMilestones.includes(milestone)
    );

    if (milestoneToSend) {
      console.log(`Sending milestone update: ${milestoneToSend}%`);
      sendMilestoneUpdate(progressData, milestoneToSend);
    }

    // Gửi update định kỳ mỗi 60 giây khi đang phát (tăng từ 30s lên 60s để giảm tần suất hơn nữa)
    const now = Date.now();
    if (isPlayingProgress && now - lastSyncTimeRef.current >= 60000) {
      console.log("Sending periodic update");
      sendMilestoneUpdate(progressData, "periodic");
      lastSyncTimeRef.current = now;
    }

    // Gửi update mỗi khi currentTime thay đổi đáng kể (mỗi 120 giây video thay vì 60s)
    const currentVideoProgress = progressDataRef.current;
    const lastReportedTime = currentVideoProgress?.lastPosition || 0;
    if (Math.abs(progressData.lastPosition - lastReportedTime) >= 120) {
      console.log("Sending position update due to significant time change");
      sendMilestoneUpdate(progressData, "position");
    }
  }, [hasStarted, isPlayingProgress, progressMilestones, sentMilestones, sendMilestoneUpdate]);

  // Hàm cập nhật local progress - tách riêng khỏi server logic
  const updateLocalProgress = useCallback(() => {
    // Kiểm tra xem progress đã completed chưa - nếu rồi thì không cập nhật gì thêm
    if (progress?.status === "completed") {
      console.log("Video already completed, skipping progress updates");
      return;
    }

    const now = Date.now();

    // Chỉ cập nhật local mỗi 2 giây để giảm tần suất hơn nữa
    if (now - lastUpdateTimeRef.current < 2000) return;
    lastUpdateTimeRef.current = now;

    const progressData = calculateProgress();
    if (!progressData) return;

    // Nếu video đã đạt 100% HOẶC gần hết (95%+) và progress hiện tại chưa completed, đánh dấu completed
    // Điều này xử lý trường hợp video có thể không load được 100% do buffering
    const isNearlyComplete = progressData.completionPercentage >= 95;
    const isAtEnd = Math.abs(progressData.lastPosition - progressData.totalDuration) <= 1; // trong vòng 1 giây cuối

    if ((progressData.completionPercentage >= 100 || isNearlyComplete || isAtEnd) && progress?.status !== "completed") {
      progressData.completionPercentage = 100; // Đảm bảo exactly 100%
      console.log(`Video reached completion (${progressData.completionPercentage >= 100 ? '100%' : 'nearly complete at ' + progressData.completionPercentage + '%'}), marking as completed`);

      // Cập nhật local với trạng thái completed
      debouncedLocalUpdate({
        ...progressData,
        completionPercentage: 100,
        watchedDuration: progressData.totalDuration, // Full duration
        lastPosition: progressData.totalDuration, // End position
        status: "completed"
      });

      // Gọi callback với completed status
      if (onTimeUpdate) {
        onTimeUpdate({
          ...progressData,
          completionPercentage: 100,
          watchedDuration: progressData.totalDuration,
          lastPosition: progressData.totalDuration,
          status: "completed"
        });
      }
      // THÊM: Trigger onQuizSubmit khi video hoàn thành
      if (onQuizSubmit) {
        console.log("Video locally completed, triggering onQuizSubmit");
        onQuizSubmit(true);
      }
      // Gửi milestone 100% cuối cùng
      checkAndSendMilestones(progressData);
      return;
    }

    // Cập nhật thời gian đã xem nếu video đang phát
    if (isPlayingProgress && startTimeRef.current) {
      const timeSpentInThisSession = Math.floor(
        (now - startTimeRef.current) / 1000
      );
      const currentVideoProgress = progressDataRef.current || videoProgress;
      progressData.timeSpent =
        (currentVideoProgress?.timeSpent || 0) + timeSpentInThisSession;
      startTimeRef.current = now;
    }

    // Cập nhật local state với debounce
    debouncedLocalUpdate(progressData);

    // Gọi callback để đồng bộ với component cha
    if (onTimeUpdate) {
      onTimeUpdate(progressData);
    }

    // Kiểm tra milestone mỗi 10 giây để giảm tần suất kiểm tra hơn nữa
    if (now - lastMilestoneCheckRef.current >= 10000) {
      checkAndSendMilestones(progressData);
      lastMilestoneCheckRef.current = now;
    }
  }, []); // Loại bỏ tất cả dependencies gây loop

  // Throttled function để cập nhật progress - tăng interval
  const throttledUpdateProgress = useCallback(
    throttle(() => {
      updateLocalProgress();
    }, 2000), // Tăng từ 1000ms lên 2000ms - chỉ chạy tối đa 1 lần/2 giây
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

    // Khi video ended, tự động mark là completed bất kể percentage hiện tại
    // Điều này xử lý trường hợp duration không chính xác hoặc video buffer issues
    if (progress?.status !== "completed") {
      console.log("Video ended event - marking as completed");

      const video = videoRef.current;
      if (video) {
        const finalProgressData = {
          completionPercentage: 100,
          watchedDuration: video.duration || 0,
          totalDuration: video.duration || 0,
          lastPosition: video.duration || 0,
          timeSpent: (progressDataRef.current?.timeSpent || 0),
          videoId,
          status: "completed"
        };

        // Cập nhật local với trạng thái completed
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: finalProgressData,
          })
        );

        // Gọi callback với completed status
        if (onTimeUpdate) {
          onTimeUpdate(finalProgressData);
        }
        // THÊM: Trigger onQuizSubmit khi video ended
        if (onQuizSubmit) {
          console.log("Video ended, triggering onQuizSubmit");
          onQuizSubmit(true);
        }
        // Gửi milestone 100% cuối cùng
        if (progressId) {
          sendMilestoneUpdate(finalProgressData, 100);
        }
      }
    } else {
      // Nếu đã completed rồi, chỉ cần update local progress
      updateLocalProgress();
    }
  }, [updateLocalProgress, progress?.status, videoId, onTimeUpdate, dispatch, progressId, sendMilestoneUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    // Reset khi load video mới
    if (videoProgress && !videoProgress.totalDuration) {
      const video = videoRef.current;
      if (video && video.duration) {
        dispatch(
          updateLocalProgressAction({
            videoId,
            progress: {
              totalDuration: video.duration,
              lastPosition: videoProgress.lastPosition || 0,
            },
          })
        );

        // Chỉ seek đến vị trí cuối cùng nếu video chưa completed và có lastPosition
        // Nếu đã completed, để user tự chọn xem từ đầu hay tiếp tục
        if (progress?.status !== "completed" && videoProgress.lastPosition > 0) {
          video.currentTime = videoProgress.lastPosition;
          console.log(`Resuming video at ${videoProgress.lastPosition}s`);
        } else if (progress?.status === "completed") {
          console.log("Video completed - starting from beginning for review");
          video.currentTime = 0; // Bắt đầu từ đầu khi xem lại video completed
        }
      }
    }
  }, [dispatch, videoId, videoProgress, videoRef]);

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

  // Sync progressDataRef with videoProgress
  useEffect(() => {
    if (videoProgress) {
      progressDataRef.current = videoProgress;
    }
  }, [videoProgress]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Gửi update cuối cùng khi component unmount
      if (isPlayingProgress) {
        updateLocalProgress();
      }
    };
  }, [isPlayingProgress, updateLocalProgress]);

  // Public methods
  const resetProgress = useCallback(() => {
    dispatch(resetVideoProgress({ videoId }));
    setHasStarted(false);
    setisPlayingProgress(false);
    startTimeRef.current = null;
    progressDataRef.current = null;
    lastUpdateTimeRef.current = 0;
    lastMilestoneCheckRef.current = 0;

    // Clear API call tracking
    pendingApiCallsRef.current.clear();
    lastApiCallTimeRef.current = {};
    lastSyncTimeRef.current = Date.now();

    console.log("Progress reset - cleared all tracking data");
  }, [dispatch, videoId]);

  const forceSync = useCallback(() => {
    const progressData = calculateProgress();
    if (progressData && progressId) {
      return sendMilestoneUpdate(progressData, "manual");
    }
  }, [calculateProgress, progressId, sendMilestoneUpdate]);

  return {
    // State
    videoProgress,
    isLoading,
    error,
    isPlayingProgress,
    hasStarted,

    // Progress info
    completionPercentage: videoProgress?.completionPercentage || 0,
    watchedDuration: videoProgress?.watchedDuration || 0,
    totalDuration: videoProgress?.totalDuration || 0,
    timeSpent: videoProgress?.timeSpent || 0,
    lastPosition: videoProgress?.lastPosition || 0,

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
