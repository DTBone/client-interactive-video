import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
  Fade,
  Divider,
  InputAdornment,
  Slider,
  Paper,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Description,
  Title as TitleIcon,
  VideoLibrary,
  Save,
  ArrowBack,
  ExpandMore,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow,
  Timer,
  CheckCircle,
  CheckCircleOutline,
  Warning,
  Help,
  VideoFile,
  QuestionAnswer,
  AccessTime,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "./FileUpload";
import { useNotification } from "~/Hooks/useNotification";
import QuizQuestionForm from "./QuizQuestionForm";
import { createModuleItemLecture } from "~/store/slices/ModuleItem/action";
import { useDispatch } from "react-redux";
import { toggleRefresh } from "~/store/slices/Module/moduleSlice";

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "visible",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
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

const UploadContainer = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: "12px",
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.01)",
  },
  "& video": {
    width: "100%",
    maxHeight: "400px",
    backgroundColor: "#000",
  },
}));

const VideoDuration = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.primary.main, 0.9),
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(0, 0, 0, 8),
  position: "absolute",
  top: 0,
  right: 0,
  fontWeight: 500,
  fontSize: "0.9rem",
}));

const QuestionSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 2, 1),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const TimeMarker = styled(Box)(({ theme, active, hasQuestion }) => ({
  position: "absolute",
  width: hasQuestion ? "12px" : "2px",
  height: hasQuestion ? "12px" : "14px",
  backgroundColor: hasQuestion
    ? active
      ? theme.palette.secondary.main
      : theme.palette.primary.main
    : alpha(theme.palette.text.secondary, 0.3),
  bottom: hasQuestion ? "20px" : "24px",
  borderRadius: hasQuestion ? "50%" : 0,
  transform: "translateX(-50%)",
  zIndex: 5,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: hasQuestion
      ? theme.palette.secondary.dark
      : alpha(theme.palette.text.secondary, 0.5),
    transform: hasQuestion
      ? "translateX(-50%) scale(1.3)"
      : "translateX(-50%) scale(1)",
  },
}));

const QuestionCard = styled(Card)(({ theme, active }) => ({
  position: "relative",
  borderLeft: `4px solid ${active ? theme.palette.secondary.main : theme.palette.primary.main}`,
  transition: "all 0.2s ease",
  marginBottom: theme.spacing(2),
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
}));

