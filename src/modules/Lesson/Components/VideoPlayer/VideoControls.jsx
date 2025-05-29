import React, { useState, useCallback, useMemo, useEffect } from "react";
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

// Enhanced Progress Bar Component with Simplified Question States
const VideoProgressBar = ({
  currentTime,
  duration,
  buffered = [],
  questions = [],
  answeredQuestions = new Set(),
  handleTimeSeek,
  formatTime,
  lastAllowedTime,
  onQuestionClick,
}) => {
  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const position = (event.clientX - rect.left) / rect.width;
      const time = position * duration;
      setHoverTime(time);
      setHoverPosition(event.clientX - rect.left);
    },
    [duration]
  );

  const handleClick = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const position = (event.clientX - rect.left) / rect.width;
      const percentage = Math.max(0, Math.min(100, position * 100));
      handleTimeSeek(event, percentage);
    },
    [handleTimeSeek]
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

  // Simplified question markers - only two states
  const questionMarkers = useMemo(() => {
    return questions?.map((question) => {
      const position = (question.startTime / duration) * 100;
      const isAnswered = isQuestionAnswered(question);
      const isActive =
        currentTime >= question.startTime &&
        currentTime < (question.endTime || question.startTime + 30);

      // Determine marker appearance
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
              // Pulse animation for answered and active questions
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

              // Notify parent component about question click
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
  ]);

  return (
    <Box sx={{ position: "relative", width: "100%", mb: 1 }}>
      {/* Hover time tooltip */}
      {isHovering && (
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
          }}
        >
          {formatTime(hoverTime)}
        </Box>
      )}

      {/* Progress bar container */}
      <Box
        sx={{
          position: "relative",
          height: 6,
          backgroundColor: alpha(theme.palette.common.white, 0.2),
          borderRadius: 3,
          cursor: "pointer",
          "&:hover": {
            height: 8,
          },
          transition: "height 0.2s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        {/* Buffered segments */}
        {bufferedElements}

        {/* Progress bar */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            width: `${progressPercentage}%`,
            height: "100%",
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            zIndex: 2,
          }}
        />

        {/* Question markers */}
        {questionMarkers}

        {/* Progress thumb */}
        <Box
          sx={{
            position: "absolute",
            left: `${progressPercentage}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "50%",
            border: `2px solid ${theme.palette.common.white}`,
            zIndex: 3,
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.2s ease",
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
  lastAllowedTime: PropTypes.number,
  onQuestionClick: PropTypes.func,
};

VideoProgressBar.defaultProps = {
  buffered: [],
  questions: [],
  answeredQuestions: new Set(),
  lastAllowedTime: Infinity,
  onQuestionClick: null,
};

// Enhanced Main VideoControls Component
const VideoControls = ({
  progressStats,
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
  lastAllowedTime,
  isOnline = true,
  onQuestionClick,
  getCurrentQuestion,
  completionPercentage,
  getQuestionToShow,
  videoProgress,
  isProgressLoading,
  progressError,
  hasStartedWatching,
  totalTimeSpent,
  progressMilestones,
}) => {
  const theme = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Speed options
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  // Calculate question statistics - simplified to answered/unanswered
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

  // Skip functions
  const handleSkipBackward = useCallback(() => {
    const newTime = Math.max(0, currentTime - 10);
    const percentage = (newTime / duration) * 100;
    handleTimeSeek(null, percentage);
  }, [currentTime, duration, handleTimeSeek]);

  const handleSkipForward = useCallback(() => {
    const newTime = Math.min(duration, currentTime + 10);
    const percentage = (newTime / duration) * 100;
    handleTimeSeek(null, percentage);
  }, [currentTime, duration, handleTimeSeek]);

  // Get current active question
  const activeQuestion = useMemo(() => {
    if (getCurrentQuestion) {
      return getCurrentQuestion();
    }

    return questions?.find(
      (q) =>
        currentTime >= q.startTime &&
        currentTime < (q.endTime || q.startTime + 30)
    );
  }, [questions, currentTime, getCurrentQuestion]);

  // Get question to display based on logic
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

  // Sync current time with video progress if available
  const displayCurrentTime = useMemo(() => {
    return videoProgress?.lastPosition ?? currentTime;
  }, [videoProgress?.lastPosition, currentTime]);

  const displayDuration = useMemo(() => {
    return videoProgress?.totalDuration ?? duration;
  }, [videoProgress?.totalDuration, duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target.tagName === "INPUT") return;

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
          event.preventDefault();
          handleFullscreenToggle();
          break;
        case "m":
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
        }}
      >
        {/* Enhanced Progress Bar */}
        <VideoProgressBar
          currentTime={displayCurrentTime}
          duration={displayDuration}
          buffered={batteredRegions}
          questions={questions}
          answeredQuestions={answeredQuestions}
          handleTimeSeek={handleTimeSeek}
          formatTime={formatTime}
          lastAllowedTime={lastAllowedTime}
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

            {/* Time Display */}
            <Typography variant="body2" sx={{ color: "white", minWidth: 100 }}>
              {formatTime(displayCurrentTime)} / {formatTime(displayDuration)}
            </Typography>
          </Box>

          {/* Right Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Connection Status */}
            {!isOnline && (
              <Typography
                variant="caption"
                sx={{ color: theme.palette.warning.main }}
              >
                Offline
              </Typography>
            )}

            {/* Progress Loading Indicator */}
            {isProgressLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CircularProgress size={16} sx={{ color: "white" }} />
                <Typography variant="caption" sx={{ color: "white" }}>
                  Syncing...
                </Typography>
              </Box>
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
              {/* Simplified status legend */}
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
                    sx={{ color: alpha(theme.palette.common.white, 0.7) }}
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
                    sx={{ color: alpha(theme.palette.common.white, 0.7) }}
                  >
                    Unanswered ({questionStats.unanswered})
                  </Typography>
                </Box>

                {/* Current/Next Question Indicator */}
                {(activeQuestion || questionToShow) && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      ml: 1,
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
                      sx={{ color: theme.palette.warning.light }}
                    >
                      {activeQuestion ? "Active" : "Next"} question at{" "}
                      {formatTime((activeQuestion || questionToShow).startTime)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Enhanced completion percentage with sync status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {progressError && (
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.error.main }}
                  >
                    Sync Error
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      completionPercentage === 100
                        ? theme.palette.success.main
                        : completionPercentage > 0
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    fontWeight: 600,
                  }}
                ></Typography>
              </Box>
            </Box>

            {/* Enhanced Progress Stats */}
            {/* {progressStats && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.common.white, 0.8),
                    display: "block",
                  }}
                >
                  Progress: {Math.round(progressStats.completion)}% • Watched:{" "}
                  {formatTime(progressStats.watched)} • Time Spent:{" "}
                  {formatTime(progressStats.timeSpent)} • Efficiency:{" "}
                  {Math.round(progressStats.efficiency)}%
                  {hasStartedWatching && " • Session Active"}
                </Typography>
              </Box>
            )} */}
          </Box>
        )}
      </Box>
    </Fade>
  );
};

VideoControls.propTypes = {
  progressStats: PropTypes.shape({
    completion: PropTypes.number,
    watched: PropTypes.number,
    total: PropTypes.number,
    timeSpent: PropTypes.number,
    efficiency: PropTypes.number,
  }),
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
  lastAllowedTime: PropTypes.number,
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
  hasStartedWatching: PropTypes.bool,
  totalTimeSpent: PropTypes.number,
  progressMilestones: PropTypes.array,
};

VideoControls.defaultProps = {
  batteredRegions: [],
  questions: [],
  answeredQuestions: new Set(),
  speedMenuAnchorEl: null,
  isOnline: true,
  lastAllowedTime: Infinity,
  onQuestionClick: null,
  getCurrentQuestion: null,
  getQuestionToShow: null,
};

export default VideoControls;
