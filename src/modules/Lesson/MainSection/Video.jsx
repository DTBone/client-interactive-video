import { useRef, useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { VolumeUp, VolumeDown, VolumeMute, PlayArrow, Pause, Fullscreen, FullscreenExit, Speed } from "@mui/icons-material";
import { Slider, IconButton, Typography, Menu, MenuItem, Tooltip } from "@mui/material";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { createNewInteractiveQuestion } from "~/store/slices/ModuleItem/action";
import useNetworkStatus from "../../../hooks/useNetworkStatus";
import InteractiveQuestionDialog from "../Components/InteractiveQuestionDialog";
import SnackbarAlert from "../Components/SnackbarAlert";
import useVideoProgress from "../hooks/useVideoProgress";

/**
 * Custom hook để quản lý logic câu hỏi trong video
 */
const useVideoQuestions = (questions, progress, videoRef, recordInteraction) => {
  const dispatch = useDispatch();
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [dialogAlert, setDialogAlert] = useState("");
  const [lastAllowedTime, setLastAllowedTime] = useState(
    progress?.status === "completed" ? Infinity : progress?.result?.video?.lastPosition || 0
  );
  
  const currQuestion = useSelector((state) => state.moduleItem.currentQuestion);
  const loading = useSelector((state) => state.moduleItem.loading);
  
  // Update current question when changed in Redux
  useEffect(() => {
    if (currQuestion) {
      setCurrentQuestion(currQuestion);
    }
  }, [currQuestion]);
  
  // Check for questions to display
  const checkForQuestions = useCallback((currentTime) => {
    if (!questions || questions.length === 0 || progress?.status === "completed") return;
    
    const question = questions.find((q) => {
      const timeDiff = Math.abs(q.startTime - currentTime);
      return timeDiff < 0.5 && !answeredQuestions.has(q.startTime);
    });
    
    if (question) {
      videoRef.current.pause();
      setCurrentQuestion(question);
      setOpenQuestionDialog(true);
      
      recordInteraction("question-shown", {
        questionId: question._id,
        position: currentTime,
        timestamp: Date.now()
      });
    }
  }, [questions, answeredQuestions, progress, videoRef, recordInteraction]);
  
  // Prevent seeking past unanswered questions
  const enforceQuestionBoundary = useCallback((currentTime) => {
    if (currentTime > lastAllowedTime && videoRef.current) {
      videoRef.current.currentTime = lastAllowedTime;
    }
  }, [lastAllowedTime, videoRef]);
  
  // Get the next question time for boundary enforcement
  const getNextQuestionTime = useCallback(() => {
    if (!questions || !currentQuestion) return null;
    
    const nextQuestion = questions.find(q => 
      q.startTime > currentQuestion.startTime && 
      !answeredQuestions.has(q.startTime)
    );
    
    return nextQuestion ? nextQuestion.startTime : null;
  }, [questions, currentQuestion, answeredQuestions]);
  
  // Handle dialog close
  const handleCloseDialog = useCallback(() => {
    setOpenQuestionDialog(false);
    setDialogAlert("");
  }, []);
  
  // Handle answering questions
  const handleAnswerSubmit = useCallback(() => {
  // Validate answer selection
    if (!selectedAnswer || selectedAnswer.length === 0) {
      setDialogAlert({
        type: "error",
        message: "Please select at least one answer"
      });
      return;
    }
    
  // Check if answer is correct
    const correctAnswers = currentQuestion.answers
      .filter(answer => answer.isCorrect)
      .map(answer => answer._id);
    
    let isCorrect = false;
    
    if (currentQuestion.type === "multiple") {
      isCorrect = 
        correctAnswers.length === selectedAnswer.length &&
        correctAnswers.every(id => selectedAnswer.includes(id));
    } else {
      isCorrect = correctAnswers.includes(selectedAnswer[0]);
    }
    
    // Record interaction
    recordInteraction("question-answered", {
      questionId: currentQuestion._id,
      answers: selectedAnswer,
      isCorrect,
      timestamp: Date.now()
    });
    
    if (isCorrect) {
      // Mark question as answered
      setAnsweredQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion.startTime);
        return newSet;
      });
      
      // Update allowed viewing time
      const nextQuestionTime = getNextQuestionTime();
      setLastAllowedTime(nextQuestionTime !== null ? nextQuestionTime : Infinity);
      
      setDialogAlert({
        type: "success",
        message: "Correct! You can continue watching the video"
      });
      
      // Close dialog after delay
      setTimeout(() => {
        setOpenQuestionDialog(false);
        setDialogAlert("");
      }, 1500);    } else {
      // Create a new question if incorrect (if needed)
      dispatch(createNewInteractiveQuestion({ questionId: currentQuestion._id }));
      
      setDialogAlert({
        type: "error", 
        message: "Your answer is incorrect. Please try again!"
      });
    }
  }, [currentQuestion, selectedAnswer, dispatch, getNextQuestionTime, recordInteraction]);
  
  // Answer selection handlers
  const handleMultipleChoiceChange = useCallback((answerId) => {
    setSelectedAnswer(prev => {
      if (prev.includes(answerId)) {
        return prev.filter((id) => id !== answerId);
      } else {
        return [...prev, answerId];
      }
    });
  }, []);
  
  const handleSingleChoiceChange = useCallback((event) => {
    setSelectedAnswer([event.target.value]);
  }, []);
  
  return {
    openQuestionDialog,
    currentQuestion,
    selectedAnswer,
    answeredQuestions,
    dialogAlert,
    loading,
    lastAllowedTime,
    checkForQuestions,
    enforceQuestionBoundary,
    handleAnswerSubmit,
    handleCloseDialog,
    handleMultipleChoiceChange,
    handleSingleChoiceChange
  };
};

