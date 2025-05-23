import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  CircularProgress,
  Alert,
} from "@mui/material";
import { QuestionAnswer, Close, VolumeUp, VolumeDown, VolumeMute } from "@mui/icons-material";
import { getLectureById } from "~/store/slices/Quiz/action";
import SnackbarAlert from "../SnackbarAlert";
import VideoControls from "./VideoControls";
import useVideoQuestions from "../../hooks/useVideoQuestion";
import useVideoProgress from "../../hooks/useVideoProgress";
import { formatTime } from "../../hooks/useFormatTime";
import PropTypes from 'prop-types';
import InteractiveQuestionDialog from "../InteractiveQuestionDialog";

const Video = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const lectureId = location.state.item.video;
  const moduleItemId = location.state.item._id;

  const [alert, setAlert] = useState("");
  const [lectureData, setLectureData] = useState(null);
  const [questions, setQuestion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState(null);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const { lecture, loading: quizLoading } = useSelector((state) => state.quiz);
  const progress = findModuleItemProgress(
    useSelector((state) => state.progress.progress) || [],
    moduleItemId
  );

  useEffect(() => {
    dispatch(getLectureById(lectureId));
  }, [dispatch, lectureId]);

  useEffect(() => {
    setLectureData(lecture);
    setQuestion(lecture?.questions || []);
  }, [lecture]);

  const {
    currentQuestion,
    selectedAnswer,
    dialogAlert,
    loading,
    lastAllowedTime,
    answeredQuestions,
    checkForQuestions,
    handleAnswerSubmit,
    handleCloseDialog,
    handleMultipleChoiceChange,
    handleSingleChoiceChange,
  } = useVideoQuestions(questions, progress, videoRef);

  const {
    syncProgressToServer,
    progressVideo,
    setProgressVideo,
    updateVideoProgress,
    trackPlaybackEvent,
    recordInteraction,
  } = useVideoProgress({
    videoRef,
    moduleItemId,
    lectureId,
    onCompleteVideo: () => console.log("submitted video"),
  });

  const handleTimeUpdate = () => {
    const time = videoRef.current?.currentTime || 0;
    setCurrentTime(time);
    checkForQuestions(time);
  };

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
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
      position: videoRef.current.currentTime,
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
        position: videoRef.current.currentTime,
      });
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      videoRef.current.volume = 0;
      recordInteraction("volume-change", {
        from: volume,
        to: 0,
        isMute: true,
        position: videoRef.current.currentTime,
      });
    }
  };

  const handleTimeSeek = (event, newValue) => {
    const newTime = (newValue / 100) * duration;
    const currentPosition = videoRef.current.currentTime;

    recordInteraction("seek", {
      from: currentPosition,
      to: newTime,
      seekDistance: Math.abs(newTime - currentPosition),
      seekDirection: newTime > currentPosition ? "forward" : "backward",
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

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        const elem = videoContainerRef.current;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        }
        recordInteraction("fullscreen", {
          state: "entered",
          position: videoRef.current.currentTime,
        });
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        }
        recordInteraction("fullscreen", {
          state: "exited",
          position: videoRef.current.currentTime,
        });
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isFullscreen) return;

      switch (event.key) {
        case "Escape":
          if (currentQuestion && progress?.status !== "completed") {
            event.preventDefault();
          }
          break;
        case " ":
          event.preventDefault();
          handlePlayPause();
          break;
        case "f":
        case "F":
          event.preventDefault();
          handleFullscreenToggle();
          break;
        default:
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, currentQuestion, progress?.status]);

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
      position: videoRef.current.currentTime,
    });
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeMute />;
    if (volume < 0.5) return <VolumeDown />;
    return <VolumeUp />;
  };

  // Component hiển thị câu hỏi tích hợp
  const QuestionDialog = ({ open, question }) => {
    if (!open || !question) return null;

    const dialogStyles = isFullscreen
      ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }
      : {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1300,
        };

    const contentStyles = {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      maxWidth: isFullscreen ? "600px" : "500px",
      width: "100%",
      maxHeight: isFullscreen ? "80vh" : "70vh",
      overflowY: "auto",
      boxShadow: isFullscreen
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        : "0 8px 24px rgba(0, 0, 0, 0.2)",
      position: "relative",
    };

    return (
      <div
        style={dialogStyles}
        onClick={(e) => {
          if (isFullscreen && e.target === e.currentTarget) {
             handleCloseDialog(); 
          }
        }}
      >
        <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "12px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}
            >
              <QuestionAnswer sx={{ verticalAlign: "middle", mr: 1 }} />
              Interactive Question
            </Typography>
            <Button
              onClick={handleCloseDialog}
              sx={{
                minWidth: "auto",
                p: 1,
                color: "#6b7280",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <Close />
            </Button>
          </div>

          {/* Nội dung câu hỏi */}
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              {dialogAlert && (
                <Alert
                  severity={dialogAlert.includes("correct") ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {dialogAlert}
                </Alert>
              )}
              <FormControl sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {question?.question}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {question?.questionType === "multipleChoice"
                    ? "Select all that apply:"
                    : "Select one:"}
                </Typography>
                {question?.questionType === "multipleChoice" ? (
                  <Stack spacing={2}>
                    {question?.answers?.map((answer) => (
                      <FormControlLabel
                        key={answer._id}
                        control={
                          <Checkbox
                            checked={selectedAnswer?.includes(answer._id)}
                            onChange={() => handleMultipleChoiceChange(answer._id)}
                            sx={{
                              "&.Mui-checked": { color: "#3b82f6" },
                            }}
                          />
                        }
                        label={answer.content}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor: selectedAnswer?.includes(answer._id)
                            ? "#3b82f6"
                            : "#e5e7eb",
                          bgcolor: selectedAnswer?.includes(answer._id)
                            ? "#eff6ff"
                            : "white",
                          "&:hover": {
                            bgcolor: selectedAnswer?.includes(answer._id)
                              ? "#eff6ff"
                              : "#f9fafb",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <RadioGroup
                    value={selectedAnswer?.[0] || ""}
                    onChange={handleSingleChoiceChange}
                  >
                    <Stack spacing={2}>
                      {question?.answers.map((answer) => (
                        <FormControlLabel
                          key={answer._id}
                          value={answer._id}
                          control={<Radio sx={{ "&.Mui-checked": { color: "#3b82f6" } }} />}
                          label={answer.content}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: selectedAnswer?.[0] === answer._id
                              ? "#3b82f6"
                              : "#e5e7eb",
                            bgcolor: selectedAnswer?.[0] === answer._id
                              ? "#eff6ff"
                              : "white",
                            "&:hover": {
                              bgcolor: selectedAnswer?.[0] === answer._id
                                ? "#eff6ff"
                                : "#f9fafb",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </RadioGroup>
                )}
              </FormControl>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Button
                  onClick={handleCloseDialog}
                  sx={{
                    px: 2,
                    py: 1,
                    border: "1px solid #d1d5db",
                    color: "#374151",
                    borderRadius: 1.5,
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={loading || !selectedAnswer || selectedAnswer.length === 0}
                  variant="contained"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: loading || !selectedAnswer || selectedAnswer.length === 0
                      ? "#9ca3af"
                      : "#3b82f6",
                    "&:hover": {
                      bgcolor:
                        loading || !selectedAnswer || selectedAnswer.length === 0
                          ? "#9ca3af"
                          : "#2563eb",
                    },
                  }}
                  startIcon={<QuestionAnswer />}
                >
                  {loading ? "Submitting..." : "Submit Answer"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (quizLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={videoContainerRef} style={{ position: "relative" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "transparent",
          borderRadius: isFullscreen ? 0 : 3,
        }}
      >
        <video
          ref={videoRef}
          src={lectureData?.file}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: loading ? "none" : "block",
          }}
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onClick={handlePlayPause}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        />
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
          questions={questions}
          answeredQuestions={answeredQuestions}
          handleTimeSeek={handleTimeSeek}
          lastAllowedTime={lastAllowedTime}
        />
        {!!currentQuestion && progress?.status !== "completed" && isFullscreen && (
          <QuestionDialog open={true} question={currentQuestion} />
        )}

         {!!currentQuestion && progress?.status !== "completed" && !isFullscreen && (
           <InteractiveQuestionDialog
          open={!!currentQuestion && progress?.status !== "completed"}
          loading={loading} //cmt
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          handleMultipleChoiceChange={handleMultipleChoiceChange}
          handleSingleChoiceChange={handleSingleChoiceChange}
          handleAnswerSubmit={handleAnswerSubmit}
          handleCloseDialog={handleCloseDialog}
          alert={dialogAlert}
        />
        )}
        <SnackbarAlert alert={alert} setAlert={setAlert} />
      </Box>
    </div>
  );
};

function findModuleItemProgress(progressList, moduleItemId) {
  if (Array.isArray(progressList)) {
    for (const moduleProgress of progressList) {
      const item = moduleProgress.moduleItemProgresses.find(
        (mip) => mip.moduleItemId?._id === moduleItemId
      );
      if (item) return item;
    }
  }
  return null;
}

Video.propTypes = {
  // Có thể thêm các prop nếu component được tái sử dụng
};

export default Video;