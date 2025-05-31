import { useState, useEffect, useCallback, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Alert,
  AlertTitle,
  Box,
  Stack,
  CircularProgress,
  Checkbox,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Fade,
  Zoom,
  Slide,
  Divider,
} from "@mui/material";
import {
  TimerOutlined,
  CheckCircle,
  Cancel,
  QuizOutlined,
  Fullscreen,
  FullscreenExit,
  ArrowBack,
  ArrowForward,
  Send,
  Lock,
  Security,
  History,
  TrendingUp,
  AccessTime,
  Assignment,
  Grade,
  Warning,
  TaskAlt,
  Visibility,
} from "@mui/icons-material";
import { getQuizById, submitQuiz } from "~/store/slices/Quiz/action";

// Modern reducer for quiz state management
function quizReducer(state, action) {
  switch (action.type) {
    case "SET_QUIZ": {
      return {
        ...state,
        quiz: action.payload,
        timeLeft: action.payload.duration || 1200,
        totalQuestions: action.payload.questions?.length || 0,
      };
    }
    case "SET_QUIZ_HISTORY": {
      return { ...state, quizHistory: action.payload };
    }
    case "START_QUIZ": {
      return {
        ...state,
        isStarted: true,
        startTime: Date.now(),
        warningCount: 0,
      };
    }
    case "SET_CURRENT_QUESTION": {
      return { ...state, currentQuestion: action.payload };
    }
    case "SET_ANSWER": {
      const currentQuestion = state.quiz.questions[state.currentQuestion];
      const newAnswers = { ...state.selectedAnswers };

      if (currentQuestion?.type === "multiple-choice") {
        const currentAnswers = newAnswers[state.currentQuestion] || [];
        newAnswers[state.currentQuestion] = currentAnswers.includes(
          action.payload
        )
          ? currentAnswers.filter((answer) => answer !== action.payload)
          : [...currentAnswers, action.payload];
      } else if (
        currentQuestion?.type === "single-choice" ||
        currentQuestion?.type === "true-false"
      ) {
        newAnswers[state.currentQuestion] = action.payload; // Chỉ lưu một câu trả lời duy nhất
      } else {
        console.error(`Invalid question type: ${currentQuestion?.type}`);
        return state; // Không thay đổi state nếu loại câu hỏi không hợp lệ
      }

      return {
        ...state,
        selectedAnswers: newAnswers,
        lastSaved: Date.now(),
      };
    }
    case "TICK_TIMER": {
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    }
    case "SUBMIT_QUIZ": {
      return {
        ...state,
        isSubmitted: true,
        endTime: Date.now(),
        score: action.payload.score,
        isPassed: action.payload.isPassed,
        quizProgress: action.payload.quizProgress,
      };
    }
    case "SET_FULLSCREEN": {
      return { ...state, isFullscreen: action.payload };
    }
    case "INCREMENT_WARNING": {
      return { ...state, warningCount: state.warningCount + 1 };
    }
    case "SET_REVIEWING": {
      return { ...state, isReviewing: action.payload };
    }
    case "RESET_QUIZ": {
      return {
        ...state,
        currentQuestion: 0,
        selectedAnswers: {},
        isSubmitted: false,
        isStarted: false,
        isReviewing: false,
        score: 0,
        isPassed: false,
        warningCount: 0,
        timeLeft: state.quiz.duration || 1200,
        startTime: null,
        endTime: null,
      };
    }
    case "SET_VISIBILITY": {
      return { ...state, isVisible: action.payload };
    }
    case "SET_QUIZ_ID": {
      return { ...state, quizId: action.payload };
    }
    default:
      return state;
  }
}