/**
 * Custom hook để quản lý controls của video
 */
const useVideoControls = (videoRef, recordInteraction) => {
  const isOnline = useNetworkStatus();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState(null);
  const [buffered, setBuffered] = useState([]);
  const controlsTimeoutRef = useRef(null);
  
  // Time formatting helper
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);
  
  // Volume control
  const handleVolumeChange = useCallback((_, newValue) => {
    const volumeValue = newValue / 100;
    setVolume(volumeValue);
    videoRef.current.volume = volumeValue;
    
    recordInteraction("volume-change", {
      from: videoRef.current.volume,
      to: volumeValue,
      position: videoRef.current.currentTime
    });
  }, [videoRef, recordInteraction]);
  
  const handleMuteToggle = useCallback(() => {
    if (volume === 0) {
      setVolume(previousVolume || 1);
      videoRef.current.volume = previousVolume || 1;
      
      recordInteraction("unmute", {
        to: previousVolume || 1,
        position: videoRef.current.currentTime
      });
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      videoRef.current.volume = 0;
      
      recordInteraction("mute", {
        from: volume,
        position: videoRef.current.currentTime
      });
    }
  }, [volume, previousVolume, videoRef, recordInteraction]);
  
  // Playback controls
  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => console.error("Error playing video:", err));
      setIsPlaying(true);
      
      recordInteraction("play", {
        position: video.currentTime
      });
    } else {
      video.pause();
      setIsPlaying(false);
      
      recordInteraction("pause", {
        position: video.currentTime
      });
    }
  }, [videoRef, recordInteraction]);
  
  // Seeking
  const handleTimeSeek = useCallback((_, newValue) => {
    if (!videoRef.current || !duration) return;
    
    const seekTime = (newValue * duration) / 100;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    
    recordInteraction("seek", {
      from: currentTime,
      to: seekTime
    });
  }, [videoRef, duration, currentTime, recordInteraction]);
  
  // Fullscreen
  const handleFullscreenToggle = useCallback(() => {
    const videoContainer = videoRef.current.parentElement;
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      recordInteraction("fullscreen", { 
        state: "entered",
        position: videoRef.current.currentTime
      });
    } else {
      document.exitFullscreen();
      recordInteraction("fullscreen", { 
        state: "exited",
        position: videoRef.current.currentTime
      });
    }
  }, [videoRef, recordInteraction]);
  
  // Playback speed
  const handleSpeedMenuOpen = useCallback((event) => {
    setSpeedMenuAnchorEl(event.currentTarget);
  }, []);
  
  const handleSpeedMenuClose = useCallback(() => {
    setSpeedMenuAnchorEl(null);
  }, []);
  
  const handleSpeedChange = useCallback((speed) => {
    const previousSpeed = videoRef.current.playbackRate;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    handleSpeedMenuClose();
    
    recordInteraction("speed-change", {
      from: previousSpeed,
      to: speed,
      position: videoRef.current.currentTime
    });
  }, [videoRef, handleSpeedMenuClose, recordInteraction]);
  
  // Buffer progress
  const updateBufferProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const timeRanges = [];
    for (let i = 0; i < video.buffered.length; i++) {
      timeRanges.push({
        start: video.buffered.start(i),
        end: video.buffered.end(i),
      });
    }
    setBuffered(timeRanges);
  }, [videoRef]);
  
  // Volume icon
  const getVolumeIcon = useCallback(() => {
    if (volume === 0) return <VolumeMute />;
    if (volume < 0.5) return <VolumeDown />;
    return <VolumeUp />;
  }, [volume]);
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    showControls,
    isFullscreen,
    playbackSpeed,
    speedMenuAnchorEl,
    buffered,
    isOnline,
    formatTime,
    getVolumeIcon,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setShowControls,
    setIsFullscreen,
    handleVolumeChange,
    handleMuteToggle,
    handlePlayPause,
    handleTimeSeek,
    handleFullscreenToggle,
    handleSpeedMenuOpen,
    handleSpeedMenuClose,
    handleSpeedChange,
    updateBufferProgress,
  };
};

