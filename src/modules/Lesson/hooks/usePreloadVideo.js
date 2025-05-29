// 1. CUSTOM HOOK ĐỂ PRELOAD QUESTIONS
import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { preloadInteractiveQuestion } from '~/store/slices/ModuleItem/action';

export const useVideoPreloader = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadedVideosRef = useRef(new Set());
  const currentRequestRef = useRef(null);

  const preloadVideo = useCallback(async (videoId, moduleItemId) => {
    // Tạo unique key cho video này
    const videoKey = `${moduleItemId}-${videoId}`;
    
    // Kiểm tra đã load chưa
    if (loadedVideosRef.current.has(videoKey)) {
      console.log("Video already preloaded:", videoKey);
      return;
    }

    // Kiểm tra có request đang chạy không
    if (currentRequestRef.current === videoKey) {
      console.log("Video preload already in progress:", videoKey);
      return;
    }

    if (!videoId || !moduleItemId) {
      console.warn("Missing videoId or moduleItemId");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      currentRequestRef.current = videoKey;

      console.log("Preloading interactive questions for video:", videoId);
      
      const result = await dispatch(preloadInteractiveQuestion({ 
        moduleItemId, 
        videoId 
      })).unwrap();

      // Đánh dấu đã load thành công
      loadedVideosRef.current.add(videoKey);
      console.log("Successfully preloaded video:", videoKey);
      
      return result;

    } catch (err) {
      console.error("Error preloading video:", videoKey, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
      currentRequestRef.current = null;
    }
  }, [dispatch]);

  // Clear cache method
  const clearCache = useCallback(() => {
    loadedVideosRef.current.clear();
    console.log("Video preload cache cleared");
  }, []);

  // Check if video is loaded
  const isVideoLoaded = useCallback((videoId, moduleItemId) => {
    const videoKey = `${moduleItemId}-${videoId}`;
    return loadedVideosRef.current.has(videoKey);
  }, []);

  return {
    preloadVideo,
    clearCache,
    isVideoLoaded,
    loading,
    error
  };
};

// 2. HOOK CHUYÊN DỤNG CHO VIDEO COMPONENT
export const useVideoQuestionPreloader = (lectureId, locationState) => {
  const { preloadVideo, loading, error, isVideoLoaded } = useVideoPreloader();
  const [hasPreloaded, setHasPreloaded] = useState(false);

  useEffect(() => {
    const videoId = lectureId || locationState?.item?.video;
    const moduleItemId = locationState?.item?._id;

    if (videoId && moduleItemId && !hasPreloaded) {
      // Check nếu đã load trong cache
      if (isVideoLoaded(videoId, moduleItemId)) {
        setHasPreloaded(true);
        return;
      }

      // Preload video
      preloadVideo(videoId, moduleItemId)
        .then(() => {
          setHasPreloaded(true);
        })
        .catch(err => {
          console.error("Failed to preload video questions:", err);
          // Có thể retry hoặc show error UI
        });
    }
  }, [lectureId, locationState?.item?.video, locationState?.item?._id, hasPreloaded, preloadVideo, isVideoLoaded]);

  return {
    hasPreloaded,
    loading,
    error,
    setHasPreloaded // Để reset nếu cần
  };
};

// 3. STANDALONE FUNCTION (Không dùng hook)
class VideoPreloader {
  constructor() {
    this.loadedVideos = new Set();
    this.currentRequests = new Map();
  }

  async preloadVideo(dispatch, videoId, moduleItemId) {
    const videoKey = `${moduleItemId}-${videoId}`;
    
    // Kiểm tra đã load
    if (this.loadedVideos.has(videoKey)) {
      console.log("Video already preloaded:", videoKey);
      return Promise.resolve();
    }

    // Kiểm tra request đang chạy
    if (this.currentRequests.has(videoKey)) {
      console.log("Returning existing request for:", videoKey);
      return this.currentRequests.get(videoKey);
    }

    if (!videoId || !moduleItemId) {
      return Promise.reject(new Error("Missing videoId or moduleItemId"));
    }

    // Tạo request mới
    const requestPromise = this._executePreload(dispatch, videoId, moduleItemId, videoKey);
    this.currentRequests.set(videoKey, requestPromise);

    return requestPromise;
  }