const QuizV2 = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { onQuizSubmit } = useOutletContext(); // Chỉ để trigger đổi icon

  // Refs for security measures
  const quizContainerRef = useRef(null);

  // UI state
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const initialState = {
    currentQuestion: 0,
    selectedAnswers: {},
    isSubmitted: false,
    quizProgress: null,
    quizHistory: null,
    timeLeft: 1200,
    score: 0,
    isPassed: false,
    isReviewing: false,
    isStarted: false,
    isFullscreen: false,
    isVisible: true,
    warningCount: 0,
    lastSaved: null,
    startTime: null,
    endTime: null,
    totalQuestions: 0,
    quiz: {
      duration: 1200,
      passingScore: 70,
      questions: [],
      title: "",
      totalPoints: 0,
    },
    quizId: "",
  };

  console.log("Location", location);
  const [quizState, quizDispatch] = useReducer(quizReducer, initialState);
  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
  console.log("currentQuiz", currentQuiz);

  // Get quizId from different possible sources
  const getQuizId = useCallback(() => {
    // Priority: location.state > URL pathname
    const fromState =
      location.state?.item?.quiz?._id || location.state?.item?.quiz;
    const fromPath = location.pathname.split("/").pop();

    console.log("Quiz ID sources:", {
      fromState,
      fromPath,
      locationState: location.state,
    });

    return fromState || fromPath || "";
  }, [location.state, location.pathname]);

  // Get quiz data and history
  const getQuizData = useCallback(async () => {
    const quizId = getQuizId();

    if (!quizId) {
      console.error("No quiz ID found");
      showSnackbar("Error: Quiz ID not found");
      return;
    }

    console.log("Fetching quiz data for ID:", quizId);
    setIsLoading(true);

    try {
      const result = await dispatch(getQuizById(quizId));
      console.log("Quiz fetch result:", result);

      if (result.payload && result.payload.success) {
        const quizData = result.payload.data;

        // Update quiz state
        quizDispatch({ type: "SET_QUIZ", payload: quizData });

        // Update quiz ID in state
        quizDispatch({ type: "SET_QUIZ_ID", payload: quizId });

        // Check for quiz history in progress data
        if (result.payload.quizProgress) {
          console.log("Found quiz progress:", result.payload.quizProgress);
          quizDispatch({
            type: "SET_QUIZ_HISTORY",
            payload: result.payload.quizProgress,
          });
        }

        console.log("Quiz data loaded successfully:", quizData);
      } else {
        console.error("Failed to fetch quiz - payload error:", result.payload);
        showSnackbar("Error loading quiz data");
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      showSnackbar("Error loading quiz");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, getQuizId]);

  // Initial data load
  useEffect(() => {
    console.log("Component mounted, loading quiz data");
    getQuizData();
  }, [getQuizData]);

  // Handle currentQuiz from Redux store (secondary source)
  useEffect(() => {
    if (currentQuiz && !quizState.quiz.questions.length) {
      console.log("Setting quiz from Redux store:", currentQuiz);
      quizDispatch({ type: "SET_QUIZ", payload: currentQuiz });
    }
  }, [currentQuiz, quizState.quiz.questions.length]);

  // Timer effect
  useEffect(() => {
    if (
      quizState.timeLeft > 0 &&
      !quizState.isSubmitted &&
      quizState.isStarted
    ) {
      const timer = setInterval(() => {
        quizDispatch({ type: "TICK_TIMER" });
      }, 1000);
      return () => clearInterval(timer);
    } else if (
      quizState.timeLeft === 0 &&
      !quizState.isSubmitted &&
      quizState.isStarted
    ) {
      handleAutoSubmit();
    }
  }, [quizState.timeLeft, quizState.isSubmitted, quizState.isStarted]);

  // Security: Prevent navigation
  useEffect(() => {
    if (!quizState.isStarted || quizState.isSubmitted) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your progress may be lost.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizState.isStarted, quizState.isSubmitted]);

  // Security: Track visibility
  useEffect(() => {
    if (!quizState.isStarted || quizState.isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        quizDispatch({ type: "SET_VISIBILITY", payload: false });
        quizDispatch({ type: "INCREMENT_WARNING" });
        setShowWarningDialog(true);
      } else {
        quizDispatch({ type: "SET_VISIBILITY", payload: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizState.isStarted, quizState.isSubmitted]);

  // Utility functions
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const getAnsweredCount = () => {
    return Object.keys(quizState.selectedAnswers).length;
  };

  const getQuestionStatus = (index) => {
    if (!quizState.selectedAnswers[index]) return "unanswered";
    if (!quizState.isSubmitted) return "answered";
    const isCorrect =
      quizState.quizProgress?.result?.quiz?.answers?.[index]?.isCorrect;
    return isCorrect ? "correct" : "incorrect";
  };

  // Event handlers
  const handleStartQuiz = () => {
    // Auto enter fullscreen when starting quiz
    if (quizContainerRef.current && !document.fullscreenElement) {
      quizContainerRef.current.requestFullscreen().catch((err) => {
        console.log("Fullscreen request failed:", err);
      });
      quizDispatch({ type: "SET_FULLSCREEN", payload: true });
    }

    quizDispatch({ type: "START_QUIZ" });
    showSnackbar("Quiz started! Good luck!");
  };

  const handleAnswerSelect = (event) => {
    const currentQuestion = quizState.quiz.questions[quizState.currentQuestion];
    const answerValue = event.target.value;

    // Kiểm tra loại câu hỏi
    if (
      currentQuestion?.type !== "single-choice" &&
      currentQuestion?.type !== "true-false"
    ) {
      console.warn(
        `handleAnswerSelect called on invalid question type: ${currentQuestion?.type}`
      );
      showSnackbar("Invalid question type for single-choice selection");
      return;
    }

    console.log("Single choice answer selected:", {
      questionIndex: quizState.currentQuestion,
      questionType: currentQuestion?.type,
      selectedAnswer: answerValue,
      previousAnswer: quizState.selectedAnswers[quizState.currentQuestion],
    });

    // Dispatch action để lưu câu trả lời
    quizDispatch({ type: "SET_ANSWER", payload: answerValue });
  };

  const handleMultipleChoiceSelect = (event) => {
    console.log("Multiple choice answer selected:", event.target.value);
    quizDispatch({ type: "SET_ANSWER", payload: event.target.value });
  };

  const handleNavigateQuestion = (direction) => {
    const newIndex = quizState.currentQuestion + direction;
    if (newIndex >= 0 && newIndex < quizState.quiz.questions.length) {
      quizDispatch({ type: "SET_CURRENT_QUESTION", payload: newIndex });
    }
  };

  const handleQuestionClick = (questionIndex) => {
    quizDispatch({ type: "SET_CURRENT_QUESTION", payload: questionIndex });
  };

  const handleSubmitAttempt = () => {
    const unansweredCount =
      quizState.quiz.questions.length - getAnsweredCount();
    if (unansweredCount > 0) {
      setShowSubmitDialog(true);
    } else {
      handleSubmit();
    }
  };

  // Hàm mới để xử lý logic completion của quiz
  const handleQuizCompletion = useCallback(
    (isCompleted, quizData = null) => {
      console.log("Quiz completion handler called:", { isCompleted, quizData });

      if (isCompleted) {
        // Xử lý logic khi quiz hoàn thành
        if (quizData) {
          // Nếu có data từ submit, cập nhật state
          quizDispatch({
            type: "SUBMIT_QUIZ",
            payload: {
              score: quizData.score,
              isPassed: quizData.isPassed,
              quizProgress: quizData.moduleItemProgress,
            },
          });
        }

        // Trigger icon change (chức năng ban đầu của onQuizSubmit)
        if (onQuizSubmit) {
          onQuizSubmit(true);
        }

        // Có thể thêm các logic khác khi quiz hoàn thành
        showSnackbar("Quiz completed successfully!");
      }
    },
    [onQuizSubmit]
  );

  const handleAutoSubmit = useCallback(async () => {
    if (quizState.isSubmitted) return; // Prevent multiple submissions

    console.log("Auto-submitting quiz due to time expiry");
    showSnackbar("Time's up! Quiz submitted automatically.");

    // Inline submit logic to avoid circular dependency
    if (quizState.isSubmitted) return;

    setIsLoading(true);

    try {
      const result = await dispatch(
        submitQuiz({
          answers: Object.values(quizState.selectedAnswers),
          timeSpent: quizState.quiz.duration - quizState.timeLeft,
          quizId: quizState.quizId,
          warningCount: quizState.warningCount,
        })
      );

      if (result.payload && result.payload.success) {
        const quizData = {
          score: result.payload.data.currentScore,
          isPassed:
            result.payload.data.moduleItemProgress?.result?.quiz?.score >=
            quizState.quiz.passingScore,
          moduleItemProgress: result.payload.data.moduleItemProgress,
        };

        // Sử dụng hàm completion handler mới
        handleQuizCompletion(true, quizData);
      }
    } catch (error) {
      console.error("Failed to auto-submit quiz:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    quizState.isSubmitted,
    quizState.selectedAnswers,
    quizState.quiz.duration,
    quizState.timeLeft,
    quizState.quizId,
    quizState.warningCount,
    quizState.quiz.passingScore,
    dispatch,
    handleQuizCompletion,
  ]);

  const handleSubmit = async () => {
    if (quizState.isSubmitted) {
      console.log("Quiz already submitted, skipping");
      return;
    }

    console.log("Submitting quiz with data:", {
      answers: Object.values(quizState.selectedAnswers),
      timeSpent: quizState.quiz.duration - quizState.timeLeft,
      quizId: quizState.quizId,
      warningCount: quizState.warningCount,
    });

    setIsLoading(true);
    setShowSubmitDialog(false);

    try {
      const result = await dispatch(
        submitQuiz({
          answers: Object.values(quizState.selectedAnswers),
          timeSpent: quizState.quiz.duration - quizState.timeLeft,
          quizId: quizState.quizId,
          warningCount: quizState.warningCount,
        })
      );

      console.log("Submit result:", result);

      if (result.payload && result.payload.success) {
        const quizData = {
          score: result.payload.data.currentScore,
          isPassed:
            result.payload.data.moduleItemProgress?.result?.quiz?.score >=
            quizState.quiz.passingScore,
          moduleItemProgress: result.payload.data.moduleItemProgress,
        };

        // Sử dụng hàm completion handler mới
        handleQuizCompletion(true, quizData);
        showSnackbar("Quiz submitted successfully!");
      } else {
        console.error("Submit failed:", result.payload);
        showSnackbar("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      showSnackbar("Error submitting quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      quizContainerRef.current?.requestFullscreen();
      quizDispatch({ type: "SET_FULLSCREEN", payload: true });
    } else {
      document.exitFullscreen();
      quizDispatch({ type: "SET_FULLSCREEN", payload: false });
    }
  };

  const handleRetakeQuiz = () => {
    quizDispatch({ type: "RESET_QUIZ" });
    showSnackbar("Quiz reset. Ready to start again!");
  };

  // Render components
  const renderStartScreen = () => (
    <Fade in timeout={800}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Quiz Info */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={8}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 60,
                      height: 60,
                      mr: 2,
                    }}
                  >
                    <QuizOutlined sx={{ fontSize: 35 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {quizState.quiz.title || "Assessment Quiz"}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      Test your knowledge and skills
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Assignment sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {quizState.quiz.questions.length}
                      </Typography>
                      <Typography variant="body2">Questions</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <AccessTime sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {formatTime(quizState.quiz.duration)}
                      </Typography>
                      <Typography variant="body2">Duration</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Grade sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {quizState.quiz.passingScore}%
                      </Typography>
                      <Typography variant="body2">Pass Score</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <TaskAlt sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {quizState.quiz.totalPoints ||
                          quizState.quiz.questions.length}
                      </Typography>
                      <Typography variant="body2">Total Points</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quiz Instructions */}
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  📋 Quiz Instructions
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Stay focused - leaving the page will trigger warnings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TimerOutlined color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Quiz will auto-submit when time expires" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="You can navigate between questions freely" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Fullscreen color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Fullscreen mode is recommended for better focus" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quiz History & Actions */}
          <Grid item xs={12} md={4}>
            {/* Previous Attempts */}
            {quizState.quizHistory && (
              <Card elevation={4} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <History color="primary" sx={{ mr: 1 }} />
                    Previous Attempts
                  </Typography>

                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Best Score:</Typography>
                      <Chip
                        label={`${quizState.quizHistory.result?.quiz?.score?.toFixed(1) || "0"}%`}
                        color={
                          quizState.quizHistory.result?.quiz?.score >=
                          quizState.quiz.passingScore
                            ? "success"
                            : "error"
                        }
                        size="small"
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Attempts:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {quizState.quizHistory.attempts || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Status:</Typography>
                      <Chip
                        label={quizState.quizHistory.status || "Not Started"}
                        color={
                          quizState.quizHistory.status === "completed"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartQuiz}
                startIcon={<Security />}
                sx={{
                  py: 2,
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
                  },
                }}
              >
                {quizState.quizHistory ? "Retake Quiz" : "Start Quiz"}
              </Button>

              {quizState.quizHistory && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    quizDispatch({ type: "SET_REVIEWING", payload: true })
                  }
                  startIcon={<Visibility />}
                >
                  Review Previous Attempt
                </Button>
              )}

              <Button
                variant="text"
                onClick={toggleFullscreen}
                startIcon={
                  quizState.isFullscreen ? <FullscreenExit /> : <Fullscreen />
                }
              >
                {quizState.isFullscreen ? "Exit" : "Enter"} Fullscreen
              </Button>
            </Stack>

            {/* Security Alert */}
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Security Notice</AlertTitle>
              This quiz monitors your activity for academic integrity purposes.
            </Alert>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );

  const renderQuestion = () => {
    if (!quizState.quiz.questions[quizState.currentQuestion]) return null;

    const question = quizState.quiz.questions[quizState.currentQuestion];
    const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];
    const isAnswerCorrect =
      quizState.isSubmitted &&
      quizState.quizProgress?.result?.quiz?.answers?.[quizState.currentQuestion]
        ?.isCorrect;

    return (
      <Slide direction="left" in key={quizState.currentQuestion} timeout={300}>
        <Card elevation={2} sx={{ minHeight: 400 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Question Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight="bold">
                Question {quizState.currentQuestion + 1}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${question?.points || 1} point${(question?.points || 1) > 1 ? "s" : ""}`}
                  color="primary"
                  variant="outlined"
                />
                {selectedAnswer && (
                  <Chip
                    label="Answered"
                    color="success"
                    size="small"
                    icon={<CheckCircle />}
                  />
                )}
              </Stack>
            </Box>

            {/* Question Type Indicator */}
            <Typography
              variant="body2"
              color="text.secondary"
              mb={2}
              fontStyle="italic"
            >
              {question?.type === "multiple-choice" &&
                "📝 Select all correct answers"}
              {question?.type === "single-choice" &&
                "🔘 Select one correct answer"}
              {question?.type === "true-false" && "✅ True or False"}
            </Typography>

            {/* Question Content */}
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                lineHeight: 1.6,
                p: 2,
                backgroundColor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              {question?.content}
            </Typography>

            {/* Review Mode Explanation */}
            {quizState.isSubmitted && (
              <Alert
                severity={isAnswerCorrect ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2">
                  {quizState.quizProgress?.result?.quiz?.answers?.[
                    quizState.currentQuestion
                  ]?.explanation ||
                    (isAnswerCorrect ? "Correct answer!" : "Incorrect answer.")}
                </Typography>
              </Alert>
            )}

            {/* Answer Options */}
            {(question?.type === "single-choice" ||
              question?.type === "true-false") && (
              <RadioGroup
                value={selectedAnswer || ""}
                onChange={handleAnswerSelect}
                name={`question-${quizState.currentQuestion}`} // Thêm name để đảm bảo tính duy nhất
              >
                <Stack spacing={2}>
                  {question?.answers?.map((answer) => (
                    <Paper
                      key={answer._id}
                      elevation={selectedAnswer === answer._id ? 3 : 1}
                      sx={{
                        p: 2,
                        backgroundColor:
                          quizState.isSubmitted && answer.isCorrect
                            ? "success.light"
                            : selectedAnswer === answer._id
                              ? "primary.light"
                              : "background.paper",
                        border:
                          selectedAnswer === answer._id
                            ? "2px solid"
                            : "1px solid",
                        borderColor:
                          selectedAnswer === answer._id
                            ? "primary.main"
                            : "grey.300",
                        cursor: quizState.isSubmitted ? "default" : "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": !quizState.isSubmitted
                          ? {
                              borderColor: "primary.main",
                              backgroundColor: "primary.lighter",
                            }
                          : {},
                      }}
                    >
                      <FormControlLabel
                        value={answer._id}
                        control={<Radio />}
                        label={answer.content}
                        disabled={quizState.isSubmitted}
                        sx={{ width: "100%", m: 0 }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            )}

            {question?.type === "multiple-choice" && (
              <Stack spacing={2}>
                {question?.answers?.map((answer) => (
                  <Paper
                    key={answer._id}
                    elevation={selectedAnswer?.includes(answer._id) ? 3 : 1}
                    sx={{
                      p: 2,
                      backgroundColor:
                        quizState.isSubmitted && answer.isCorrect
                          ? "success.light"
                          : selectedAnswer?.includes(answer._id)
                            ? "primary.light"
                            : "background.paper",
                      border: selectedAnswer?.includes(answer._id)
                        ? "2px solid"
                        : "1px solid",
                      borderColor: selectedAnswer?.includes(answer._id)
                        ? "primary.main"
                        : "grey.300",
                      cursor: quizState.isSubmitted ? "default" : "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": !quizState.isSubmitted
                        ? {
                            borderColor: "primary.main",
                            backgroundColor: "primary.lighter",
                          }
                        : {},
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectedAnswer?.includes(answer._id) || false
                          }
                          onChange={handleMultipleChoiceSelect}
                          value={answer._id}
                          disabled={quizState.isSubmitted}
                        />
                      }
                      label={answer.content}
                      sx={{ width: "100%", m: 0 }}
                    />
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Slide>
    );
  };
  // Render Question Navigator Grid - Optimized for sidebar
  const renderQuestionNavigator = () => (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        textAlign="center"
        sx={{
          fontSize: "1.1rem",
          color: "primary.main",
        }}
      >
        Question Navigator
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 1,
          mb: 3,
        }}
      >
        {quizState.quiz.questions.map((_, index) => {
          const status = getQuestionStatus(index);
          const isActive = index === quizState.currentQuestion;

          return (
            <Box
              key={index}
              onClick={() => handleQuestionClick(index)}
              sx={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid",
                borderRadius: 1,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                transition: "all 0.2s ease-in-out",
                borderColor: isActive
                  ? "primary.main"
                  : status === "answered"
                    ? "success.main"
                    : status === "correct"
                      ? "success.main"
                      : status === "incorrect"
                        ? "error.main"
                        : "grey.300",
                backgroundColor: isActive
                  ? "primary.main"
                  : status === "answered"
                    ? "success.light"
                    : status === "correct"
                      ? "success.main"
                      : status === "incorrect"
                        ? "error.main"
                        : "transparent",
                color:
                  isActive || status === "correct" || status === "incorrect"
                    ? "white"
                    : status === "answered"
                      ? "success.dark"
                      : "text.primary",
                "&:hover": {
                  backgroundColor: isActive
                    ? "primary.dark"
                    : status === "answered"
                      ? "success.main"
                      : "action.hover",
                  transform: "scale(1.05)",
                  zIndex: 10,
                  boxShadow: 2,
                },
              }}
            >
              {index + 1}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      {/* <Box sx={{ fontSize: "12px", color: "text.secondary" }}>
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "primary.main",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Current Question</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "success.light",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Answered</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Unanswered</Typography>
          </Box>

          {quizState.isSubmitted && (
            <>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: "success.main",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Correct</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: "error.main",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Incorrect</Typography>
              </Box>
            </>
          )}
        </Stack>
      </Box> */}

      <Divider sx={{ my: 2 }} />

      {/* Progress Summary */}
      <Box textAlign="center">
        <Typography
          variant="body2"
          fontWeight="bold"
          color="primary.main"
          mb={1}
        >
          Progress Summary
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="success.main"
          mb={0.5}
        >
          {getAnsweredCount()}/{quizState.quiz.questions.length}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(
            (getAnsweredCount() / quizState.quiz.questions.length) *
            100
          ).toFixed(0)}
          % Complete
        </Typography>
      </Box>
    </Paper>
  );

  const renderQuizInterface = () => (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Responsive Header */}
      <Paper elevation={2} sx={{ mb: { xs: 1, sm: 2 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={{ xs: 1, sm: 2 }}
            flexWrap="wrap"
            gap={1}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={{ xs: 1, sm: 2 }}
              flexWrap="wrap"
            >
              <Lock color="primary" />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                Quiz Assessment
              </Typography>
              {quizState.warningCount > 0 && (
                <Chip
                  label={`${quizState.warningCount} warning${quizState.warningCount > 1 ? "s" : ""}`}
                  color="warning"
                  size="small"
                  icon={<Warning />}
                />
              )}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={{ xs: 1, sm: 3 }}
              flexWrap="wrap"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <TimerOutlined
                  color={quizState.timeLeft < 300 ? "error" : "primary"}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={
                    quizState.timeLeft < 300 ? "error.main" : "text.primary"
                  }
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  {formatTime(quizState.timeLeft)}
                </Typography>
              </Box>

              <Button
                onClick={toggleFullscreen}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ minWidth: "auto", px: { xs: 1, sm: 2 } }}
              >
                {quizState.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container
        maxWidth={quizState.isFullscreen ? "xl" : "lg"}
        sx={{
          px: { xs: 1, sm: 2 },
          transition: "all 0.3s ease-in-out",
        }}
      >
        {quizState.isSubmitted && !quizState.isReviewing ? (
          <Zoom in timeout={600}>
            <Card elevation={4}>
              <CardContent sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    margin: "0 auto 16px",
                    bgcolor: quizState.isPassed ? "success.main" : "error.main",
                  }}
                >
                  {quizState.isPassed ? (
                    <CheckCircle sx={{ fontSize: { xs: 30, sm: 40 } }} />
                  ) : (
                    <Cancel sx={{ fontSize: { xs: 30, sm: 40 } }} />
                  )}
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mb={2}
                  sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                >
                  {quizState.isPassed
                    ? "🎉 Congratulations!"
                    : "📚 Keep Learning!"}
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  mb={3}
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  {quizState.isPassed
                    ? "You have successfully passed the quiz!"
                    : "You haven't reached the passing score yet."}
                </Typography>

                <Grid container spacing={2} justifyContent="center" mb={4}>
                  <Grid item xs={4} sm={3}>
                    <Paper
                      elevation={2}
                      sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={
                          quizState.isPassed ? "success.main" : "error.main"
                        }
                        sx={{ fontSize: { xs: "1.2rem", sm: "2rem" } }}
                      >
                        {quizState.score.toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                      >
                        Your Score
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Paper
                      elevation={2}
                      sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "1.2rem", sm: "2rem" } }}
                      >
                        {quizState.quiz.passingScore}%
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                      >
                        Required
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Paper
                      elevation={2}
                      sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "1.2rem", sm: "2rem" } }}
                      >
                        {formatTime(
                          quizState.quiz.duration - quizState.timeLeft
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                      >
                        Time Taken
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    onClick={() =>
                      quizDispatch({ type: "SET_REVIEWING", payload: true })
                    }
                    startIcon={<Visibility />}
                    size={quizState.isFullscreen ? "large" : "medium"}
                  >
                    Review Answers
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRetakeQuiz}
                    startIcon={<TrendingUp />}
                    size={quizState.isFullscreen ? "large" : "medium"}
                  >
                    Retake Quiz
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
        ) : (
          <Grid container spacing={3}>
            {/* Main Question Area */}
            <Grid item xs={12} lg={8}>
              {renderQuestion()}

              {/* Navigation */}
              <Paper elevation={2} sx={{ mt: 2, p: { xs: 1.5, sm: 2 } }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigateQuestion(-1)}
                    disabled={quizState.currentQuestion === 0}
                    startIcon={<ArrowBack />}
                    size={quizState.isFullscreen ? "large" : "medium"}
                  >
                    Previous
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      order: { xs: 3, sm: 2 },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    {getAnsweredCount()} of {quizState.quiz.questions.length}{" "}
                    answered
                  </Typography>

                  {quizState.currentQuestion ===
                    quizState.quiz.questions.length - 1 &&
                  !quizState.isSubmitted ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmitAttempt}
                      color="success"
                      size={quizState.isFullscreen ? "large" : "medium"}
                      startIcon={<Send />}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleNavigateQuestion(1)}
                      disabled={
                        quizState.currentQuestion ===
                        quizState.quiz.questions.length - 1
                      }
                      endIcon={<ArrowForward />}
                      size={quizState.isFullscreen ? "large" : "medium"}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Question Navigator Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: "sticky", top: 16 }}>
                {renderQuestionNavigator()}

                {/* Additional Stats Panel */}
                <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Quiz Stats
                  </Typography>

                  <Stack spacing={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">Progress:</Typography>
                      <Chip
                        label={`${((getAnsweredCount() / quizState.quiz.questions.length) * 100).toFixed(0)}%`}
                        color="primary"
                        size="small"
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">Time Remaining:</Typography>
                      <Chip
                        label={formatTime(quizState.timeLeft)}
                        color={quizState.timeLeft < 300 ? "error" : "success"}
                        size="small"
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">Current Question:</Typography>
                      <Chip
                        label={`${quizState.currentQuestion + 1}/${quizState.quiz.questions.length}`}
                        color="default"
                        size="small"
                      />
                    </Box>

                    {quizState.warningCount > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          Security Warnings:
                        </Typography>
                        <Chip
                          label={quizState.warningCount}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Dialogs */}
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
      >
        <DialogTitle>Submit Quiz Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            You have {quizState.quiz.questions.length - getAnsweredCount()}{" "}
            unanswered questions. Are you sure you want to submit your quiz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
      >
        <DialogTitle sx={{ color: "warning.main" }}>
          ⚠️ Security Warning
        </DialogTitle>
        <DialogContent>
          <Typography>
            You have navigated away from the quiz tab. This behavior may be
            considered suspicious. Please stay focused on the quiz to maintain
            academic integrity.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowWarningDialog(false)}
            variant="contained"
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );

  // Main render with responsive layout
  return (
    <Box
      ref={quizContainerRef}
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "transparent",
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading quiz...</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we prepare your quiz
          </Typography>
        </Box>
      )}

      {/* Error state */}
      {!quizState.quiz.questions.length && !isLoading && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          width="100%"
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
            <AlertTitle>Quiz Not Found</AlertTitle>
            Unable to load quiz data. Please check if the quiz exists or try
            refreshing the page.
          </Alert>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Retrying quiz data fetch");
              getQuizData();
            }}
            sx={{ mt: 2 }}
          >
            Retry Loading
          </Button>
        </Box>
      )}

      {/* Main Quiz Interface */}
      {quizState.quiz.questions.length > 0 && (
        <>
          {!quizState.isStarted ? renderStartScreen() : renderQuizInterface()}
        </>
      )}
    </Box>
  );
};

export default QuizV2;