const LectureEnhanced = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const { showNotice } = useNotification();
  const { courseId, moduleId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoKey, setVideoKey] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // State for form errors/validation
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    file: "",
  });

  // State để lưu trữ form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lecture",
    contentType: "Video",
    icon: "video",
    file: null,
    duration: 0,
    questions: [],
  });

  // Calculate completion percentage for progress bar
  const getFormCompletionPercentage = () => {
    let completed = 0;
    let total = 3; // title, description, file

    if (formData.title?.trim()) completed++;
    if (formData.description?.trim()) completed++;
    if (formData.file) completed++;

    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    // Cleanup URL khi component unmount hoặc file thay đổi
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // Improved input change handler with validation
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;

    // Clear any existing form error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Enhanced file change handler with validation
  const handleFileChange = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        setFormErrors((prev) => ({
          ...prev,
          file: "Please select a valid video file (MP4 or WebM)",
        }));
        showNotice("error", "Please select a valid video file");
        return;
      }

      // Clear any file error
      setFormErrors((prev) => ({
        ...prev,
        file: "",
      }));

      // Cleanup old preview if exists
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      setVideoKey((prevKey) => prevKey + 1);

      // Reset questions when new video is uploaded
      setFormData((prev) => ({
        ...prev,
        file: file,
        questions: [],
      }));

      setActiveQuestionIndex(-1);
    } else {
      setVideoPreview("");
      setFormData((prev) => ({
        ...prev,
        file: null,
        duration: 0,
        questions: [],
      }));
    }
  };

  // Video load handler with duration calculation
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setFormData((prev) => ({
        ...prev,
        duration: duration,
      }));
    }
  };

  // Format time from seconds to readable format (HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  // Format duration for display
  const formatDuration = (totalSeconds) => {
    if (totalSeconds <= 0) return "0 seconds";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const parts = [];

    if (hours > 0) parts.push(`${hours} hours`);
    if (minutes > 0) parts.push(`${minutes} minutes `);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} seconds`);

    return parts.join(" ");
  };

  // Handle seeking in video timeline
  const handleTimelineClick = (event) => {
    if (!videoRef.current || !formData.duration) return;

    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const time = formData.duration * percentage;

    // Set video to that time
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Add new interactive question at current time
  const addQuestion = () => {
    if (!videoRef.current || !formData.duration) {
      showNotice("error", "Please upload a video first");
      return;
    }

    const currentVideoTime = videoRef.current.currentTime;

    // Create new question
    const newQuestion = {
      questionType: "multiple-choice",
      question: "",
      startTime: currentVideoTime,
      answers: [
        { content: "", isCorrect: true },
        { content: "", isCorrect: false },
      ],
    };

    const newQuestions = [...formData.questions, newQuestion];

    // Sort questions by start time
    newQuestions.sort((a, b) => a.startTime - b.startTime);

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));

    // Set this as active question
    setActiveQuestionIndex(newQuestions.length - 1);
    setIsAddingQuestion(true);
  };

  // Remove a question
  const removeQuestion = (index) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this question?")) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);

      setFormData((prev) => ({
        ...prev,
        questions: newQuestions,
      }));

      // Adjust active question index if needed
      if (activeQuestionIndex >= newQuestions.length) {
        setActiveQuestionIndex(newQuestions.length - 1);
      } else if (activeQuestionIndex === index) {
        setActiveQuestionIndex(-1);
      }

      showNotice("info", "Question removed");
    }
  };

  // Update question data
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = formData.questions.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    });

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Update answer for a question
  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = formData.questions.map((q, qIndex) => {
      if (qIndex === questionIndex) {
        const updatedAnswers = q.answers.map((a, aIndex) => {
          if (aIndex === answerIndex) {
            return { ...a, [field]: value };
          }
          return a;
        });

        return { ...q, answers: updatedAnswers };
      }
      return q;
    });

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Add a new answer to a question
  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = formData.questions.map((q, qIndex) => {
      if (qIndex === questionIndex) {
        return {
          ...q,
          answers: [...q.answers, { content: "", isCorrect: false }],
        };
      }
      return q;
    });

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Remove an answer from a question
  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const question = formData.questions[questionIndex];

    // Don't allow removal if only 2 answers remain
    if (question.answers.length <= 2) {
      showNotice("warning", "A question must have at least 2 answers");
      return;
    }

    const updatedQuestions = formData.questions.map((q, qIndex) => {
      if (qIndex === questionIndex) {
        const newAnswers = q.answers.filter(
          (_, aIndex) => aIndex !== answerIndex
        );

        // If we removed the only correct answer, make another answer correct
        const hasCorrectAnswer = newAnswers.some((a) => a.isCorrect);
        if (!hasCorrectAnswer && newAnswers.length > 0) {
          newAnswers[0].isCorrect = true;
        }

        return { ...q, answers: newAnswers };
      }
      return q;
    });

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Set question start time to current video position
  const setQuestionTime = (index) => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;

      const updatedQuestions = formData.questions.map((q, i) => {
        if (i === index) {
          return { ...q, startTime: time };
        }
        return q;
      });

      // Sort questions by start time
      updatedQuestions.sort((a, b) => a.startTime - b.startTime);

      setFormData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));

      // Find new index of the question after sorting
      const newIndex = updatedQuestions.findIndex(
        (q) => Math.abs(q.startTime - time) < 0.1
      );

      setActiveQuestionIndex(newIndex);
      showNotice("success", `Question time set to ${formatTime(time)}`);
    }
  };

  // Jump to a question's time in the video
  const jumpToQuestionTime = (time) => {
    if (videoRef.current && time !== undefined) {
      videoRef.current.currentTime = time;
      videoRef.current.pause();
    }
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", description: "", file: "" };

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description should be at least 10 characters";
      isValid = false;
    }

    // Validate video file
    if (!formData.file) {
      newErrors.file = "Please select a video file";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotice("error", "Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      if (formData.file instanceof File) {
        submitFormData.append("file", formData.file);
      } else {
        throw new Error("Please select a video file");
      }

      submitFormData.append("title", formData.title);
      submitFormData.append("type", formData.type);
      submitFormData.append("description", formData.description);
      submitFormData.append("contentType", formData.contentType);
      submitFormData.append("icon", formData.icon);
      submitFormData.append("duration", formData.duration);

      // Format questions for backend
      submitFormData.append("questions", JSON.stringify(formData.questions));

      console.log("Lecture created successfully:", formData);

      const res = await dispatch(
        createModuleItemLecture({
          courseId,
          moduleId,
          formData: submitFormData,
        })
      );

      if (res.error) {
        throw new Error(res.error.message);
      } else {
        showNotice("success", "Interactive lecture created successfully");
        dispatch(toggleRefresh());

        // Add slight delay before navigation for better UX
        setTimeout(() => {
          navigate(`/course-management/${courseId}/module/${moduleId}`);
        }, 800);
      }
    } catch (error) {
      showNotice("error", error.message || "Failed to create lecture");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    if (formData.title || formData.description || formData.file) {
      if (
        window.confirm(
          "Are you sure you want to cancel? All your data will be lost."
        )
      ) {
        navigate(`/course-management/${courseId}/module/${moduleId}`);
      }
    } else {
      navigate(`/course-management/${courseId}/module/${moduleId}`);
    }
  };

  // Get completion percentage
  const completionPercentage = getFormCompletionPercentage();

  return (
    <Box sx={{ p: 2, maxWidth: "1000px", mx: "auto", my: 3 }}>
      <StyledCard>
        <StyledCardHeader
          title="Create Interactive Video"
          subheader="Upload video and add interactive questions"
          avatar={<VideoLibrary fontSize="large" />}
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
          <Grid container spacing={3}>
            {/* Title field */}
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="Lecture Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange("title")}
                variant="outlined"
                placeholder="Enter an engaging title for your lecture"
                helperText={
                  formErrors.title ||
                  "A descriptive title helps students understand the content"
                }
                error={!!formErrors.title}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Description field */}
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                multiline
                rows={3}
                label="Lecture Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange("description")}
                variant="outlined"
                placeholder="Provide a detailed description of what students will learn"
                helperText={
                  formErrors.description ||
                  "A good description helps students understand the lecture objectives"
                }
                error={!!formErrors.description}
                disabled={isSubmitting}
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

            {/* Video upload */}
            <Grid item xs={12}>
              <UploadContainer>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <VideoFile color="primary" sx={{ mr: 1 }} />
                  Video File (MP4, WebM)
                  {formData.file && (
                    <Chip
                      label="Video Selected"
                      color="success"
                      size="small"
                      sx={{ ml: 2 }}
                      icon={<CheckCircleOutline fontSize="small" />}
                    />
                  )}
                </Typography>

                <FileUpload
                  onFileChange={handleFileChange}
                  accept=".mp4,.webm"
                  fileSelected={formData.file}
                />

                {formErrors.file && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, display: "flex", alignItems: "center" }}
                  >
                    <Warning fontSize="small" sx={{ mr: 0.5 }} />
                    {formErrors.file}
                  </Typography>
                )}
              </UploadContainer>
            </Grid>
          </Grid>

          {/* Video Preview and Questions */}
          {videoPreview && (
            <Fade in={true} timeout={500}>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PlayArrow color="primary" sx={{ mr: 1 }} />
                  Video Preview
                </Typography>

                <VideoContainer>
                  <video
                    key={videoKey}
                    ref={videoRef}
                    controls
                    onLoadedMetadata={handleVideoLoad}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    <source src={videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {formData?.duration > 0 && (
                    <VideoDuration>
                      <PlayArrow fontSize="small" />
                      Duration: {formatTime(formData.duration)}
                    </VideoDuration>
                  )}
                </VideoContainer>

                {/* Interactive timeline */}
                {formData.duration > 0 && (
                  <TimelineContainer>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <AccessTime
                        color="primary"
                        sx={{ mr: 1, fontSize: "1rem" }}
                      />
                      Video Timeline (click to position, then add questions)
                    </Typography>

                    <Box
                      sx={{
                        position: "relative",
                        height: "30px",
                        backgroundColor: "rgba(0,0,0,0.05)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        mb: 2,
                      }}
                      onClick={handleTimelineClick}
                    >
                      {/* Timeline progress bar */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${(currentTime / formData.duration) * 100}%`,
                          backgroundColor: "primary.main",
                          borderRadius: "4px 0 0 4px",
                          transition: "width 0.1s linear",
                        }}
                      />

                      {/* Question markers */}
                      {formData.questions.map((question, index) => {
                        const position =
                          (question.startTime / formData.duration) * 100;
                        return (
                          <TimeMarker
                            key={index}
                            hasQuestion={true}
                            active={index === activeQuestionIndex}
                            sx={{
                              left: `${position}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToQuestionTime(question.startTime);
                              setActiveQuestionIndex(index);
                            }}
                          >
                            <Tooltip
                              title={`Question at ${formatTime(question.startTime)}`}
                              arrow
                            >
                              <span />
                            </Tooltip>
                          </TimeMarker>
                        );
                      })}

                      {/* Current time marker */}
                      <Tooltip
                        title={`Current position: ${formatTime(currentTime)}`}
                        arrow
                        open={!!videoRef.current}
                        placement="top"
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: `${(currentTime / formData.duration) * 100}%`,
                            top: "-10px",
                            transform: "translateX(-50%)",
                            color: "text.secondary",
                            fontSize: "0.75rem",
                          }}
                        >
                          <Box
                            sx={{
                              width: "2px",
                              height: "40px",
                              backgroundColor: "secondary.main",
                              mx: "auto",
                            }}
                          />
                          {formatTime(currentTime)}
                        </Box>
                      </Tooltip>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <ActionButton
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={addQuestion}
                        disabled={!formData.duration}
                      >
                        Add Question at Current Time
                      </ActionButton>
                    </Box>
                  </TimelineContainer>
                )}

                {/* Questions section */}
                {formData.questions.length > 0 && (
                  <QuestionSection>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <QuestionAnswer color="primary" sx={{ mr: 1 }} />
                      Interactive Questions ({formData.questions.length})
                    </Typography>

                    {formData.questions.map((question, questionIndex) => (
                      <QuestionCard
                        key={questionIndex}
                        active={questionIndex === activeQuestionIndex}
                        sx={{ mb: 2 }}
                      >
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
                              variant="subtitle1"
                              fontWeight={500}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              Question {questionIndex + 1}
                              <Chip
                                label={`at ${formatTime(question.startTime)}`}
                                color="primary"
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={() =>
                                  jumpToQuestionTime(question.startTime)
                                }
                              />
                            </Typography>

                            <Box>
                              <Tooltip title="Set to current time" arrow>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => setQuestionTime(questionIndex)}
                                >
                                  <AccessTime />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Remove question" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeQuestion(questionIndex)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <StyledTextField
                                fullWidth
                                required
                                label="Question Text"
                                value={question.question}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "question",
                                    e.target.value
                                  )
                                }
                                multiline
                                rows={2}
                                placeholder="Enter your question here"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>Question Type</InputLabel>
                                <Select
                                  value={question.questionType}
                                  label="Question Type"
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      questionIndex,
                                      "questionType",
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value="multiple-choice">
                                    Multiple Choice
                                  </MenuItem>
                                  <MenuItem value="single-choice">
                                    Single Choice
                                  </MenuItem>
                                  <MenuItem value="true-false">
                                    True False
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Answers
                              </Typography>

                              {question.answers.map((answer, answerIndex) => (
                                <Box
                                  key={answerIndex}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: answer.isCorrect
                                      ? "success.light"
                                      : "background.paper",
                                    "&:hover": {
                                      bgcolor: answer.isCorrect
                                        ? "success.light"
                                        : "background.default",
                                    },
                                  }}
                                >
                                  <StyledTextField
                                    fullWidth
                                    size="small"
                                    label={`Answer ${answerIndex + 1}`}
                                    value={answer.content}
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        questionIndex,
                                        answerIndex,
                                        "content",
                                        e.target.value
                                      )
                                    }
                                    sx={{ mr: 2 }}
                                  />

                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={answer.isCorrect}
                                        onChange={(e) => {
                                          // For single-choice, uncheck all others
                                          if (
                                            question.questionType ===
                                              "single-choice" &&
                                            e.target.checked
                                          ) {
                                            question.answers.forEach(
                                              (_, idx) => {
                                                if (idx !== answerIndex) {
                                                  handleAnswerChange(
                                                    questionIndex,
                                                    idx,
                                                    "isCorrect",
                                                    false
                                                  );
                                                }
                                              }
                                            );
                                          }
                                          handleAnswerChange(
                                            questionIndex,
                                            answerIndex,
                                            "isCorrect",
                                            e.target.checked
                                          );
                                        }}
                                        color="success"
                                      />
                                    }
                                    label="Correct"
                                  />

                                  <Tooltip title="Remove answer" arrow>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleRemoveAnswer(
                                          questionIndex,
                                          answerIndex
                                        )
                                      }
                                      disabled={question.answers.length <= 2}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ))}

                              <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddAnswer(questionIndex)}
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1 }}
                              >
                                Add Answer
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </QuestionCard>
                    ))}
                  </QuestionSection>
                )}
              </Box>
            </Fade>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <ActionButton
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
              startIcon={<ArrowBack />}
            >
              Cancel
            </ActionButton>

            <ActionButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || completionPercentage !== 100}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save />
                )
              }
            >
              {isSubmitting ? "Creating..." : "Create Interactive Video"}
            </ActionButton>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default LectureEnhanced;
