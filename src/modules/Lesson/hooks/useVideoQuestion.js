

import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { updateInteractiveQuestion } from "~/store/slices/ModuleItem/action";

const useVideoQuestions = (questions, progress, videoRef) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { lecture } = useSelector((state) => state.quiz);

  // State management
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [dialogAlert, setDialogAlert] = useState("");
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Progress tracking
  const [lastAllowedTime, setLastAllowedTime] = useState(() => {
    if (progress?.status === "completed") return Infinity;
    return progress?.result?.video?.lastPosition || 0;
  });

  // Redux state
  const currQuestion = useSelector((state) => state.moduleItem.currentQuestion);
  const loading = useSelector((state) => state.moduleItem.loading);

  // Refs for cleanup and state management
  const timeoutRef = useRef(null);
  const lastCheckTimeRef = useRef(0);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Sync with Redux state
  useEffect(() => {
    if (currQuestion && currQuestion !== currentQuestion) {
      setCurrentQuestion(currQuestion);
    }
  }, [currQuestion, currentQuestion]);

  // Reset answers when question changes
  useEffect(() => {
    if (currentQuestion && selectedAnswer.length > 0) {
      setSelectedAnswer([]);
      setDialogAlert("");
      console.log("Reset answers for new question:", currentQuestion.question);
    }
  }, [currentQuestion?._id]);

  // Lấy câu hỏi ngẫu nhiên từ history (trừ câu hỏi mặc định)
  const getRandomQuestionFromHistory = useCallback((question) => {
    if (!question?.history || !Array.isArray(question.history)) {
      return null;
    }

    // Lọc ra các câu hỏi không phải là câu hỏi mặc định
    // Câu hỏi mặc định có question giống với question chính
    const alternativeQuestions = question.history.filter(
      (historyItem) => historyItem.question !== question.question
    );

    if (alternativeQuestions.length === 0) {
      return null;
    }

    // Chọn ngẫu nhiên một câu hỏi
    const randomIndex = Math.floor(Math.random() * alternativeQuestions.length);
    return alternativeQuestions[randomIndex];
  }, []);

  // Tìm câu hỏi đang in-progress từ history (trừ câu hỏi mặc định)
  const findInProgressQuestionFromHistory = useCallback((question) => {
    if (!question?.history || !Array.isArray(question.history)) {
      return null;
    }

    // Sắp xếp lịch sử theo thời gian gần nhất
    const sortedHistory = [...question.history].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Tìm câu hỏi in-progress không phải là câu hỏi mặc định
    const inProgressQuestion = sortedHistory.find(
      (historyItem) =>
        historyItem.status === "in-progress" &&
        historyItem.question !== question.question // Không phải câu hỏi mặc định
    );

    return inProgressQuestion || null;
  }, []);

  // Enhanced history check với logic mới
  const checkQuestionHistory = useCallback(
    (question) => {
      if (!question || !question.history || !Array.isArray(question.history)) {
        return { hasHistory: false, status: "not-started" };
      }

      console.log("Checking question history:", question.history);

      // Kiểm tra có câu hỏi in-progress không (trừ câu hỏi mặc định)
      const inProgressQuestion = findInProgressQuestionFromHistory(question);
      if (inProgressQuestion) {
        console.log(
          "Found in-progress question from history:",
          inProgressQuestion
        );
        return {
          hasHistory: true,
          status: "in-progress",
          record: inProgressQuestion,
          alternativeQuestion: inProgressQuestion,
        };
      }

      // Sắp xếp lịch sử theo thời gian gần nhất
      const sortedHistory = [...question.history].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Lấy trạng thái gần nhất của câu hỏi mặc định
      const latestDefaultRecord = sortedHistory.find(
        (item) => item.question === question.question
      );

      if (!latestDefaultRecord) {
        return { hasHistory: false, status: "not-started" };
      }

      // Nếu đã hoàn thành (trả lời đúng) -> bỏ qua câu hỏi
      if (
        latestDefaultRecord.status === "completed" ||
        latestDefaultRecord.isCorrect === true
      ) {
        return {
          hasHistory: true,
          status: "completed",
          record: latestDefaultRecord,
        };
      }

      // Nếu đang làm dở hoặc đã sai -> hiển thị với trạng thái unanswered
      if (
        latestDefaultRecord.status === "unanswered" ||
        latestDefaultRecord.isCorrect === false
      ) {
        return {
          hasHistory: true,
          status: "unanswered",
          record: latestDefaultRecord,
        };
      }

      // Mặc định
      return {
        hasHistory: true,
        status: latestDefaultRecord.status || "not-started",
        record: latestDefaultRecord,
      };
    },
    [findInProgressQuestionFromHistory]
  );

  // Question detection with enhanced logic
  const checkForQuestions = useCallback(
    (currentTime) => {
      // Skip if conditions not met
      if (
        !questions?.length ||
        progress?.status === "completed" ||
        openQuestionDialog ||
        Math.abs(currentTime - lastCheckTimeRef.current) < 0.1 // Debounce
      ) {
        return;
      }

      lastCheckTimeRef.current = currentTime;

      const question = questions.find((q) => {
        const timeDiff = Math.abs(q.startTime - currentTime);
        return timeDiff < 0.5 && !answeredQuestions.has(q._id);
      });

      if (question && question._id !== currentQuestion?._id) {
        console.log("Question triggered at:", currentTime, question);

        const historyCheck = checkQuestionHistory(question);
        console.log("Question history check:", historyCheck);

        // Nếu câu hỏi đã hoàn thành, bỏ qua và đánh dấu là đã trả lời
        if (historyCheck.status === "completed") {
          console.log(
            "Question already completed, marking as answered:",
            question._id
          );
          setAnsweredQuestions((prev) => new Set([...prev, question._id]));
          return;
        }

        // Pause video
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
        console.log("Video paused for question:", question);

        // Tạo câu hỏi để hiển thị
        let questionToShow = { ...question, status: historyCheck.status };

        // Nếu có câu hỏi in-progress từ history, sử dụng câu hỏi đó
        if (historyCheck.alternativeQuestion) {
          questionToShow = {
            ...question, // Giữ nguyên _id và startTime của câu hỏi gốc
            question: historyCheck.alternativeQuestion.question,
            answers: historyCheck.alternativeQuestion.answers,
            status: "in-progress",
            isAlternative: true, // Đánh dấu đây là câu hỏi thay thế
            originalQuestion: question.question, // Lưu câu hỏi gốc để tham khảo
          };
          console.log(
            "Using in-progress question from history:",
            questionToShow
          );
        }

        // Set question state
        setCurrentQuestion(questionToShow);
        console.log("current question:", questionToShow);
        console.log("current question:", currQuestion);
        setSelectedAnswer([]);
        setDialogAlert("");
        setOpenQuestionDialog(true);
      }
    },
    [
      questions,
      answeredQuestions,
      progress,
      videoRef,
      openQuestionDialog,
      currentQuestion,
      checkQuestionHistory,
    ]
  );

  // Enforce video boundary
  const enforceQuestionBoundary = useCallback(
    (currentTime) => {
      if (
        currentTime > lastAllowedTime &&
        videoRef.current &&
        lastAllowedTime !== Infinity
      ) {
        console.log(
          "Seeking blocked at:",
          currentTime,
          "allowed:",
          lastAllowedTime
        );
        videoRef.current.currentTime = lastAllowedTime;
      }
    },
    [lastAllowedTime, videoRef]
  );

  // Get next unanswered question time
  const getNextQuestionTime = useCallback(() => {
    if (!questions?.length || !currentQuestion) return null;

    const nextQuestion = questions
      .filter(
        (q) =>
          q.startTime > currentQuestion.startTime &&
          !answeredQuestions.has(q._id)
      )
      .sort((a, b) => a.startTime - b.startTime)[0];

    return nextQuestion?.startTime || null;
  }, [questions, currentQuestion, answeredQuestions]);

  // Validation helpers
  const validateAnswerSelection = useCallback((question, selected) => {
    // Check if any answer is selected
    if (!selected?.length) {
      return {
        isValid: false,
        message: "Please select at least one answer",
      };
    }

    // Validate based on question type
    switch (question.questionType) {
      case "single-choice":
      case "true-false":
        if (selected.length > 1) {
          return {
            isValid: false,
            message: "Please select only one answer",
          };
        }
        break;

      case "multiple-choice":
        // Multiple selections allowed
        break;

      default:
        console.warn("Unknown question type:", question.questionType);
        break;
    }

    return { isValid: true };
  }, []);

  const getCorrectAnswerIds = useCallback((question) => {
    return (
      question.answers
        ?.filter((answer) => answer.isCorrect)
        ?.map((answer) => answer._id) || []
    );
  }, []);

  const checkAnswerCorrectness = useCallback(
    (question, selected) => {
      const correctAnswers = getCorrectAnswerIds(question);

      if (!correctAnswers.length) {
        console.warn("No correct answers found for question");
        return false;
      }

      switch (question.questionType) {
        case "multiple-choice":
          // All correct answers must be selected, no incorrect ones
          return (
            correctAnswers.length === selected.length &&
            correctAnswers.every((id) => selected.includes(id)) &&
            selected.every((id) => correctAnswers.includes(id))
          );

        case "single-choice":
        case "true-false":
          // Exactly one correct answer
          return selected.length === 1 && correctAnswers.includes(selected[0]);

        default:
          // Default to single choice logic
          return selected.length === 1 && correctAnswers.includes(selected[0]);
      }
    },
    [getCorrectAnswerIds]
  );

  // Enhanced answer submission handler
  const handleAnswerSubmit = useCallback(() => {
    // Prevent double submission
    if (isProcessingAnswer || !currentQuestion) {
      return;
    }

    console.log("Submitting answer:", {
      question: currentQuestion.question,
      selected: selectedAnswer,
      type: currentQuestion.questionType,
      status: currentQuestion.status,
      isAlternative: currentQuestion.isAlternative,
    });

    // Validate selection
    const validation = validateAnswerSelection(currentQuestion, selectedAnswer);
    if (!validation.isValid) {
      setDialogAlert(validation.message);
      return;
    }

    setIsProcessingAnswer(true);

    // Check correctness
    const isCorrect = checkAnswerCorrectness(currentQuestion, selectedAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  }, [
    currentQuestion,
    selectedAnswer,
    isProcessingAnswer,
    validateAnswerSelection,
    checkAnswerCorrectness,
  ]);

  // Handle correct answer
  const handleCorrectAnswer = useCallback(() => {
    console.log("Correct answer submitted");

    // Mark question as answered
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion._id]));

    dispatch(
      updateInteractiveQuestion({
        currentQuestion,
        selectedAnswer,
        moduleItemId: location.state?.item?._id,
        status: "correct",
        videoId: location.state?.item?.video,
      })
    );

    // Update allowed time
    const nextQuestionTime = getNextQuestionTime();
    const newAllowedTime = nextQuestionTime ?? Infinity;
    setLastAllowedTime(newAllowedTime);

    // Show success message
    setDialogAlert("Correct! You can continue watching the video");

    // Auto-close and resume video
    timeoutRef.current = setTimeout(() => {
      setOpenQuestionDialog(false);
      setCurrentQuestion(null);
      setSelectedAnswer([]);
      setDialogAlert("");
      setIsProcessingAnswer(false);

      // Resume video
      if (videoRef.current?.paused) {
        videoRef.current.play().catch((error) => {
          console.warn("Could not auto-play video:", error);
        });
      }
    }, 1500);
  }, [
    currentQuestion,
    getNextQuestionTime,
    videoRef,
    dispatch,
    location,
    selectedAnswer,
  ]);

  // Enhanced incorrect answer handler
  const handleIncorrectAnswer = useCallback(() => {
    console.log("Incorrect answer submitted");

    // Tìm câu hỏi gốc từ questions array
    const originalQuestion = questions.find(
      (q) => q._id === currentQuestion._id
    );

    dispatch(
      updateInteractiveQuestion({
        currentQuestion,
        selectedAnswer,
        moduleItemId: location.state?.item?._id,
        status: "incorrect",
        videoId: location.state?.item?.video,
      })
    );

    // Nếu đang trả lời câu hỏi thay thế và trả lời sai
    if (currentQuestion.isAlternative) {
      console.log(
        "Incorrect answer for alternative question, showing another alternative"
      );

      // Lấy một câu hỏi thay thế khác từ history
      const anotherAlternative = getRandomQuestionFromHistory(originalQuestion);

      if (
        anotherAlternative &&
        anotherAlternative.question !== currentQuestion.question
      ) {
        // Hiển thị câu hỏi thay thế khác
        const newAlternativeQuestion = {
          ...originalQuestion,
          question: anotherAlternative.question,
          answers: anotherAlternative.answers,
          status: "in-progress",
          isAlternative: true,
          originalQuestion: originalQuestion.question,
        };

        setCurrentQuestion(newAlternativeQuestion);
        setSelectedAnswer([]);
        setDialogAlert("Incorrect answer. Here's another question to try!");
        setIsProcessingAnswer(false);

        // Clear message after delay
        timeoutRef.current = setTimeout(() => {
          setDialogAlert("");
        }, 2000);

        return;
      }
    }

    // Logic cũ cho câu hỏi mặc định hoặc khi không có câu hỏi thay thế
    if (!currentQuestion.isAlternative) {
      // Nếu trả lời sai câu hỏi mặc định, chọn một câu hỏi thay thế
      const alternativeQuestion =
        getRandomQuestionFromHistory(originalQuestion);

      if (alternativeQuestion) {
        console.log(
          "Showing alternative question after wrong answer:",
          alternativeQuestion
        );

        const newAlternativeQuestion = {
          ...originalQuestion,
          question: alternativeQuestion.question,
          answers: alternativeQuestion.answers,
          status: "in-progress",
          isAlternative: true,
          originalQuestion: originalQuestion.question,
        };

        setCurrentQuestion(newAlternativeQuestion);
        setSelectedAnswer([]);
        setDialogAlert(
          "Incorrect answer. Please try this alternative question!"
        );
        setIsProcessingAnswer(false);

        // Clear message after delay
        timeoutRef.current = setTimeout(() => {
          setDialogAlert("");
        }, 2000);

        return;
      }
    }

    // Fallback: hiển thị lại câu hỏi hiện tại
    setDialogAlert("Incorrect answer. Please try again!");
    setSelectedAnswer([]);
    setIsProcessingAnswer(false);

    // Clear error message after delay
    timeoutRef.current = setTimeout(() => {
      setDialogAlert("");
    }, 2000);
  }, [
    currentQuestion,
    selectedAnswer,
    dispatch,
    location,
    questions,
    getRandomQuestionFromHistory,
  ]);

  // Dialog close handler
  const handleCloseDialog = useCallback(() => {
    cleanup();

    setOpenQuestionDialog(false);
    setCurrentQuestion(null);
    setSelectedAnswer([]);
    setDialogAlert("");
    setIsProcessingAnswer(false);

    // Rewind video slightly and play
    const currentTime = videoRef.current.currentTime;
    const rewindTime = Math.max(0, currentTime - 10);

    videoRef.current.currentTime = rewindTime;
    videoRef.current.play().catch((error) => {
      console.warn("Could not play video after dialog close:", error);
    });
    console.log("Question dialog closed");
  }, [cleanup, videoRef]);

  // Answer selection handlers
  const handleMultipleChoiceChange = useCallback(
    (answerId) => {
      if (isProcessingAnswer) return;

      setSelectedAnswer((prev) => {
        const isSelected = prev.includes(answerId);
        if (isSelected) {
          return prev.filter((id) => id !== answerId);
        } else {
          return [...prev, answerId];
        }
      });
    },
    [isProcessingAnswer]
  );

  const handleSingleChoiceChange = useCallback(
    (event) => {
      if (isProcessingAnswer) return;

      const value = event.target.value;
      setSelectedAnswer([value]);
    },
    [isProcessingAnswer]
  );

  // Return hook interface
  return {
    // State
    openQuestionDialog,
    currentQuestion,
    selectedAnswer,
    answeredQuestions,
    dialogAlert,
    loading,
    lastAllowedTime,
    isProcessingAnswer,

    // Handlers
    checkForQuestions,
    enforceQuestionBoundary,
    handleAnswerSubmit,
    handleCloseDialog,
    handleMultipleChoiceChange,
    handleSingleChoiceChange,
    checkQuestionHistory,

    // Utilities
    getCorrectAnswerIds: () =>
      currentQuestion ? getCorrectAnswerIds(currentQuestion) : [],
    getNextQuestionTime,
    getRandomQuestionFromHistory,
    findInProgressQuestionFromHistory,
  };
};

export default useVideoQuestions;
