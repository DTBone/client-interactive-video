import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  VolumeOff,
  VolumeDown,
  VolumeUp,
  QuestionAnswer,
  Close,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import VideoControls from "./VideoControls";

import useVideoQuestions from "../../hooks/useVideoQuestion";
import useVideoProgress from "../../hooks/useVideoProgress";
import { formatTime } from "../../hooks/useFormatTime";
import InteractiveQuestionDialog from "../InteractiveQuestionDialog";
import { preloadInteractiveQuestion } from "~/store/slices/ModuleItem/action";
import SnackbarAlert from "../SnackbarAlert";

const Video = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { onQuizSubmit } = useOutletContext();
  const lectureId = location?.state?.item?.video._id;
  const moduleItemId = location.state?.item._id;
  const [alert, setAlert] = useState("");
  const [lectureData, setLectureData] = useState(null);
  const [questions, setQuestion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls] = useState(true);
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
  console.log("videoRef", videoRef);
  // const [hasPreloaded, setHasPreloaded] = useState(false);
  // useEffect(() => {
  //   if (!hasPreloaded) {
  //     let videoId = location.state?.item?.video._id;
  //     if (videoId) {
  //       console.log("Preloading interactive questions for video:", videoId);
  //       dispatch(preloadInteractiveQuestion({ moduleItemId, videoId }));
  //       setHasPreloaded(true);
  //     }
  //   }
  // }, [
  //   hasPreloaded,
  //   dispatch,
  //   lectureId,
  //   moduleItemId,
  //   // location.state?.item?.video,
  // ]);
  useEffect(() => {
    setLectureData(lecture);
    setQuestion(lecture?.questions || []);
  }, [lecture]);

  const handleProgressTimeUpdate = useCallback(
    (progressData) => {
      if (progressData) {
        // Đồng bộ real-time với video controls
        setCurrentTime(progressData.lastPosition);

        if (progressData.totalDuration && !duration) {
          setDuration(progressData.totalDuration);
        }
      }
    },
    [duration]
  );

  const {
    currentQuestion,
    selectedAnswer,
    dialogAlert,
    loading,
    answeredQuestions,
    checkForQuestions,
    handleAnswerSubmit,
    handleCloseDialog,
    handleMultipleChoiceChange,
    handleSingleChoiceChange,
  } = useVideoQuestions(questions, progress, videoRef);

  const {
    videoProgress,
    isLoading,
    error,
    completionPercentage,
    updateProgress,
  } = useVideoProgress({
    videoRef,
    progress,
    videoId: location.state?.item?.video,
    progressId: progress?.moduleItemId?._id || moduleItemId,
    onTimeUpdate: handleProgressTimeUpdate,
    onQuizSubmit,
  });

  const displayCurrentTime = useMemo(() => {
    if (videoProgress?.lastPosition !== undefined) {
      return videoProgress.lastPosition;
    }
    return currentTime;
  }, [videoProgress?.lastPosition, currentTime]);

  const displayDuration = useMemo(() => {
    if (videoProgress?.totalDuration > 0) {
      return videoProgress.totalDuration;
    }
    return duration;
  }, [videoProgress?.totalDuration, duration]);

  const getCurrentQuestion = useCallback(() => {
    return questions?.find(
      (q) =>
        displayCurrentTime >= q.startTime &&
        displayCurrentTime < (q.endTime || q.startTime + 30)
    );
  }, [questions, displayCurrentTime]);

  const handleTimeUpdate = useCallback(() => {
    const time = videoRef.current?.currentTime || 0;
    setCurrentTime(time);
    checkForQuestions(time);
    if (updateProgress) {
      updateProgress();
    }
  }, [checkForQuestions, updateProgress]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (event, newValue) => {
      const newVolume = newValue / 100;
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setPreviousVolume(volume);
      }
    },
    [volume]
  );

  const handleMuteToggle = useCallback(() => {
    if (volume === 0) {
      setVolume(previousVolume);
      videoRef.current.volume = previousVolume;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      videoRef.current.volume = 0;
    }
  }, [volume, previousVolume]);

  const handleTimeSeek = useCallback(
    (event, newValue) => {
      const newTime = (newValue / 100) * displayDuration;
      const currentPosition = videoRef.current.currentTime;

      console.log(`Seeking to: ${newTime}s (${newValue}%)`);
      console.log(`Progress status: ${progress?.status}`);

      if (progress?.status === "completed") {
        console.log("Video completed - allowing free seeking");
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        return;
      }

      if (!questions || questions.length === 0) {
        console.log("No questions - allowing free seeking");
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        return;
      }

      const blockingQuestion = questions
        .filter((q) => !answeredQuestions.has(q.startTime))
        .filter((q) => q.startTime > currentPosition && q.startTime <= newTime)
        .sort((a, b) => a.startTime - b.startTime)[0];

      if (blockingQuestion) {
        console.log(`Blocked by question at ${blockingQuestion.startTime}s`);
        videoRef.current.currentTime = blockingQuestion.startTime;
        setCurrentTime(blockingQuestion.startTime);
        setAlert("You must answer this question before continuing.");
      } else {
        console.log("No blocking questions - seeking allowed");
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    },
    [displayDuration, progress?.status, questions, answeredQuestions]
  );
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
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
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
  }, [isFullscreen, currentQuestion, progress?.status, handlePlayPause]);
  const handleSpeedMenuOpen = (event) => {
    setSpeedMenuAnchorEl(event.currentTarget);
  };
  const handleSpeedMenuClose = () => {
    setSpeedMenuAnchorEl(null);
  };
  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    handleSpeedMenuClose();
  };
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOff />;
    if (volume < 0.5) return <VolumeDown />;
    return <VolumeUp />;
  };
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
                  severity={
                    dialogAlert.includes("correct") ? "success" : "error"
                  }
                  sx={{ mb: 2 }}
                >
                  {dialogAlert}
                </Alert>
              )}

              <FormControl sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {question?.question}
                </Typography>

                {currentQuestion.questionType === "true-false" && (
                  <>
                    <Typography variant="subtitle1" className="mb-2">
                      Select the box if{" "}
                      <span className="text-green-600 font-bold uppercase">
                        True
                      </span>
                      , leave blank if{" "}
                      <span className="text-red-600 font-bold uppercase">
                        False
                      </span>
                      .
                    </Typography>
                    <RadioGroup
                      value={selectedAnswer?.[0] || ""}
                      onChange={handleSingleChoiceChange}
                    >
                      <Stack className="space-y-4">
                        {currentQuestion.answers.map((answer) => (
                          <FormControlLabel
                            key={answer._id}
                            value={answer._id}
                            control={<Radio />}
                            label={answer.content}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </>
                )}

                {currentQuestion.questionType === "multiple-choice" && (
                  <>
                    <Typography variant="subtitle1" className="mb-2">
                      Select all that apply:
                    </Typography>
                    <Stack className="space-y-4">
                      {currentQuestion.answers.map((answer) => (
                        <FormControlLabel
                          key={answer._id}
                          control={
                            <Checkbox
                              checked={selectedAnswer?.includes(answer._id)}
                              onChange={() =>
                                handleMultipleChoiceChange(answer._id)
                              }
                            />
                          }
                          label={answer.content}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {currentQuestion.questionType === "single-choice" && (
                  <>
                    <Typography variant="subtitle1" className="mb-2">
                      Select one:
                    </Typography>
                    <RadioGroup
                      value={selectedAnswer?.[0] || ""}
                      onChange={handleSingleChoiceChange}
                    >
                      <Stack className="space-y-4">
                        {currentQuestion.answers.map((answer) => (
                          <FormControlLabel
                            key={answer._id}
                            value={answer._id}
                            control={<Radio />}
                            label={answer.content}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </>
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
                  disabled={
                    loading || !selectedAnswer || selectedAnswer.length === 0
                  }
                  variant="contained"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor:
                      loading || !selectedAnswer || selectedAnswer.length === 0
                        ? "#9ca3af"
                        : "#3b82f6",
                    "&:hover": {
                      bgcolor:
                        loading ||
                        !selectedAnswer ||
                        selectedAnswer.length === 0
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

  // Add PropTypes for QuestionDialog
  QuestionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    question: PropTypes.shape({
      question: PropTypes.string,
      _id: PropTypes.string,
      questionType: PropTypes.string,
      answers: PropTypes.array,
    }),
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
          currentTime={displayCurrentTime}
          duration={displayDuration}
          formatTime={formatTime}
          handleSpeedMenuOpen={handleSpeedMenuOpen}
          playbackSpeed={playbackSpeed}
          speedMenuAnchorEl={speedMenuAnchorEl}
          handleSpeedMenuClose={handleSpeedMenuClose}
          handleSpeedChange={handleSpeedChange}
          handleFullscreenToggle={handleFullscreenToggle}
          isFullscreen={isFullscreen}
          batteredRegions={[]}
          questions={questions}
          getCurrentQuestion={getCurrentQuestion}
          answeredQuestions={answeredQuestions}
          handleTimeSeek={handleTimeSeek}
          completionPercentage={completionPercentage}
          videoProgress={videoProgress}
          isProgressLoading={isLoading}
          progressError={error}
        />
        {!!currentQuestion &&
          progress?.status !== "completed" &&
          isFullscreen && (
            <QuestionDialog open={true} question={currentQuestion} />
          )}
        {!!currentQuestion &&
          progress?.status !== "completed" &&
          !isFullscreen && (
            <InteractiveQuestionDialog
              open={!!currentQuestion && progress?.status !== "completed"}
              loading={loading}
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
