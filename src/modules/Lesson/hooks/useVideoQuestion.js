import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewInteractiveQuestion } from "~/store/slices/ModuleItem/action";

const useVideoQuestions = (questions, progress, videoRef) => {
  const dispatch = useDispatch();
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [dialogAlert, setDialogAlert] = useState("");
  const [lastAllowedTime, setLastAllowedTime] = useState(
    progress?.status === "completed"
      ? Infinity
      : progress?.result?.video?.lastPosition || 0
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
  const checkForQuestions = useCallback(
    (currentTime) => {
      if (
        !questions ||
        questions.length === 0 ||
        progress?.status === "completed"
      )
        return;

      const question = questions.find((q) => {
        const timeDiff = Math.abs(q.startTime - currentTime);
        return timeDiff < 0.5 && !answeredQuestions.has(q.startTime);
      });

      if (question) {
        videoRef.current.pause();
        setCurrentQuestion(question);
        setOpenQuestionDialog(true);
      }
    },
    [questions, answeredQuestions, progress, videoRef]
  );

  // Prevent seeking past unanswered questions
  const enforceQuestionBoundary = useCallback(
    (currentTime) => {
      if (currentTime > lastAllowedTime && videoRef.current) {
        videoRef.current.currentTime = lastAllowedTime;
      }
    },
    [lastAllowedTime, videoRef]
  );

  // Get the next question time for boundary enforcement
  const getNextQuestionTime = useCallback(() => {
    if (!questions || !currentQuestion) return null;

    const nextQuestion = questions.find(
      (q) =>
        q.startTime > currentQuestion.startTime &&
        !answeredQuestions.has(q.startTime)
    );

    return nextQuestion ? nextQuestion.startTime : null;
  }, [questions, currentQuestion, answeredQuestions]);

  // Handle dialog close
  const handleCloseDialog = useCallback(() => {
    setOpenQuestionDialog(false);
    setDialogAlert("");
    setCurrentQuestion(null);
    const currentPosition = videoRef.current?.currentTime || 0;
const newPosition = Math.max(0, currentPosition - 10);
    // Đảm bảo play từ đúng vị trí
    if (videoRef.current) {
      videoRef.current.currentTime = newPosition;
      videoRef.current.play();
    }

    console.log("Dialog closed at position:", currentPosition);
  }, []);

  // Handle answering questions
  const handleAnswerSubmit = useCallback(() => {
    // Validate answer selection
    if (!selectedAnswer || selectedAnswer.length === 0) {
      setDialogAlert({
        type: "error",
        message: "Please select at least one answer",
      });
      return;
    }

    // Check if answer is correct
    const correctAnswers = currentQuestion.answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer._id);

    let isCorrect = false;

    if (currentQuestion.type === "multiple") {
      isCorrect =
        correctAnswers.length === selectedAnswer.length &&
        correctAnswers.every((id) => selectedAnswer.includes(id));
    } else {
      isCorrect = correctAnswers.includes(selectedAnswer[0]);
    }

    if (isCorrect) {
      // Mark question as answered
      setAnsweredQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion.startTime);
        return newSet;
      });

      // Update allowed viewing time
      const nextQuestionTime = getNextQuestionTime();
      setLastAllowedTime(
        nextQuestionTime !== null ? nextQuestionTime : Infinity
      );

      setDialogAlert({
        type: "success",
        message: "Correct! You can continue watching the video",
      });

      // Close dialog after delay
      setTimeout(() => {
        setOpenQuestionDialog(false);

        setDialogAlert("");
      }, 1500);
    } else {
      // Create a new question if incorrect (if needed)
      dispatch(
        createNewInteractiveQuestion({ questionId: currentQuestion._id })
      );

      setDialogAlert({
        type: "error",
        message: "Your answer is incorrect. Please try again!",
      });
    }
  }, [currentQuestion, selectedAnswer, dispatch, getNextQuestionTime]);

  // Answer selection handlers
  const handleMultipleChoiceChange = useCallback((answerId) => {
    setSelectedAnswer((prev) => {
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
    handleSingleChoiceChange,
  };
};

export default useVideoQuestions;
