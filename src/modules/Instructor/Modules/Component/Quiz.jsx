import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Paper,
  Divider,
  Grid,
  Alert,
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
  Chip,
  LinearProgress,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  QuestionMark,
  CheckCircle,
  Edit as EditIcon,
  Timer,
  Description,
  Title as TitleIcon,
  Save,
  ArrowBack,
  RadioButtonChecked,
  Assignment,
  Help,
  Check,
  Warning,
  FormatListNumbered,
  Star,
} from "@mui/icons-material";
import { useNotification } from "~/hooks/useNotification";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleRefresh } from "~/store/slices/Module/moduleSlice";
import { createModuleItemQuiz } from "~/store/slices/ModuleItem/action";

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "visible",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.15)",
  },
  marginBottom: theme.spacing(3),
}));

const QuestionCard = styled(StyledCard)(({ theme }) => ({
  position: "relative",
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  "&:hover": {
    transform: "translateY(-3px)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "& .MuiCardHeader-title": {
    fontSize: "1.5rem",
    fontWeight: 600,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.2s ease",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const QuestionNumber = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(-1.5),
  right: theme.spacing(2),
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  "& .MuiChip-label": {
    padding: theme.spacing(0, 1.5),
  },
}));

const AnswerContainer = styled(Box)(({ theme, correct }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: correct
    ? alpha(theme.palette.success.light, 0.1)
    : alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${correct ? alpha(theme.palette.success.main, 0.5) : theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: correct
      ? alpha(theme.palette.success.light, 0.15)
      : alpha(theme.palette.primary.light, 0.05),
    transform: "translateX(3px)",
  },
}));

const Quiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotice } = useNotification();
  const { courseId, moduleId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for form errors/validation
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    questions: [],
  });

  // State for active question (for better UX when editing)
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [quizData, setQuizData] = useState({
    title: "",
    type: "quiz",
    contentType: "Practice Quiz",
    icon: "quiz",
    description: "",
    duration: 1200, // 20 minutes in seconds
    passingScore: 70,
    isGrade: false,
    questions: [
      {
        orderNumber: 1,
        content: "",
        type: "single-choice",
        points: 1,
        answers: [
          { content: "", isCorrect: true },
          { content: "", isCorrect: false },
        ],
        explanation: "",
      },
    ],
  });

  // Calculate completion percentage for progress bar
  const getFormCompletionPercentage = () => {
    let totalFields = 3; // title, description, and at least one question
    let completedFields = 0;

    if (quizData.title.trim()) completedFields++;
    if (quizData.description.trim()) completedFields++;

    // Check if at least one question is complete
    const hasCompleteQuestion = quizData.questions.some(
      (q) => q.content.trim() && q.answers.some((a) => a.content.trim())
    );

    if (hasCompleteQuestion) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  // Improved quiz change handler that tracks changes and validates input
  const handleQuizChange = (field) => (event) => {
    const value = event.target.value;

    // Clear any existing form error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    const updatedQuizData = {
      ...quizData,
      [field]: value,
    };

    setQuizData(updatedQuizData);
  };

  // Enhanced validation before submitting form
  const validateForm = () => {
    const errors = {
      title: "",
      description: "",
      questions: [],
    };
    let isValid = true;

    // Validate title
    if (!quizData.title.trim()) {
      errors.title = "Quiz title is required";
      isValid = false;
    } else if (quizData.title.trim().length < 3) {
      errors.title = "Quiz title must be at least 3 characters";
      isValid = false;
    }

    // Validate description
    if (!quizData.description.trim()) {
      errors.description = "Quiz description is required";
      isValid = false;
    } else if (quizData.description.trim().length < 10) {
      errors.description =
        "Please provide a more detailed description (at least 10 characters)";
      isValid = false;
    }

    // Validate questions
    const questionErrors = quizData.questions.map((question) => {
      const qErrors = {};

      if (!question.content.trim()) {
        qErrors.content = "Question content is required";
        isValid = false;
      }

      // Check if any answer is marked as correct
      const hasCorrectAnswer = question.answers.some((ans) => ans.isCorrect);
      if (!hasCorrectAnswer) {
        qErrors.answers = "At least one answer must be marked as correct";
        isValid = false;
      }

      // Check if all answers have content
      const emptyAnswers = question.answers.some((ans) => !ans.content.trim());
      if (emptyAnswers) {
        qErrors.answerContent = "All answers must have content";
        isValid = false;
      }

      return qErrors;
    });

    errors.questions = questionErrors;
    setFormErrors(errors);

    return isValid;
  };

  // Add new question with animation effect
  const addQuestion = () => {
    // Set active question to the new one
    setActiveQuestion(quizData.questions.length);

    const newQuestion = {
      orderNumber: quizData.questions.length + 1,
      content: "",
      type: "single-choice",
      points: 1,
      answers: [
        { content: "", isCorrect: true },
        { content: "", isCorrect: false },
      ],
      explanation: "",
    };

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });

    // Scroll to the new question after a brief delay
    setTimeout(() => {
      document
        .getElementById(`question-${quizData.questions.length}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // Improved remove question handler with confirmation
  const removeQuestion = (index) => {
    // Ask for confirmation before removing the question
    if (
      quizData.questions[index].content.trim() &&
      !window.confirm("Are you sure you want to delete this question?")
    ) {
      return;
    }

    const updatedQuestions = quizData.questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, orderNumber: i + 1 }));

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });

    // Clear any errors associated with this question
    const updatedErrors = [...formErrors.questions];
    updatedErrors.splice(index, 1);

    setFormErrors({
      ...formErrors,
      questions: updatedErrors,
    });

    // Update active question if needed
    if (activeQuestion >= index && activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  // Enhanced question change handler with error clearing
  const handleQuestionChange = (questionIndex, field) => (event) => {
    const value = event.target.value;

    // Clear any existing error for this field
    if (formErrors.questions[questionIndex]?.[field]) {
      const updatedQuestionErrors = [...formErrors.questions];
      updatedQuestionErrors[questionIndex] = {
        ...updatedQuestionErrors[questionIndex],
        [field]: "",
      };

      setFormErrors({
        ...formErrors,
        questions: updatedQuestionErrors,
      });
    }

    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        return { ...question, [field]: value };
      }
      return question;
    });

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  // Function to set active question for improved UX
  const setQuestionActive = (index) => {
    setActiveQuestion(index);
  };

  // Enhanced add answer function with animation
  const addAnswer = (questionIndex) => {
    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        return {
          ...question,
          answers: [...question.answers, { content: "", isCorrect: false }],
        };
      }
      return question;
    });

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });

    // Clear any error related to not having enough answers
    if (formErrors.questions[questionIndex]?.answers) {
      const updatedQuestionErrors = [...formErrors.questions];
      updatedQuestionErrors[questionIndex] = {
        ...updatedQuestionErrors[questionIndex],
        answers: "",
      };

      setFormErrors({
        ...formErrors,
        questions: updatedQuestionErrors,
      });
    }

    // Focus on the new answer field after a brief delay
    setTimeout(() => {
      const answerCount = quizData.questions[questionIndex].answers.length;
      const inputElement = document.getElementById(
        `answer-${questionIndex}-${answerCount}`
      );
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  // Improved remove answer handler with better validation
  const removeAnswer = (questionIndex, answerIndex) => {
    // Disallow removing if there would be less than 2 answers
    if (quizData.questions[questionIndex].answers.length <= 2) {
      showNotice("warning", "A question must have at least 2 answers");
      return;
    }

    // Check if removing the only correct answer
    const isRemovingOnlyCorrectAnswer =
      quizData.questions[questionIndex].answers[answerIndex].isCorrect &&
      quizData.questions[questionIndex].answers.filter((a) => a.isCorrect)
        .length === 1;

    if (isRemovingOnlyCorrectAnswer) {
      if (
        !window.confirm(
          "You are removing the only correct answer. Another answer will be automatically marked as correct. Continue?"
        )
      ) {
        return;
      }
    }

    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedAnswers = question.answers.filter(
          (_, i) => i !== answerIndex
        );

        // If we removed the only correct answer, make the first answer correct
        if (isRemovingOnlyCorrectAnswer && updatedAnswers.length > 0) {
          updatedAnswers[0].isCorrect = true;
        }

        return { ...question, answers: updatedAnswers };
      }
      return question;
    });

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  // Enhanced answer change handler with better validation for single-choice questions
  const handleAnswerChange = (questionIndex, answerIndex, field) => (event) => {
    const value =
      field === "isCorrect" ? event.target.checked : event.target.value;

    // Clear any error related to this answer
    if (formErrors.questions[questionIndex]?.answerContent) {
      const updatedQuestionErrors = [...formErrors.questions];
      updatedQuestionErrors[questionIndex] = {
        ...updatedQuestionErrors[questionIndex],
        answerContent: "",
      };

      setFormErrors({
        ...formErrors,
        questions: updatedQuestionErrors,
      });
    }

    const updatedQuestions = quizData.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        let updatedAnswers;

        // Special handling for "single-choice" questions - only one answer can be correct
        if (
          field === "isCorrect" &&
          value === true &&
          question.type === "single-choice"
        ) {
          updatedAnswers = question.answers.map((answer, aIndex) => ({
            ...answer,
            isCorrect: aIndex === answerIndex, // Only this answer should be correct
          }));
        } else if (field === "isCorrect" && value === false) {
          // Don't allow unchecking the only correct answer
          const correctAnswersCount = question.answers.filter(
            (a) => a.isCorrect
          ).length;
          if (
            correctAnswersCount <= 1 &&
            question.answers[answerIndex].isCorrect
          ) {
            showNotice(
              "warning",
              "At least one answer must be marked as correct"
            );
            return question; // Don't update if this would leave no correct answers
          }

          updatedAnswers = question.answers.map((answer, aIndex) => {
            if (aIndex === answerIndex) {
              return { ...answer, [field]: value };
            }
            return answer;
          });
        } else {
          // Normal case for other fields or multiple-choice questions
          updatedAnswers = question.answers.map((answer, aIndex) => {
            if (aIndex === answerIndex) {
              return { ...answer, [field]: value };
            }
            return answer;
          });
        }

        return { ...question, answers: updatedAnswers };
      }
      return question;
    });

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  // Handle grade option change with visual feedback
  const handleGradeChange = (event) => {
    setQuizData({ ...quizData, isGrade: event.target.checked });
    showNotice(
      "info",
      event.target.checked
        ? "This quiz will be graded"
        : "This quiz will not be graded"
    );
  };

  // Handle cancel button to return to previous page
  const handleCancel = () => {
    if (
      quizData.title ||
      quizData.description ||
      quizData.questions.some((q) => q.content)
    ) {
      if (
        window.confirm(
          "Are you sure you want to cancel creating this quiz? All your changes will be lost."
        )
      ) {
        navigate(`/course-management/${courseId}/module/${moduleId}`);
      }
    } else {
      navigate(`/course-management/${courseId}/module/${moduleId}`);
    }
  };

  // Improved submit handler with validation
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate the form before submission
      if (!validateForm()) {
        showNotice(
          "error",
          "Please fix the errors in the form before submitting"
        );
        setIsSubmitting(false);
        return;
      }

      // Submit the quiz data
      const result = await dispatch(
        createModuleItemQuiz({ courseId, moduleId, quizData })
      );

      // Handle success or failure
      if (!result.error) {
        dispatch(toggleRefresh());
        showNotice("success", "Quiz created successfully");

        // Navigate after a short delay for better UX
        setTimeout(() => {
          navigate(`/course-management/${courseId}/module/${moduleId}`);
        }, 800);
      } else {
        throw new Error(result.error.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      showNotice("error", error.message || "Error creating quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = getFormCompletionPercentage();

  return (
    <Box sx={{ p: 2, maxWidth: "1000px", mx: "auto", my: 3 }}>
      {/* Main container */}
      <StyledCard>
        {/* Header */}
        <StyledCardHeader
          title="Create New Quiz"
          subheader="Add questions and answers to test your students' knowledge"
          avatar={<Assignment fontSize="large" />}
          action={
            <Tooltip title="Go Back" placement="top" arrow>
              <IconButton
                color="inherit"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
          }
        />

        {/* Progress bar */}
        <Box position="relative">
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 4,
              backgroundColor: "rgba(0,0,0,0.08)",
            }}
          />
          <Box
            position="absolute"
            right="10px"
            top="-10px"
            bgcolor={
              completionPercentage === 100 ? "success.main" : "primary.main"
            }
            color="white"
            fontSize="12px"
            fontWeight="bold"
            px={1}
            py={0.5}
            borderRadius="10px"
            sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          >
            {`${completionPercentage}%`}
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            {/* Quiz Basic Information */}
            <StyledCard sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "& svg": { mr: 1 },
                      }}
                    >
                      <Assignment color="primary" />
                      Quiz Information
                    </Typography>

                    <Tooltip
                      title="If enabled, quiz results will count towards the final grade"
                      arrow
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={quizData.isGrade}
                            onChange={handleGradeChange}
                            color="primary"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Star
                              fontSize="small"
                              color={quizData.isGrade ? "primary" : "disabled"}
                            />
                            <Typography>Graded Quiz</Typography>
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      required
                      label="Quiz Title"
                      name="title"
                      value={quizData.title}
                      onChange={handleQuizChange("title")}
                      error={!!formErrors.title}
                      helperText={
                        formErrors.title ||
                        "Enter a clear, descriptive title for your quiz"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      label="Quiz Description"
                      name="description"
                      value={quizData.description}
                      onChange={handleQuizChange("description")}
                      error={!!formErrors.description}
                      helperText={
                        formErrors.description ||
                        "Provide instructions and information about the quiz purpose"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description
                              color="primary"
                              sx={{ alignSelf: "flex-start", mt: 1 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      required
                      type="number"
                      label="Duration (minutes)"
                      name="duration"
                      value={quizData.duration / 60}
                      onChange={(e) =>
                        handleQuizChange("duration")({
                          target: { value: parseInt(e.target.value) * 60 || 0 },
                        })
                      }
                      inputProps={{ min: 1, max: 180, step: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Timer color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      helperText={`Time limit: ${Math.floor(quizData.duration / 60)} minutes`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      required
                      type="number"
                      label="Passing Score (%)"
                      name="passingScore"
                      value={quizData.passingScore}
                      onChange={handleQuizChange("passingScore")}
                      inputProps={{ min: 0, max: 100, step: 5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CheckCircle color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      helperText={`Students need ${quizData.passingScore}% to pass`}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Questions Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1 },
                }}
              >
                <QuestionMark color="primary" />
                Questions ({quizData.questions.length})
              </Typography>

              {/* Display question cards */}
              {quizData?.questions.map((question, questionIndex) => (
                <Zoom
                  in={true}
                  key={questionIndex}
                  style={{ transitionDelay: `${questionIndex * 100}ms` }}
                >
                  <QuestionCard
                    id={`question-${questionIndex}`}
                    onClick={() => setQuestionActive(questionIndex)}
                    sx={{
                      mb: 3,
                      transition: "all 0.2s",
                      transform:
                        activeQuestion === questionIndex
                          ? "translateY(-4px)"
                          : "none",
                      boxShadow:
                        activeQuestion === questionIndex
                          ? "0 8px 24px rgba(0, 0, 0, 0.2)"
                          : undefined,
                    }}
                  >
                    <QuestionNumber
                      label={`Question ${question.orderNumber}`}
                      icon={<FormatListNumbered fontSize="small" />}
                    />

                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: question.content
                              ? "text.primary"
                              : "text.disabled",
                          }}
                        >
                          {question.content
                            ? question.content.substring(0, 40) +
                              (question.content.length > 40 ? "..." : "")
                            : "New Question"}
                        </Typography>

                        <Tooltip title="Remove Question" arrow>
                          <span>
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(questionIndex);
                              }}
                              disabled={
                                quizData.questions.length === 1 || isSubmitting
                              }
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            required
                            label="Question Content"
                            placeholder="Enter your question here"
                            value={question.content}
                            onChange={handleQuestionChange(
                              questionIndex,
                              "content"
                            )}
                            error={
                              !!formErrors.questions[questionIndex]?.content
                            }
                            helperText={
                              formErrors.questions[questionIndex]?.content || ""
                            }
                            multiline
                            rows={2}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Question Type</InputLabel>
                            <Select
                              value={question.type}
                              label="Question Type"
                              onChange={handleQuestionChange(
                                questionIndex,
                                "type"
                              )}
                            >
                              <MenuItem value="single-choice">
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <RadioButtonChecked
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  Single Choice
                                </Box>
                              </MenuItem>
                              <MenuItem value="multiple-choice">
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <CheckCircle
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  Multiple Choice
                                </Box>
                              </MenuItem>
                              <MenuItem value="true-false">
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <CheckCircle
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  True/False
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            fullWidth
                            type="number"
                            label="Points"
                            value={question.points}
                            onChange={handleQuestionChange(
                              questionIndex,
                              "points"
                            )}
                            inputProps={{ min: 1, max: 100 }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Star color="primary" fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {/* Answers */}
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 500,
                                "& svg": { mr: 1 },
                              }}
                            >
                              <CheckCircle color="primary" fontSize="small" />
                              Answers
                            </Typography>

                            {formErrors.questions[questionIndex]?.answers && (
                              <Typography
                                color="error"
                                variant="caption"
                                sx={{ display: "block", mt: 0.5 }}
                              >
                                {formErrors.questions[questionIndex].answers}
                              </Typography>
                            )}

                            {formErrors.questions[questionIndex]
                              ?.answerContent && (
                              <Typography
                                color="error"
                                variant="caption"
                                sx={{ display: "block", mt: 0.5 }}
                              >
                                {
                                  formErrors.questions[questionIndex]
                                    .answerContent
                                }
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ ml: 2 }}>
                            {question.answers.map((answer, answerIndex) => (
                              <Fade key={answerIndex} in={true} timeout={300}>
                                <AnswerContainer correct={answer.isCorrect}>
                                  <StyledTextField
                                    id={`answer-${questionIndex}-${answerIndex}`}
                                    fullWidth
                                    label={`Answer ${answerIndex + 1}`}
                                    placeholder="Enter answer text"
                                    value={answer.content}
                                    onChange={handleAnswerChange(
                                      questionIndex,
                                      answerIndex,
                                      "content"
                                    )}
                                    variant="outlined"
                                    size="small"
                                  />

                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={answer.isCorrect}
                                        onChange={handleAnswerChange(
                                          questionIndex,
                                          answerIndex,
                                          "isCorrect"
                                        )}
                                        color="success"
                                      />
                                    }
                                    label="Correct"
                                  />

                                  <Tooltip title="Remove Answer" arrow>
                                    <span>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                          removeAnswer(
                                            questionIndex,
                                            answerIndex
                                          )
                                        }
                                        disabled={question.answers.length <= 2}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </AnswerContainer>
                              </Fade>
                            ))}

                            <Box sx={{ mt: 2, ml: 1 }}>
                              <ActionButton
                                startIcon={<AddIcon />}
                                onClick={() => addAnswer(questionIndex)}
                                variant="outlined"
                                color="primary"
                                size="small"
                              >
                                Add Answer
                              </ActionButton>
                            </Box>
                          </Box>
                        </Grid>

                        {/* Explanation */}
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Explanation (optional)"
                            placeholder="Explain why the correct answer is correct"
                            value={question.explanation}
                            onChange={handleQuestionChange(
                              questionIndex,
                              "explanation"
                            )}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Help
                                    color="primary"
                                    sx={{ alignSelf: "flex-start", mt: 1 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            helperText="This will be shown to students after they answer the question"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </QuestionCard>
                </Zoom>
              ))}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <ActionButton
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                  variant="outlined"
                  color="primary"
                >
                  Add New Question
                </ActionButton>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Action buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <ActionButton
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                startIcon={<ArrowBack />}
                disabled={isSubmitting}
              >
                Cancel
              </ActionButton>

              <ActionButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Save />
                  )
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
              </ActionButton>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Quiz;
