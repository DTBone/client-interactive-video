
import { useState, useRef, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
/**
 * Enhanced hook for managing video progress with improved analytics
 * @param {Object} options - Hook options
 * @param {React.MutableRefObject} options.videoRef - Reference to video element
 * @param {string|number} options.moduleItemId - Module item ID
 * @param {string|number} options.videoId - Video ID
 * @param {Function} options.onCompleteVideo - Function to mark video as completed
 */
const useVideoProgress = ({
  videoRef,
  moduleItemId,
  videoId,
  onCompleteVideo,
}) => {
  // Basic progress state
  const [progressVideo, setProgressVideo] = useState({
    watchedDuration: 0, // Current position in seconds
    totalDuration: 0, // Total video duration
    lastPosition: 0, // Last watched position
    completionPercentage: 0, // Completion percentage (0-100)
    notes: [], // User notes (if any)
    // Enhanced analytics data
    viewingSessions: [], // Array of viewing session data
    playbackEvents: [], // Track play/pause/seek events
    interactionPoints: [], // Points where user interacted with video
    deviceInfo: { // Device information
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browserInfo: detectBrowserInfo(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    watchPercent: {}, // Percentage watched of each video segment (0-25%, 25-50%, etc.)
    averagePlaybackRate: 1, // Average playback rate
    
    // New analytics fields
    engagementScore: 0, // Score from 0-100 based on interactions and watch percentage
    watchedSegments: [], // Array of segments watched (start/end times)
    attentionMetrics: {
      focusLosses: 0,
      tabSwitches: 0,
      lastFocusTime: Date.now()
    },
    engagementHotspots: {} // Map of video positions with high engagement
  });
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(Date.now());
  const [lastPercentage, setLastPercentage] = useState(0);
  const syncTimeoutRef = useRef(null);
  const syncRetryTimeoutRef = useRef(null);
  const currentSessionStartRef = useRef(Date.now());
  const playbackRatesRef = useRef([]);
  const segmentWatchTimeRef = useRef({
    "0-25": 0,
    "25-50": 0,
    "50-75": 0,
    "75-100": 0
  });
  const lastPositionRef = useRef(0);
  const watchedSegmentsRef = useRef([]);
  const currentSegmentStartRef = useRef(null);
  const continuousWatchTimeRef = useRef(0);
  
  // Detect browser information
  function detectBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edge\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Edge Chromium";
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
      browserName = "Internet Explorer";
      browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
    }
    
    return { name: browserName, version: browserVersion };
  }
  // Track when component mounts and page visibility
  useEffect(() => {
    // Start a new viewing session
    currentSessionStartRef.current = Date.now();
    currentSegmentStartRef.current = null;
    
    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProgressVideo(prev => ({
          ...prev,
          attentionMetrics: {
            ...prev.attentionMetrics,
            tabSwitches: prev.attentionMetrics.tabSwitches + 1,
            lastFocusTime: Date.now()
          }
        }));
        
        // If we were tracking a segment, end it when losing visibility
        if (currentSegmentStartRef.current !== null && videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          watchedSegmentsRef.current.push({
            start: currentSegmentStartRef.current,
            end: currentTime,
            duration: currentTime - currentSegmentStartRef.current
          });
          currentSegmentStartRef.current = null;
        }
      } else {
        // Reset focus time when returning to the page
        setProgressVideo(prev => ({
          ...prev,
          attentionMetrics: {
            ...prev.attentionMetrics,
            lastFocusTime: Date.now()
          }
        }));
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      // On unmount, add the current session to sessions array
      const sessionDuration = Date.now() - currentSessionStartRef.current;
      if (sessionDuration > 1000) {
        // Only track sessions longer than 1 second
        setProgressVideo((prev) => ({
          ...prev,
          viewingSessions: [
            ...prev.viewingSessions,
            {
              startTime: currentSessionStartRef.current,
              endTime: Date.now(),
              duration: sessionDuration,
              date: new Date().toISOString(),
            },
          ],
          watchedSegments: [...watchedSegmentsRef.current]
        }));
      }
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  // Clear timeouts in case of unmounting
  const clearAllTimeouts = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    if (syncRetryTimeoutRef.current) {
      clearTimeout(syncRetryTimeoutRef.current);
    }
  };
  /**
   * Add a playback event to the tracking data
   * @param {string} eventType - Type of event (play, pause, seek)
   * @param {number} position - Current position in video
   */
  const trackPlaybackEvent = useCallback((eventType, position) => {
    setProgressVideo((prev) => ({
      ...prev,
      playbackEvents: [
        ...prev.playbackEvents,
        {
          type: eventType,
          position: position,
          timestamp: Date.now(),
          playbackRate: videoRef.current ? videoRef.current.playbackRate : 1,
        },
      ],
    }));
    // Track playback rate for average calculation
    if (videoRef.current) {
      playbackRatesRef.current.push({
        rate: videoRef.current.playbackRate,
        timestamp: Date.now(),
      });
    }
    
    // When playing, start tracking a new watched segment
    if (eventType === 'play' && currentSegmentStartRef.current === null) {
      currentSegmentStartRef.current = position;
    } 
    // When pausing or seeking, end the current segment if one is being tracked
    else if ((eventType === 'pause' || eventType === 'seek') && currentSegmentStartRef.current !== null) {
      watchedSegmentsRef.current.push({
        start: currentSegmentStartRef.current,
        end: position,
        duration: position - currentSegmentStartRef.current
      });
      
      if (eventType === 'pause') {
        currentSegmentStartRef.current = null;
      } else if (eventType === 'seek') {
        // For seek, start a new segment at the new position
        currentSegmentStartRef.current = position;
      }
    }
  }, [videoRef]);
  /**
   * Track which segments of the video are being watched
   * @param {number} currentTime - Current video position
   * @param {number} duration - Total video duration
   */
  const trackSegmentWatchTime = useCallback((currentTime, duration) => {
    if (!duration) return;
    const currentPercent = Math.floor((currentTime / duration) * 100);
    let segment = "0-25";
    if (currentPercent >= 75) segment = "75-100";
    else if (currentPercent >= 50) segment = "50-75";
    else if (currentPercent >= 25) segment = "25-50";
    // Update time spent in this segment
    segmentWatchTimeRef.current[segment] +=
      currentTime - lastPositionRef.current;
    lastPositionRef.current = currentTime;
    // Calculate continuous watch time (no seeks or pauses)
    if (currentSegmentStartRef.current !== null) {
      continuousWatchTimeRef.current += currentTime - lastPositionRef.current;
    }
    // Update segment watch data in state periodically
    const totalTime = Object.values(segmentWatchTimeRef.current).reduce(
      (a, b) => a + b,
      0
    );
    if (totalTime > 0) {
      const watchPercent = {};
      Object.keys(segmentWatchTimeRef.current).forEach((key) => {
        watchPercent[key] = Math.min(
          100,
          Math.round((segmentWatchTimeRef.current[key] / (duration * 0.25)) * 100)
        );
      });
      setProgressVideo((prev) => ({
        ...prev,
        watchPercent,
      }));
    }
    
    // Update engagement score
    calculateEngagementScore(currentTime, duration);
  }, []);
  /**
   * Calculate user engagement score based on multiple factors
   * @param {number} currentTime - Current video position
   * @param {number} duration - Total video duration 
   */
  const calculateEngagementScore = useCallback((currentTime, duration) => {
    if (!duration) return;
    
    setProgressVideo(prev => {
      // Calculate base factors
      const watchFactors = {
        // How much of the video is watched (0-40 points)
        completion: Math.min(40, Math.floor((currentTime / duration) * 40)),
        
        // How consistently the user watches without interruption (0-20 points)
        continuity: Math.min(20, Math.floor((continuousWatchTimeRef.current / duration) * 20)),
        
        // How much the user interacts with the video (0-20 points)
        interaction: Math.min(20, Math.floor(prev.interactionPoints.length / 3)),
        
        // How often the user changes the playback speed (0-10 points)
        speedAdjustment: Math.min(10, playbackRatesRef.current.length * 2),
        
        // How evenly the user watches all segments (0-10 points)
        coverage: calculateCoverageScore(prev.watchPercent)
      };
      
      // Calculate total engagement score
      const totalScore = Object.values(watchFactors).reduce((sum, val) => sum + val, 0);
      
      // Track engagement hotspots
      const roundedTime = Math.floor(currentTime / 5) * 5;  // Group by 5-second chunks
      const hotspotKey = `t_${roundedTime}`;
      
      const updatedHotspots = {...prev.engagementHotspots};
      updatedHotspots[hotspotKey] = (updatedHotspots[hotspotKey] || 0) + 1;
      
      return {
        ...prev,
        engagementScore: totalScore,
        engagementHotspots: updatedHotspots
      };
    });
  }, []);
  
  /**
   * Calculate how evenly the user has watched all segments of the video
   * @param {Object} watchPercent - Object with segment watch percentages 
   * @returns {number} Coverage score between 0-10
   */
  const calculateCoverageScore = (watchPercent) => {
    if (!watchPercent || Object.keys(watchPercent).length === 0) return 0;
    
    const percentValues = Object.values(watchPercent);
    const avgPercent = percentValues.reduce((sum, val) => sum + val, 0) / percentValues.length;
    
    // Higher score for more evenly distributed watching
    const variance = percentValues.reduce((sum, val) => sum + Math.pow(val - avgPercent, 2), 0) / percentValues.length;
    
    // Lower variance means more even coverage
    return Math.min(10, Math.max(0, 10 - Math.sqrt(variance) / 10));
  };
  /**
   * Calculate average playback rate
   */
  const calculateAveragePlaybackRate = useCallback(() => {
    if (playbackRatesRef.current.length === 0) return 1;
    const sum = playbackRatesRef.current.reduce(
      (acc, item) => acc + item.rate,
      0
    );
    return sum / playbackRatesRef.current.length;
  }, []);
  /**
   * Synchronize progress with server
   * @param {Object} progressData - Progress data to sync
   */
  const syncProgressToServer = useCallback(async (progressData) => {
    if (!videoId || !moduleItemId || progressData.completionPercentage < 1)
      return;
    try {
      // Calculate average playback rate before sending
      const averagePlaybackRate = calculateAveragePlaybackRate();
      // Prepare data summary to reduce payload size
      const analyticsSummary = {
        sessions: {
          count: progressData.viewingSessions?.length || 0,
          totalDuration: progressData.viewingSessions?.reduce((acc, session) => acc + session.duration, 0) || 0,
          lastSessionStart: progressData.viewingSessions?.length > 0 ? 
            progressData.viewingSessions[progressData.viewingSessions.length - 1].startTime : null
        },
        interactions: {
          total: progressData.interactionPoints?.length || 0,
          byType: progressData.interactionPoints?.reduce((acc, point) => {
            acc[point.type] = (acc[point.type] || 0) + 1;
            return acc;
          }, {}) || {}
        },
        playbackEvents: {
          plays: progressData.playbackEvents?.filter(e => e.type === 'play').length || 0,
          pauses: progressData.playbackEvents?.filter(e => e.type === 'pause').length || 0,
          seeks: progressData.playbackEvents?.filter(e => e.type === 'seek').length || 0,
          lastEvent: progressData.playbackEvents?.length > 0 ? 
            progressData.playbackEvents[progressData.playbackEvents.length - 1].type : null
        },
        segments: progressData.watchPercent || {},
        engagementScore: progressData.engagementScore || 0,
        engagement: {
          hotspots: Object.entries(progressData.engagementHotspots || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // Top 5 hotspots
            .map(([time, count]) => ({
              time: time.replace('t_', ''),
              count
            }))
        },
        attention: {
          tabSwitches: progressData.attentionMetrics?.tabSwitches || 0,
          focusLosses: progressData.attentionMetrics?.focusLosses || 0
        },
        watchedSegmentCount: progressData.watchedSegments?.length || 0,
        device: progressData.deviceInfo || {},
        averagePlaybackRate
      };
      // Call API to sync progress with enhanced data
      await onCompleteVideo({
        ...progressData,
        videoId: videoId,
        analyticsSummary,
        sentAt: Date.now()
      });
      // Update time and percentage of last sync
      setLastSyncTimestamp(Date.now());
      setLastPercentage(progressData.completionPercentage);
      console.log("Progress successfully synced to server:", progressData);
    } catch (error) {
      console.error("Error syncing progress:", error);
      // Retry after 1 minute if failed
      if (syncRetryTimeoutRef.current) {
        clearTimeout(syncRetryTimeoutRef.current);
      }
      syncRetryTimeoutRef.current = setTimeout(() => {
        syncProgressToServer(progressData);
      }, 60000);
    }
  }, [videoId, moduleItemId, onCompleteVideo, calculateAveragePlaybackRate]);
  // Debounced version to avoid frequent calls
  const debouncedSyncProgressToServer = debounce((progressData) => {
    syncProgressToServer(progressData);
  }, 1000);
  /**
   * Update video progress with enhanced analytics
   */
  const updateVideoProgress = useCallback(() => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const videoDuration = videoRef.current.duration;
    if (!videoDuration) return;
    // Calculate completion percentage
    const percentage = Math.floor((currentTime / videoDuration) * 100);
    // Track segment watch time
    trackSegmentWatchTime(currentTime, videoDuration);
    // Update progress state with enhanced data
    const updatedProgress = {
      watchedDuration: currentTime,
      totalDuration: videoDuration,
      lastPosition: currentTime,
      completionPercentage: percentage,
      notes: progressVideo?.notes || [],
      viewingSessions: progressVideo?.viewingSessions || [],
      playbackEvents: progressVideo?.playbackEvents || [],
      interactionPoints: progressVideo?.interactionPoints || [],
      deviceInfo: progressVideo?.deviceInfo || {
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browserInfo: detectBrowserInfo(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      watchPercent: progressVideo?.watchPercent || {},
      engagementScore: progressVideo?.engagementScore || 0,
      engagementHotspots: progressVideo?.engagementHotspots || {},
      attentionMetrics: progressVideo?.attentionMetrics || {
        focusLosses: 0,
        tabSwitches: 0,
        lastFocusTime: Date.now()
      },
      watchedSegments: watchedSegmentsRef.current,
      averagePlaybackRate: calculateAveragePlaybackRate(),
    };
    setProgressVideo(updatedProgress);
    // Save progress to localStorage for offline recovery
    localStorage.setItem(
      `video_progress_${videoId}`,
      JSON.stringify({
        percentage,
        currentTime,
        timestamp: Date.now(),
        moduleItemId,
        deviceInfo: updatedProgress.deviceInfo,
        engagementScore: updatedProgress.engagementScore
      })
    );
    // Improved logic for when to send progress updates to server
    const now = Date.now();
    const shouldSync =
      now - lastSyncTimestamp > 60000 || // Only send every 60 seconds instead of 30 seconds
      Math.abs(percentage - lastPercentage) >= 20 || // Major change (20% instead of 10%)
      percentage >= 95 || // Near completion
      percentage === 100; // Video completed
    // Use debounce to avoid too many calls
    if (shouldSync) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        debouncedSyncProgressToServer(updatedProgress);
      }, 1000); // Delay 1 second before sending
    }
  }, [
    videoRef,
    videoId, 
    moduleItemId, 
    progressVideo,
    calculateAveragePlaybackRate,
    trackSegmentWatchTime,
    lastSyncTimestamp,
    lastPercentage,
    debouncedSyncProgressToServer
  ]);
  // Add a method to record user interactions with the video
  const recordInteraction = useCallback((interactionType, data = {}) => {
    setProgressVideo((prev) => {
      // Calculate hotspot for this interaction
      let updatedHotspots = {...prev.engagementHotspots};
      
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const roundedTime = Math.floor(currentTime / 5) * 5;
        const hotspotKey = `t_${roundedTime}`;
        updatedHotspots[hotspotKey] = (updatedHotspots[hotspotKey] || 0) + 2; // Interactions count double
      }
      
      return {
        ...prev,
        interactionPoints: [
          ...prev.interactionPoints,
          {
            type: interactionType, // e.g., "seek", "speed-change", "volume-change", "fullscreen"
            timestamp: Date.now(),
            position: videoRef.current ? videoRef.current.currentTime : 0,
            data: data,
          },
        ],
        engagementHotspots: updatedHotspots
      };
    });
  }, [videoRef]);
  return {
    progressVideo,
    setProgressVideo,
    syncProgressToServer,
    debouncedSyncProgressToServer,
    updateVideoProgress,
    clearAllTimeouts,
    trackPlaybackEvent,
    recordInteraction,
  };
};
export default useVideoProgress;
