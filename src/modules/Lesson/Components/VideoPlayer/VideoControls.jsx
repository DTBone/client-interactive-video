import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  Speed,
  Forward10,
  Replay10,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { throttle } from "lodash";

// Enhanced Progress Bar Component with Better Real-time Sync
const VideoProgressBar = ({
  currentTime,
  duration,
  buffered = [],
  questions = [],
  answeredQuestions = new Set(),
  handleTimeSeek,
  formatTime,
  onQuestionClick,
}) => {
  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);

  // Enhanced state để track việc dragging/seeking với better performance
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeRef = useRef(null); // Ref để tránh re-render khi drag

  // Optimized progress percentage calculation
  const progressPercentage = useMemo(() => {
    if (isDragging && dragTimeRef.current !== null) {
      return duration > 0 ? (dragTimeRef.current / duration) * 100 : 0;
    }
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration, isDragging]);

  // Enhanced mouse move handler với throttling
  const handleMouseMove = useCallback(
    throttle((event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const position = (event.clientX - rect.left) / rect.width;
      const time = position * duration;
      setHoverTime(time);
      setHoverPosition(event.clientX - rect.left);

      // Nếu đang dragging, update drag time với ref để tránh re-render
      if (isDragging) {
        const newDragTime = Math.max(0, Math.min(duration, time));
        dragTimeRef.current = newDragTime;
      }
    }, 16), // ~60fps update rate
    [duration, isDragging]
  );

  const handleMouseDown = useCallback(
    (event) => {
      setIsDragging(true);
      const rect = event.currentTarget.getBoundingClientRect();
      const position = (event.clientX - rect.left) / rect.width;
      const time = position * duration;
      const clampedTime = Math.max(0, Math.min(duration, time));
      dragTimeRef.current = clampedTime;
    },
    [duration]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (isDragging && dragTimeRef.current !== null) {
        const percentage = Math.max(
          0,
          Math.min(100, (dragTimeRef.current / duration) * 100)
        );
        handleTimeSeek(event, percentage);
      }
      setIsDragging(false);
      dragTimeRef.current = null;
    },
    [isDragging, duration, handleTimeSeek]
  );

  const handleClick = useCallback(
    (event) => {
      // Chỉ handle click nếu không phải dragging
      if (!isDragging) {
        const rect = event.currentTarget.getBoundingClientRect();
        const position = (event.clientX - rect.left) / rect.width;
        const percentage = Math.max(0, Math.min(100, position * 100));
        handleTimeSeek(event, percentage);
      }
    },
    [handleTimeSeek, isDragging]
  );

  // Simplified question status checking - only answered or unanswered
  const isQuestionAnswered = useCallback(
    (question) => {
      // Check by _id (primary method)
      if (answeredQuestions.has(question._id)) {
        return true;
      }

      // Check by startTime (fallback method)
      if (answeredQuestions.has(question.startTime)) {
        return true;
      }

      // Check question history for correct answers
      if (question.history && Array.isArray(question.history)) {
        return question.history.some(
          (record) => record.isCorrect === true || record.status === "completed"
        );
      }

      return false;
    },
    [answeredQuestions]
  );

  // Render buffered segments
  const bufferedElements = useMemo(() => {
    return buffered.map((range, index) => {
      const startPercent = (range.start / duration) * 100;
      const widthPercent = ((range.end - range.start) / duration) * 100;

      return (
        <Box
          key={index}
          sx={{
            position: "absolute",
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            height: "100%",
            backgroundColor: alpha(theme.palette.common.white, 0.3),
            borderRadius: 1,
          }}
        />
      );
    });
  }, [buffered, duration, theme]);

  // Enhanced question markers với better performance
  const questionMarkers = useMemo(() => {
    // Use drag time or current time for question detection
    const timeForDetection = isDragging ? dragTimeRef.current : currentTime;

    return questions?.map((question) => {
      const position = (question.startTime / duration) * 100;
      const isAnswered = isQuestionAnswered(question);
      const isActive =
        timeForDetection >= question.startTime &&
        timeForDetection < (question.endTime || question.startTime + 30);

      // Enhanced marker appearance với better visual feedback
      let markerColor,
        tooltipText,
        markerSize = 12,
        pulseAnimation = false;

      if (isAnswered) {
        markerColor = theme.palette.success.main;
        tooltipText = `✓ Question answered at ${formatTime(question.startTime)}`;
        pulseAnimation = true;
      } else if (isActive) {
        markerColor = theme.palette.warning.main;
        tooltipText = `▶ Active question at ${formatTime(question.startTime)}`;
        markerSize = 16;
        pulseAnimation = true;
      } else {
        markerColor = theme.palette.grey[400];
        tooltipText = `❓ Unanswered question at ${formatTime(question.startTime)}`;
      }

      return (
        <Tooltip
          key={question._id || question.startTime}
          title={tooltipText}
          placement="top"
        >
          <Box
            sx={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: markerSize,
              height: markerSize,
              borderRadius: "50%",
              backgroundColor: markerColor,
              border: `2px solid ${theme.palette.common.white}`,
              cursor: "pointer",
              zIndex: isActive ? 4 : 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translate(-50%, -50%) scale(1.3)",
                boxShadow: `0 0 12px ${alpha(markerColor, 0.6)}`,
              },
              // Enhanced pulse animation
              ...(pulseAnimation && {
                animation: `pulse-${isAnswered ? "answered" : "active"} 2s infinite`,
                "@keyframes pulse-answered": {
                  "0%": {
                    boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.7)}`,
                  },
                  "70%": {
                    boxShadow: `0 0 0 6px ${alpha(theme.palette.success.main, 0)}`,
                  },
                  "100%": {
                    boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}`,
                  },
                },
                "@keyframes pulse-active": {
                  "0%": {
                    boxShadow: `0 0 0 0 ${alpha(theme.palette.warning.main, 0.7)}`,
                  },
                  "70%": {
                    boxShadow: `0 0 0 8px ${alpha(theme.palette.warning.main, 0)}`,
                  },
                  "100%": {
                    boxShadow: `0 0 0 0 ${alpha(theme.palette.warning.main, 0)}`,
                  },
                },
              }),
            }}
            onClick={(e) => {
              e.stopPropagation();
              const percentage = (question.startTime / duration) * 100;
              handleTimeSeek(e, percentage);

              if (onQuestionClick) {
                onQuestionClick(question);
              }
            }}
          />
        </Tooltip>
      );
    });
  }, [
    questions,
    duration,
    isQuestionAnswered,
    currentTime,
    formatTime,
    theme,
    handleTimeSeek,
    onQuestionClick,
    isDragging,
  ]);

  return (
    <Box sx={{ position: "relative", width: "100%", mb: 1 }}>
      {/* Enhanced hover time tooltip với better positioning */}
      {(isHovering || isDragging) && (
        <Box
          sx={{
            position: "absolute",
            bottom: 25,
            left: hoverPosition,
            transform: "translateX(-50%)",
            backgroundColor: alpha(theme.palette.common.black, 0.8),
            color: theme.palette.common.white,
            padding: "4px 8px",
            borderRadius: 1,
            fontSize: "0.75rem",
            zIndex: 4,
            pointerEvents: "none",
            // Enhanced styling cho better visibility
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            backdropFilter: "blur(4px)",
          }}
        >
          {formatTime(isDragging ? dragTimeRef.current : hoverTime)}
        </Box>
      )}

      {/* Enhanced progress bar container */}
      <Box
        data-progress-bar="true"
        sx={{
          position: "relative",
          height: isDragging ? 10 : 6,
          backgroundColor: alpha(theme.palette.common.white, 0.2),
          borderRadius: 3,
          cursor: "pointer",
          "&:hover": {
            height: 8,
          },
          transition: "height 0.2s ease",
          // Enhanced interaction feedback
          "&:active": {
            height: 12,
          },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        {/* Buffered segments */}
        {bufferedElements}

        {/* Enhanced progress bar với smooth transitions */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            width: `${progressPercentage}%`,
            height: "100%",
            backgroundColor: isDragging
              ? theme.palette.primary.light
              : theme.palette.primary.main,
            borderRadius: 3,
            zIndex: 2,
            transition: isDragging ? "none" : "width 0.1s ease",
            // Enhanced visual feedback
            boxShadow: isDragging
              ? `0 0 8px ${alpha(theme.palette.primary.light, 0.8)}`
              : "none",
          }}
        />

        {/* Question markers */}
        {questionMarkers}

        {/* Enhanced progress thumb */}
        <Box
          sx={{
            position: "absolute",
            left: `${progressPercentage}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: isDragging ? 18 : 14,
            height: isDragging ? 18 : 14,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "50%",
            border: `2px solid ${theme.palette.common.white}`,
            zIndex: 3,
            opacity: isHovering || isDragging ? 1 : 0,
            transition: isDragging
              ? "none"
              : "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
            cursor: isDragging ? "grabbing" : "grab",
            // Enhanced visual feedback
            boxShadow: isDragging
              ? `0 0 12px ${alpha(theme.palette.primary.main, 0.8)}`
              : `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        />
      </Box>
    </Box>
  );
};

// Add PropTypes for VideoProgressBar
VideoProgressBar.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  buffered: PropTypes.array,
  questions: PropTypes.array,
  answeredQuestions: PropTypes.instanceOf(Set),
  handleTimeSeek: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
  onQuestionClick: PropTypes.func,
};

VideoProgressBar.defaultProps = {
  buffered: [],
  questions: [],
  answeredQuestions: new Set(),
  onQuestionClick: null,
};

// Enhanced Main VideoControls Component với Better Performance
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
  batteredRegions,
  questions,
  answeredQuestions,
  handleTimeSeek,
  isOnline = true,
  onQuestionClick,
  getCurrentQuestion,
  completionPercentage,
  getQuestionToShow,
  videoProgress,
  isProgressLoading,
  progressError,
}) => {
  const theme = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Enhanced state để track việc seeking với better performance
  const [isSeeking, setIsSeeking] = useState(false);
  const seekingTimeRef = useRef(null); // Ref để tránh re-render

  // Speed options
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  // Enhanced question statistics calculation với memoization
  const questionStats = useMemo(() => {
    if (!questions?.length) return { total: 0, answered: 0, correctAnswers: 0 };

    let answered = 0;
    let correctAnswers = 0;

    questions.forEach((question) => {
      const isAnswered =
        answeredQuestions.has(question._id) ||
        answeredQuestions.has(question.startTime);

      if (isAnswered) {
        answered++;
      }

      // Check for correct answers in history
      if (question.history && Array.isArray(question.history)) {
        const hasCorrectAnswer = question.history.some(
          (record) => record.isCorrect === true || record.status === "completed"
        );
        if (hasCorrectAnswer) {
          correctAnswers++;
        }
      } else if (isAnswered) {
        // If no history but marked as answered, assume correct
        correctAnswers++;
      }
    });

    return {
      total: questions.length,
      answered,
      correctAnswers,
      unanswered: questions.length - answered,
    };
  }, [questions, answeredQuestions]);

  // Enhanced skip functions với optimized state updates
  const handleSkipBackward = useCallback(() => {
    const newTime = Math.max(0, currentTime - 10);
    const percentage = (newTime / duration) * 100;

    // Set seeking state với ref để hiển thị thời gian ngay lập tức
    setIsSeeking(true);
    seekingTimeRef.current = newTime;

    handleTimeSeek(null, percentage);

    // Reset seeking state sau một khoảng ngắn
    setTimeout(() => {
      setIsSeeking(false);
      seekingTimeRef.current = null;
    }, 100);
  }, [currentTime, duration, handleTimeSeek]);

  const handleSkipForward = useCallback(() => {
    const newTime = Math.min(duration, currentTime + 10);
    const percentage = (newTime / duration) * 100;

    // Set seeking state với ref để hiển thị thời gian ngay lập tức
    setIsSeeking(true);
    seekingTimeRef.current = newTime;

    handleTimeSeek(null, percentage);

    // Reset seeking state sau một khoảng ngắn
    setTimeout(() => {
      setIsSeeking(false);
      seekingTimeRef.current = null;
    }, 100);
  }, [currentTime, duration, handleTimeSeek]);

  // Enhanced current active question calculation
  const activeQuestion = useMemo(() => {
    if (getCurrentQuestion) {
      return getCurrentQuestion();
    }

    // Use the most current time for question detection
    const timeToCheck = isSeeking ? seekingTimeRef.current : currentTime;

    return questions?.find(
      (q) =>
        timeToCheck >= q.startTime &&
        timeToCheck < (q.endTime || q.startTime + 30)
    );
  }, [questions, currentTime, getCurrentQuestion, isSeeking]);

  // Enhanced question to display calculation
  const questionToShow = useMemo(() => {
    if (getQuestionToShow) {
      return getQuestionToShow();
    }

    // Default logic: show active question or first unanswered
    if (activeQuestion) {
      return activeQuestion;
    }

    // Find first unanswered question
    return questions?.find(
      (q) =>
        !answeredQuestions.has(q._id) && !answeredQuestions.has(q.startTime)
    );
  }, [activeQuestion, questions, answeredQuestions, getQuestionToShow]);

  // Enhanced current time calculation với priority optimized
  const displayCurrentTime = useMemo(() => {
    // Priority 1: If seeking, show seeking time immediately
    if (isSeeking && seekingTimeRef.current !== null) {
      return seekingTimeRef.current;
    }

    // Priority 2: Use video progress last position (most accurate)
    if (
      videoProgress?.lastPosition !== undefined &&
      videoProgress.lastPosition >= 0
    ) {
      return videoProgress.lastPosition;
    }

    // Priority 3: Fallback to current time from props
    return currentTime;
  }, [isSeeking, currentTime, videoProgress?.lastPosition]);

  // Enhanced duration calculation
  const displayDuration = useMemo(() => {
    // Priority 1: Video progress total duration
    if (videoProgress?.totalDuration > 0) {
      return videoProgress.totalDuration;
    }

    // Priority 2: Duration from props
    return duration > 0 ? duration : 0;
  }, [duration, videoProgress?.totalDuration]);

  // Enhanced keyboard shortcuts với better event handling
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      )
        return;

      switch (event.key) {
        case " ":
          event.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handleSkipBackward();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleSkipForward();
          break;
        case "f":
        case "F":
          event.preventDefault();
          handleFullscreenToggle();
          break;
        case "m":
        case "M":
          event.preventDefault();
          handleMuteToggle();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    handlePlayPause,
    handleSkipBackward,
    handleSkipForward,
    handleFullscreenToggle,
    handleMuteToggle,
  ]);

  if (!showControls) return null;

  return (
    <Fade in={showControls} timeout={300}>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(transparent, ${alpha(theme.palette.common.black, 0.8)})`,
          padding: theme.spacing(2),
          color: theme.palette.common.white,
          // Enhanced backdrop for better visibility
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Enhanced Progress Bar với better sync */}
        <VideoProgressBar
          currentTime={displayCurrentTime}
          duration={displayDuration}
          buffered={batteredRegions}
          questions={questions}
          answeredQuestions={answeredQuestions}
          handleTimeSeek={handleTimeSeek}
          formatTime={formatTime}
          onQuestionClick={onQuestionClick}
        />

        {/* Controls Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Play/Pause */}
            <Tooltip title={isPlaying ? "Pause (Space)" : "Play (Space)"}>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>

            {/* Skip Backward */}
            <Tooltip title="Skip backward 10s (←)">
              <IconButton
                onClick={handleSkipBackward}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Replay10 />
              </IconButton>
            </Tooltip>

            {/* Skip Forward */}
            <Tooltip title="Skip forward 10s (→)">
              <IconButton
                onClick={handleSkipForward}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Forward10 />
              </IconButton>
            </Tooltip>

            {/* Volume Controls */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Tooltip title="Mute (M)">
                <IconButton
                  onClick={handleMuteToggle}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  {getVolumeIcon()}
                </IconButton>
              </Tooltip>

              <Fade in={showVolumeSlider} timeout={200}>
                <Box sx={{ width: 80, ml: 1 }}>
                  <Slider
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    sx={{
                      color: "white",
                      "& .MuiSlider-thumb": {
                        backgroundColor: "white",
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "white",
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: alpha(theme.palette.common.white, 0.3),
                      },
                    }}
                  />
                </Box>
              </Fade>
            </Box>

            {/* Enhanced Time Display với better sync */}
            <Typography variant="body2" sx={{ color: "white", minWidth: 120 }}>
              {formatTime(displayCurrentTime)} / {formatTime(displayDuration)}
            </Typography>
          </Box>

          {/* Right Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Connection Status */}
            {!isOnline && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.warning.main,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.warning.main,
                  }}
                />
                Offline
              </Typography>
            )}

            {/* Enhanced Progress Loading Indicator */}
            {isProgressLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CircularProgress size={16} sx={{ color: "white" }} />
                <Typography variant="caption" sx={{ color: "white" }}>
                  Syncing...
                </Typography>
              </Box>
            )}

            {/* Progress Error Indicator */}
            {progressError && (
              <Tooltip title={`Sync error: ${progressError}`}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.error.main,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  ⚠ Error
                </Typography>
              </Tooltip>
            )}

            {/* Enhanced Completion Percentage Display */}
            {completionPercentage > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color:
                    completionPercentage === 100
                      ? theme.palette.success.main
                      : completionPercentage > 50
                        ? theme.palette.warning.main
                        : theme.palette.info.main,
                  fontWeight: 600,
                  minWidth: 40,
                }}
              >
                {Math.round(completionPercentage)}%
              </Typography>
            )}

            {/* Speed Control */}
            <Tooltip title="Playback speed">
              <IconButton
                onClick={handleSpeedMenuOpen}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Speed />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={speedMenuAnchorEl}
              open={Boolean(speedMenuAnchorEl)}
              onClose={handleSpeedMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: alpha(theme.palette.common.black, 0.9),
                  color: "white",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              {speedOptions.map((speed) => (
                <MenuItem
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  selected={playbackSpeed === speed}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                    "&.Mui-selected": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  {speed}x
                </MenuItem>
              ))}
            </Menu>

            {/* Fullscreen */}
            <Tooltip
              title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            >
              <IconButton
                onClick={handleFullscreenToggle}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Enhanced Progress and Question Status Display */}
        {questions?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              {/* Enhanced status legend với better visual feedback */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                  >
                    Answered ({questionStats.answered})
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.grey[400],
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                  >
                    Unanswered ({questionStats.unanswered})
                  </Typography>
                </Box>

                {/* Enhanced Current/Next Question Indicator */}
                {(activeQuestion || questionToShow) && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      ml: 1,
                      padding: "2px 8px",
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.warning.main, 0.2),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.warning.main,
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.warning.light,
                        fontWeight: 500,
                      }}
                    >
                      {activeQuestion ? "Active" : "Next"} question at{" "}
                      {formatTime((activeQuestion || questionToShow).startTime)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Fade>
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
  batteredRegions: PropTypes.array,
  questions: PropTypes.array,
  answeredQuestions: PropTypes.instanceOf(Set),
  handleTimeSeek: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
  onQuestionClick: PropTypes.func,
  getCurrentQuestion: PropTypes.func,
  completionPercentage: PropTypes.number,
  getQuestionToShow: PropTypes.func,
  videoProgress: PropTypes.shape({
    lastPosition: PropTypes.number,
    totalDuration: PropTypes.number,
  }),
  isProgressLoading: PropTypes.bool,
  progressError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

VideoControls.defaultProps = {
  batteredRegions: [],
  questions: [],
  answeredQuestions: new Set(),
  speedMenuAnchorEl: null,
  isOnline: true,
  onQuestionClick: null,
  getCurrentQuestion: null,
  getQuestionToShow: null,
};

export default VideoControls;