  async _executePreload(dispatch, videoId, moduleItemId, videoKey) {
    try {
      console.log("Preloading interactive questions for video:", videoId);
      
      const result = await dispatch(preloadInteractiveQuestion({ 
        moduleItemId, 
        videoId 
      })).unwrap();

      // Đánh dấu thành công
      this.loadedVideos.add(videoKey);
      console.log("Successfully preloaded video:", videoKey);
      
      return result;
    } catch (error) {
      console.error("Error preloading video:", videoKey, error);
      throw error;
    } finally {
      // Cleanup request
      this.currentRequests.delete(videoKey);
    }
  }

  isVideoLoaded(videoId, moduleItemId) {
    const videoKey = `${moduleItemId}-${videoId}`;
    return this.loadedVideos.has(videoKey);
  }

  clearCache() {
    this.loadedVideos.clear();
    this.currentRequests.clear();
    console.log("Video preloader cache cleared");
  }
}

// Singleton instance
export const videoPreloader = new VideoPreloader();

// 4. FUNCTION WRAPPER CHO COMPONENT
export const createVideoPreloader = (dispatch) => {
  const loadedVideos = new Set();
  let currentRequest = null;

  return async (videoId, moduleItemId) => {
    const videoKey = `${moduleItemId}-${videoId}`;
    
    // Đã load rồi
    if (loadedVideos.has(videoKey)) {
      console.log("Video already preloaded:", videoKey);
      return;
    }

    // Đang load
    if (currentRequest === videoKey) {
      console.log("Video preload in progress:", videoKey);
      return;
    }

    if (!videoId || !moduleItemId) {
      console.warn("Missing videoId or moduleItemId");
      return;
    }

    try {
      currentRequest = videoKey;
      console.log("Preloading interactive questions for video:", videoId);
      
      await dispatch(preloadInteractiveQuestion({ moduleItemId, videoId })).unwrap();
      
      loadedVideos.add(videoKey);
      console.log("Successfully preloaded video:", videoKey);
      
    } catch (error) {
      console.error("Error preloading video:", videoKey, error);
      throw error;
    } finally {
      currentRequest = null;
    }
  };
};

// // 5. CÁCH SỬ DỤNG TRONG COMPONENT

// // Cách 1: Sử dụng custom hook (Khuyến nghị)
// function VideoComponent({ lectureId, location }) {
//   const { hasPreloaded, loading, error } = useVideoQuestionPreloader(
//     lectureId, 
//     location.state
//   );

//   if (loading) return <div>Loading questions...</div>;
//   if (error) return <div>Error loading questions: {error.message}</div>;
  
//   return (
//     <div>
//       {hasPreloaded ? "Questions loaded!" : "Loading..."}
//       {/* Video component content */}
//     </div>
//   );
// }

// // Cách 2: Sử dụng với useEffect
// function VideoComponent({ lectureId, location }) {
//   const dispatch = useDispatch();
//   const [hasPreloaded, setHasPreloaded] = useState(false);
//   const preloaderRef = useRef(createVideoPreloader(dispatch));

//   useEffect(() => {
//     if (!hasPreloaded) {
//       const videoId = lectureId || location.state?.item?.video;
//       const moduleItemId = location.state?.item?._id;
      
//       if (videoId && moduleItemId) {
//         preloaderRef.current(videoId, moduleItemId)
//           .then(() => setHasPreloaded(true))
//           .catch(err => console.error("Preload failed:", err));
//       }
//     }
//   }, [hasPreloaded, lectureId, location.state?.item?.video, location.state?.item?._id]);

//   return <div>{/* Component content */}</div>;
// }

// Cách 3: Sử dụng singleton class
// function VideoComponent({ lectureId, location }) {
//   const dispatch = useDispatch();
//   const [hasPreloaded, setHasPreloaded] = useState(false);

//   useEffect(() => {
//     const videoId = lectureId || location.state?.item?.video;
//     const moduleItemId = location.state?.item?._id;
    
//     if (videoId && moduleItemId && !hasPreloaded) {
//       // Check cache trước
//       if (videoPreloader.isVideoLoaded(videoId, moduleItemId)) {
//         setHasPreloaded(true);
//         return;
//       }

//       // Preload
//       videoPreloader.preloadVideo(dispatch, videoId, moduleItemId)
//         .then(() => setHasPreloaded(true))
//         .catch(err => console.error("Preload failed:", err));
//     }
//   }, [dispatch, lectureId, location.state?.item?.video, location.state?.item?._id, hasPreloaded]);

//   return <div>{/* Component content */}</div>;
// }