import React, { useState, useCallback, useMemo } from "react";
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
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  Speed,
  VolumeUp,
  VolumeDown,
  VolumeMute,
  Forward10,
  Replay10,
  Settings,
} from "@mui/icons-material";
import PropTypes from "prop-types";

// Subcomponent for Progress Bar with Question Markers
const VideoProgressBar = ({
  currentTime,
  duration,
  buffered = [],
  questions = [],
  answeredQuestions = new Set(),
  handleTimeSeek,
  formatTime,
  lastAllowedTime,
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

  // Render question markers
  const questionMarkers = useMemo(() => {
    return questions?.map((question) => {
      const position = (question.startTime / duration) * 100;
      const isAnswered = answeredQuestions.has(question.startTime);

      return (
        <Tooltip
          key={question.startTime}
          title={`Question at ${formatTime(question.startTime)}`}
        >
          <Box
            sx={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: isAnswered
                ? theme.palette.success.main
                : theme.palette.warning.main,
              border: `2px solid ${theme.palette.common.white}`,
              cursor: "pointer",
              zIndex: 3,
              "&:hover": {
                transform: "translate(-50%, -50%) scale(1.2)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              const percentage = (question.startTime / duration) * 100;
              handleTimeSeek(e, percentage);
            }}
          />
        </Tooltip>
      );
    });
  }, [
    questions,
    duration,
    answeredQuestions,
    formatTime,
    theme,
    handleTimeSeek,
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

// Main VideoControls Component
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
  lastAllowedTime,
  isOnline = true,
}) => {
  const theme = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Speed options
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

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

  // Keyboard shortcuts
  React.useEffect(() => {
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
        {/* Progress Bar */}
        <VideoProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          questions={questions}
          answeredQuestions={answeredQuestions}
          handleTimeSeek={handleTimeSeek}
          formatTime={formatTime}
          lastAllowedTime={lastAllowedTime}
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
              {formatTime(currentTime)} / {formatTime(duration)}
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

        {/* Question Status */}
        {questions?.length > 0 && (
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
              Questions: {answeredQuestions.size}/{questions.length} answered
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
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
                sx={{ color: alpha(theme.palette.common.white, 0.7), mr: 1 }}
              >
                Answered
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.warning.main,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: alpha(theme.palette.common.white, 0.7) }}
              >
                Unanswered
              </Typography>
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
  buffered: PropTypes.array,
  questions: PropTypes.array,
  answeredQuestions: PropTypes.instanceOf(Set),
  handleTimeSeek: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
  lastAllowedTime: PropTypes.number,
};

VideoControls.defaultProps = {
  buffered: [],
  questions: [],
  answeredQuestions: new Set(),
  speedMenuAnchorEl: null,
  isOnline: true,
  lastAllowedTime: Infinity,
};

export default VideoControls;