/**
 * Custom hook để quản lý trạng thái loading của video
 */
const useVideoLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  return {
    isLoading,
    isBuffering,
    setIsLoading,
    setIsBuffering,
  };
};

// Component để hiển thị trạng thái loading của video
const VideoLoadingState = ({ isLoading, isBuffering }) => {
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000"
          }}
        >
          <CircularProgress size={68} sx={{ color: "primary.main" }} />
        </Box>
      )}
      
      {isBuffering && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10
          }}
        >
          <CircularProgress size={48} sx={{ color: "primary.main" }} />
        </Box>
      )}
    </>
  );
};

VideoLoadingState.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isBuffering: PropTypes.bool.isRequired
};

// Component hiển thị markers câu hỏi trên timeline
const VideoQuestionMarkers = ({ questions, answeredQuestions, duration }) => {
  if (!questions || !duration) return null;
  
  return (
    <>
      {questions.map((q) => (
        <Box
          key={q._id}
          sx={{
            position: "absolute",
            left: `${(q.startTime / duration) * 100}%`,
            width: 3,
            height: 12,
            backgroundColor: answeredQuestions.has(q.startTime)
              ? "success.main"
              : "warning.main",
            bottom: 5,
            transform: "translateX(-50%)",
            zIndex: 1,
            borderRadius: 1,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

VideoQuestionMarkers.propTypes = {
  questions: PropTypes.array.isRequired,
  answeredQuestions: PropTypes.instanceOf(Set).isRequired,
  duration: PropTypes.number.isRequired
};

// Component điều khiển video
const VideoControls = ({
  showControls,
  isPlaying,
  handlePlayPause,
  getVolumeIcon,
  volume,
  handleVolumeChange,
  handleMuteToggle,
  currentTime,
  duration,
  formatTime,
  handleSpeedMenuOpen,
  playbackSpeed,
  speedMenuAnchorEl,
  handleSpeedMenuClose,
  handleSpeedChange,
  handleFullscreenToggle,
  isFullscreen,
  buffered,
  questions,
  answeredQuestions,
  handleTimeSeek,
  isOnline
}) => {
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
        transition: "opacity 0.3s ease",
        opacity: showControls ? 1 : 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        zIndex: 10,
      }}
    >
      {/* Timeline with buffer and question markers */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2, mb: 1 }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", position: "relative" }}>
          {/* Buffer indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {buffered.map((range, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  left: `${(range.start / duration) * 100}%`,
                  width: `${((range.end - range.start) / duration) * 100}%`,
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
          
          {/* Question markers */}
          <VideoQuestionMarkers 
            questions={questions}
            answeredQuestions={answeredQuestions}
            duration={duration}
          />
          
          {/* Time slider */}
          <Slider
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleTimeSeek}
            sx={{
              color: "primary.main",
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                display: showControls ? 'block' : 'none',
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&::before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px rgb(255 255 255 / 16%)`,
                },
                '&.Mui-active': {
                  width: 16,
                  height: 16,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
        </Box>
      </Box>

      {/* Controls row */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
        {/* Left controls: play/pause */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handlePlayPause}
            size="medium"
            sx={{ color: "white" }}
            disabled={!isOnline}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          
          {/* Time display */}
          <Typography variant="body2" sx={{ color: "white" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>

        {/* Center: Volume */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "30%" }}>
          <IconButton onClick={handleMuteToggle} size="small" sx={{ color: "white" }}>
            {getVolumeIcon()}
          </IconButton>
          <Slider
            value={volume * 100}
            onChange={handleVolumeChange}
            size="small"
            sx={{
              color: "primary.main",
              width: "100%",
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
        </Box>

        {/* Right controls: Speed, Fullscreen */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Playback Speed */}
          <Tooltip title="Playback speed">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={handleSpeedMenuOpen}
                size="small"
                sx={{ color: "white" }}
              >
                <Speed />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white", ml: 0.5 }}>
                {playbackSpeed}x
              </Typography>
            </Box>
          </Tooltip>
          <Menu
            anchorEl={speedMenuAnchorEl}
            open={Boolean(speedMenuAnchorEl)}
            onClose={handleSpeedMenuClose}
          >
            {speedOptions.map((speed) => (
              <MenuItem
                key={speed}
                selected={speed === playbackSpeed}
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}x
              </MenuItem>
            ))}
          </Menu>

          {/* Fullscreen */}
          <IconButton
            onClick={handleFullscreenToggle}
            size="small"
            sx={{ color: "white" }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

VideoControls.propTypes = {
  showControls: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  getVolumeIcon: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  handleVolumeChange: PropTypes.func.isRequired,
  handleMuteToggle: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  handleSpeedMenuOpen: PropTypes.func.isRequired,
  playbackSpeed: PropTypes.number.isRequired,
  speedMenuAnchorEl: PropTypes.object,
  handleSpeedMenuClose: PropTypes.func.isRequired,
  handleSpeedChange: PropTypes.func.isRequired,
  handleFullscreenToggle: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  buffered: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  answeredQuestions: PropTypes.instanceOf(Set).isRequired,
  handleTimeSeek: PropTypes.func.isRequired,
  isOnline: PropTypes.bool.isRequired,
};

const Video = ({
  src,
  questions = [],
  isComplete,
  onCompleteVideo,
  moduleItemId,
  videoId,
}) => {
  // Refs
  const videoRef = useRef(null);
  
  // Selectors
  const progress = useSelector((state) => {
    if (!state.progress?.progress) return {};
    return state.progress.progress.moduleItemProgresses?.find(
      (p) => p.moduleItemId === moduleItemId
    ) || {};
  });
    // Sử dụng custom hooks
  const {
    isLoading, 
    isBuffering, 
    setIsLoading, 
    setIsBuffering
  } = useVideoLoading();

  // Progress tracking & synchronizing
  const {
    syncProgressToServer, 
    progressVideo, 
    setProgressVideo, 
    updateVideoProgress,
    trackPlaybackEvent,
    recordInteraction
  } = useVideoProgress({
    videoRef,
    moduleItemId, 
    videoId, 
    onCompleteVideo
  });
  
  // Question state
  const [complete, setComplete] = useState(progress?.status === "completed" || isComplete);
  const [alert, setAlert] = useState("");
  
  const {
    openQuestionDialog,
    currentQuestion,
    selectedAnswer,
    answeredQuestions,
    dialogAlert,
    loading,
    lastAllowedTime,
    checkForQuestions,
    enforceQuestionBoundary,
    handleAnswerSubmit,
    handleCloseDialog,
    handleMultipleChoiceChange,
    handleSingleChoiceChange
  } = useVideoQuestions(questions, progress, videoRef, recordInteraction);
    // const {
  //   isPlaying: controlsIsPlaying,
  //   currentTime: controlsCurrentTime,
  //   duration: controlsDuration,
  //   volume: controlsVolume,
  //   showControls: controlsShowControls,
  //   isFullscreen: controlsIsFullscreen,
  //   playbackSpeed: controlsPlaybackSpeed,
  //   speedMenuAnchorEl: controlsSpeedMenuAnchorEl,
  //   buffered: controlsBuffered,
  //   isOnline: controlsIsOnline,
  //   formatTime: controlsFormatTime,
  //   getVolumeIcon: controlsGetVolumeIcon,
  //   setCurrentTime: controlsSetCurrentTime,
  //   setDuration: controlsSetDuration,
  //   setIsPlaying: controlsSetIsPlaying,
  //   setShowControls: controlsSetShowControls,
  //   setIsFullscreen: controlsSetIsFullscreen,
  //   handleVolumeChange: controlsHandleVolumeChange,
  //   handleMuteToggle: controlsHandleMuteToggle,
  //   handlePlayPause: controlsHandlePlayPause,
  //   handleTimeSeek: controlsHandleTimeSeek,
  //   handleFullscreenToggle: controlsHandleFullscreenToggle,
  //   handleSpeedMenuOpen: controlsHandleSpeedMenuOpen,
  //   handleSpeedMenuClose: controlsHandleSpeedMenuClose,
  //   handleSpeedChange: controlsHandleSpeedChange,
  //   updateBufferProgress: controlsUpdateBufferProgress,
  // } = useVideoControls(videoRef, recordInteraction);
  const isOnline = useNetworkStatus();

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Video settings
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState(null);
  const controlsTimeoutRef = useRef(null);

  // Cần thiết để cập nhật buffer
  const updateBufferProgress = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const timeRanges = [];
    for (let i = 0; i < video.buffered.length; i++) {
      timeRanges.push({
        start: video.buffered.start(i),
        end: video.buffered.end(i),
      });
    }
    setBuffered(timeRanges);
  };
    // Update current time and check for questions
  useEffect(() => {
    if (progress?.status !== "completed") {
      checkForQuestions(currentTime);
      enforceQuestionBoundary(currentTime);
      updateVideoProgress(); 
    }
  }, [currentTime, progress?.status, checkForQuestions, enforceQuestionBoundary, updateVideoProgress]);
  
  // Main video effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (progress?.status === "in-progress") {
      video.currentTime = progress.result.video.lastPosition || 0;
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      
      // Record video loaded interaction
      recordInteraction("video-loaded", {
        duration: video.duration,
        timestamp: Date.now()
      });
    };
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Auto-complete at 80% of video
      if (video.currentTime >= video.duration * 0.8 && !complete) {
        setComplete(true);
        setProgressVideo(prev => ({
          ...prev,
          completionPercentage: 100,
        }));
        onCompleteVideo({
          ...progressVideo,
          completionPercentage: 100,
          lastPosition: video.duration,
          watchedDuration: video.duration,
        });
        
        // Record completion
        recordInteraction("completion", {
          actualPercentage: Math.floor((video.currentTime / video.duration) * 100),
          timestamp: Date.now()
        });
      }
      
      updateBufferProgress();
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    const handleWaiting = () => {
      setIsBuffering(true);
      recordInteraction("buffering-start", {
        position: video.currentTime,
        timestamp: Date.now()
      });
    };
    const handlePlaying = () => {
      setIsBuffering(false);
      recordInteraction("buffering-end", {
        position: video.currentTime,
        timestamp: Date.now()
      });
    };
  const handleProgress = () => {
      updateBufferProgress();
    };
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    // Track play/pause events
    const handlePlay = () => {
      trackPlaybackEvent("play", video.currentTime);
    };
    
    const handlePause = () => {
      trackPlaybackEvent("pause", video.currentTime);
    };
    // Add event listeners
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    // Cleanup
    return () => {
      if (!video) return; 
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      
      clearTimeout(controlsTimeoutRef.current);
      // Track final session data before unmount
      recordInteraction("session-end", {
        position: video.currentTime,
        duration: video.duration,
        percentageWatched: Math.floor((video.currentTime / video.duration) * 100)
      });
      // Sync final progress
      if (progressVideo.completionPercentage > 10) {
        syncProgressToServer(progressVideo);
      }
    };  }, [
    questions, 
    answeredQuestions, 
    complete, 
    isComplete, 
    onCompleteVideo, 
    progress?.status, 
    progress?.result?.video?.lastPosition,
    duration,
    progressVideo,
    videoId, 
    moduleItemId,
    isPlaying,
    checkForQuestions,
    enforceQuestionBoundary,
    updateVideoProgress,
    recordInteraction,
    syncProgressToServer,
    trackPlaybackEvent,
    setIsBuffering,
    setIsLoading,
    setProgressVideo
  ]);
  // Question notification - đã loại bỏ thông báo "sắp có câu hỏi"
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    
    // Thay đổi logic: không còn thông báo trước khi câu hỏi xuất hiện nữa
    
    return () => {}; // Empty cleanup function
  }, [questions]);
  // Format time (MM:SS or HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  // Video controls
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      trackPlaybackEvent("play", videoRef.current.currentTime);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      trackPlaybackEvent("pause", videoRef.current.currentTime);
    }
  };
  const handleVolumeChange = (event, newValue) => {
    const newVolume = newValue / 100;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    if (newVolume === 0) {
      setPreviousVolume(volume);
    }
    recordInteraction("volume-change", { 
      from: volume, 
      to: newVolume,
      position: videoRef.current.currentTime
    });
  };
  const handleMuteToggle = () => {
    if (volume === 0) {
      setVolume(previousVolume);
      videoRef.current.volume = previousVolume;
      recordInteraction("volume-change", { 
        from: 0, 
        to: previousVolume,
        isMute: false,
        position: videoRef.current.currentTime
      });
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      videoRef.current.volume = 0;
      recordInteraction("volume-change", { 
        from: volume, 
        to: 0,
        isMute: true,
        position: videoRef.current.currentTime
      });
    }
  };
  const handleTimeSeek = (event, newValue) => {
    const newTime = (newValue / 100) * duration;
    const currentPosition = videoRef.current.currentTime;
    
    // Record seek interaction
    recordInteraction("seek", {
      from: currentPosition,
      to: newTime,
      seekDistance: Math.abs(newTime - currentPosition),
      seekDirection: newTime > currentPosition ? "forward" : "backward"
    });
    
    if (progress?.status === "completed" || newTime <= lastAllowedTime) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      trackPlaybackEvent("seek", newTime);
      return;
    }
    if (!questions || questions.length === 0) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      trackPlaybackEvent("seek", newTime);
      return;
    }
    const nextUnansweredQuestion = questions
      .filter((q) => !answeredQuestions.has(q.startTime))
      .sort((a, b) => a.startTime - b.startTime)
      .find((q) => q.startTime < newTime);
    if (nextUnansweredQuestion) {
      videoRef.current.currentTime = nextUnansweredQuestion.startTime;
      setCurrentTime(nextUnansweredQuestion.startTime);
      setAlert("You must answer this question before continuing.");
      trackPlaybackEvent("seek", nextUnansweredQuestion.startTime);
    } else {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      trackPlaybackEvent("seek", newTime);
    }
  };
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      recordInteraction("fullscreen", { 
        state: "entered",
        position: videoRef.current.currentTime
      });
    } else {
      document.exitFullscreen();
      recordInteraction("fullscreen", { 
        state: "exited",
        position: videoRef.current.currentTime
      });
    }
  };
  const handleSpeedMenuOpen = (event) => {
    setSpeedMenuAnchorEl(event.currentTarget);
  };
  const handleSpeedMenuClose = () => {
    setSpeedMenuAnchorEl(null);
  };
  const handleSpeedChange = (speed) => {
    const previousSpeed = videoRef.current.playbackRate;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    handleSpeedMenuClose();
    
    recordInteraction("speed-change", {
      from: previousSpeed,
      to: speed,
      position: videoRef.current.currentTime
    });
  };
  // Volume icon
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeMute />;
    if (volume < 0.5) return <VolumeDown />;
    return <VolumeUp />;
  };
  // Question handling
  // const handleMultipleChoiceChange = (answerId) => {
  //   if (selectedAnswer.includes(answerId)) {
  //     setSelectedAnswer(selectedAnswer.filter((id) => id !== answerId));
  //   } else {
  //     setSelectedAnswer([...selectedAnswer, answerId]);
  //   }
  // };
  // const handleSingleChoiceChange = (event) => {
  //   setSelectedAnswer([event.target.value]);
  // };
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: isLoading ? "none" : "block",
        }}
        onClick={handlePlayPause}
      />
      
      <VideoLoadingState isLoading={isLoading} isBuffering={isBuffering} />
      
      {/* Timeline with question markers */}
      {/* <VideoQuestionTimeline 
        questions={questions}
        answeredQuestions={answeredQuestions}
        duration={duration}
      /> */}
      {/* Video controls */}
      <VideoControls
        showControls={showControls}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        getVolumeIcon={getVolumeIcon}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        handleMuteToggle={handleMuteToggle}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        handleSpeedMenuOpen={handleSpeedMenuOpen}
        playbackSpeed={playbackSpeed}
        speedMenuAnchorEl={speedMenuAnchorEl}
        handleSpeedMenuClose={handleSpeedMenuClose}
        handleSpeedChange={handleSpeedChange}
        handleFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
        buffered={buffered}
        questions={questions}
        answeredQuestions={answeredQuestions}
        handleTimeSeek={handleTimeSeek}
        isOnline={isOnline}
      />
      {/* Interactive question dialog */}
      <InteractiveQuestionDialog
        open={openQuestionDialog && progress?.status !== "completed"}
        loading={loading}
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        handleMultipleChoiceChange={handleMultipleChoiceChange}
        handleSingleChoiceChange={handleSingleChoiceChange}
        handleAnswerSubmit={handleAnswerSubmit}
        handleCloseDialog={handleCloseDialog}
        alert={dialogAlert} // Truyền thông báo vào dialog
      />
      {/* Alerts - Chỉ hiển thị thông báo thành công ngoài dialog */}
      <SnackbarAlert alert={alert} setAlert={setAlert} />
    </Box>
  );
};
Video.propTypes = {
  src: PropTypes.string.isRequired,
  questions: PropTypes.array,
  isComplete: PropTypes.bool,
  onCompleteVideo: PropTypes.func.isRequired,
  moduleItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
Video.defaultProps = {
  questions: [],
  isComplete: false,
};
export default Video;

