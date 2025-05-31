import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    TextField, Button, Paper, Box, Typography, Card, CardContent, CardHeader,
    CircularProgress, Divider, Grid, Alert, IconButton, Tooltip, 
    InputAdornment, LinearProgress, Chip, Fade, Collapse, FormControl,
    InputLabel, Select, MenuItem, Switch, FormControlLabel, Modal
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
    VideoLibrary, Title as TitleIcon, Description, Save, ArrowBack,
    Edit, CheckCircleOutline, PlayArrow, PauseCircle, VideoFile,
    CloudUpload, QuestionAnswer, Warning as WarningIcon, Add as AddIcon,
    Delete as DeleteIcon, AccessTime, CheckCircle, Help, Timer, RadioButtonChecked
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useNotification } from '~/hooks/useNotification';
import QuizQuestionForm from './QuizQuestionForm';
import { createModuleItemLecture, editLectureByItemId } from '~/store/slices/ModuleItem/action';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
    overflow: 'visible',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
    }
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiCardHeader-title': {
        fontSize: '1.5rem',
        fontWeight: 600
    },
}));

const FormContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3, 2, 1),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
}));

const TimeMarker = styled(Box)(({ theme, active, hasQuestion }) => ({
    position: 'absolute',
    width: hasQuestion ? '12px' : '2px',
    height: hasQuestion ? '12px' : '14px',
    backgroundColor: hasQuestion 
        ? active ? theme.palette.secondary.main : theme.palette.primary.main 
        : alpha(theme.palette.text.secondary, 0.3),
    bottom: hasQuestion ? '20px' : '24px',
    borderRadius: hasQuestion ? '50%' : 0,
    transform: 'translateX(-50%)',
    zIndex: 5,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: hasQuestion 
            ? theme.palette.secondary.dark
            : alpha(theme.palette.text.secondary, 0.5),
        transform: hasQuestion ? 'translateX(-50%) scale(1.3)' : 'translateX(-50%) scale(1)',
    }
}));

const QuestionCard = styled(Card)(({ theme, active }) => ({
    position: 'relative',
    borderLeft: `4px solid ${active ? theme.palette.secondary.main : theme.palette.primary.main}`,
    transition: 'all 0.2s ease',
    marginBottom: theme.spacing(2),
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
    }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    boxShadow: 'none',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
}));

const VideoContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginTop: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.01)',
    },
    '& video': {
        borderRadius: '12px',
        width: '100%',
        maxHeight: '400px',
        objectFit: 'contain',
        backgroundColor: '#000',
    }
}));

const VideoDuration = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
    borderRadius: '20px',
    padding: theme.spacing(0.5, 2),
    fontSize: '0.875rem',
    fontWeight: 600,
    marginTop: theme.spacing(1),
    '& svg': {
        marginRight: theme.spacing(0.5),
    }
}));

const UploadContainer = styled(Box)(({ theme }) => ({
    border: `1px dashed ${theme.palette.primary.main}`,
    borderRadius: '12px',
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }
}));

const QuestionSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    borderRadius: theme.spacing(1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    marginTop: theme.spacing(3),
}));

const EditLecture = ({ moduleItem }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const { showNotice } = useNotification();
    const { courseId, moduleId } = useParams();
    const { refresh } = useSelector((state) => state.module);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // State for video interaction
    const [currentTime, setCurrentTime] = useState(0);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [videoKey, setVideoKey] = useState(0);
    
    // State for form validation errors
    const [formErrors, setFormErrors] = useState({
        title: '',
        description: '',
        file: ''
    });

    // State for loading indicators
    const [isLoading, setIsLoading] = useState(false);
    
    // State to store video preview URL
    const [videoPreview, setVideoPreview] = useState('');

    const clearFormData = () => {
        setFormData({
            title: '',
            description: '',
            type: 'lecture',
            contentType: 'Video',
            icon: 'video',
            file: null,
            duration: 0,
            questions: {
                index: null,
                questionType: null,
                question: null,
                startTime: null,
                answers: [
                    { content: null, isCorrect: null },
                    { content: null, isCorrect: null },
                ],
            }
        });
        setHasChanges(false);
    };
    
    // Reset form when refresh changes
    useEffect(() => {
        clearFormData();
    }, [refresh]);
    
    // Clean up resources on unmount
    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    // State to store form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'lecture',
        contentType: 'Video',
        icon: 'video',
        file: null,
        duration: 0,
        questions: {
            index: null,
            questionType: null,
            question: null,
            startTime: null,
            answers: [
                { content: null, isCorrect: null },
                { content: null, isCorrect: null },
            ],
        }
    });
    
    // Calculate form completion percentage for progress bar
    const getFormCompletionPercentage = () => {
        let completed = 0;
        let total = 3; // title, description, file
        
        if (formData.title?.trim()) completed++;
        if (formData.description?.trim()) completed++;
        if (formData.file) completed++;
        
        return Math.round((completed / total) * 100);
    };
      // Function to format video duration in MM:SS format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    
    // Format time for display in HH:MM:SS format if hours > 0, otherwise MM:SS
    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
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
            showNotice('error', 'Please upload a video first');
            return;
        }
        
        const currentVideoTime = videoRef.current.currentTime;
        
        // Create new question structure compatible with existing question format
        const newQuestion = {
            questionType: 'multiple-choice',
            question: '',
            startTime: currentVideoTime,
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false },
            ]
        };
        
        // Get current questions or initialize as empty array if not defined properly
        const currentQuestions = Array.isArray(formData.questions) 
            ? [...formData.questions] 
            : [];
        
        const newQuestions = [...currentQuestions, newQuestion];
        
        // Sort questions by start time
        newQuestions.sort((a, b) => a.startTime - b.startTime);
        
        setFormData(prev => ({
            ...prev,
            questions: newQuestions
        }));
        
        // Set this as active question
        const newIndex = newQuestions.findIndex(q => Math.abs(q.startTime - currentVideoTime) < 0.1);
        setActiveQuestionIndex(newIndex !== -1 ? newIndex : newQuestions.length - 1);
        setHasChanges(true);
        showNotice('success', 'New question added');
    };

    // Remove a question
    const removeQuestion = (index) => {
        // Confirm deletion
        if (window.confirm('Are you sure you want to delete this question?')) {
            // Ensure questions is an array
            const questions = Array.isArray(formData.questions) 
                ? [...formData.questions] 
                : [];
            
            const newQuestions = questions.filter((_, i) => i !== index);
            
            setFormData(prev => ({
                ...prev,
                questions: newQuestions
            }));
            
            // Adjust active question index if needed
            if (activeQuestionIndex >= newQuestions.length) {
                setActiveQuestionIndex(newQuestions.length - 1);
            } else if (activeQuestionIndex === index) {
                setActiveQuestionIndex(-1);
            }
            
            showNotice('info', 'Question removed');
            setHasChanges(true);
        }
    };
    
    // Update question data
    const handleQuestionChange = (index, field, value) => {
        // Ensure questions is an array
        const questions = Array.isArray(formData.questions) 
            ? [...formData.questions] 
            : [];
            
        const updatedQuestions = questions.map((q, i) => {
            if (i === index) {
                return { ...q, [field]: value };
            }
            return q;
        });
        
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        
        setHasChanges(true);
    };
    
    // Update answer for a question
    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        // Ensure questions is an array
        const questions = Array.isArray(formData.questions) 
            ? [...formData.questions] 
            : [];
            
        const updatedQuestions = questions.map((q, qIndex) => {
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
        
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        
        setHasChanges(true);
    };
    
    // Add a new answer to a question
    const handleAddAnswer = (questionIndex) => {
        // Ensure questions is an array
        const questions = Array.isArray(formData.questions) 
            ? [...formData.questions] 
            : [];
            
        const updatedQuestions = questions.map((q, qIndex) => {
            if (qIndex === questionIndex) {
                return {
                    ...q,
                    answers: [...q.answers, { content: '', isCorrect: false }]
                };
            }
            return q;
        });
        
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        
        setHasChanges(true);
    };
    
    // Remove an answer from a question
    const handleRemoveAnswer = (questionIndex, answerIndex) => {
        // Ensure questions is an array
        const questions = Array.isArray(formData.questions) 
            ? [...formData.questions] 
            : [];
            
        const question = questions[questionIndex];
        
        // Don't allow removal if only 2 answers remain
        if (question.answers.length <= 2) {
            showNotice('warning', 'A question must have at least 2 answers');
            return;
        }
        
        const updatedQuestions = questions.map((q, qIndex) => {
            if (qIndex === questionIndex) {
                const newAnswers = q.answers.filter((_, aIndex) => aIndex !== answerIndex);
                
                // If we removed the only correct answer, make another answer correct
                const hasCorrectAnswer = newAnswers.some(a => a.isCorrect);
                if (!hasCorrectAnswer && newAnswers.length > 0) {
                    newAnswers[0].isCorrect = true;
                }
                
                return { ...q, answers: newAnswers };
            }
            return q;
        });
        
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        
        setHasChanges(true);
    };
    
    // Set question start time to current video position
    const setQuestionTime = (index) => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            
            // Ensure questions is an array
            const questions = Array.isArray(formData.questions) 
                ? [...formData.questions] 
                : [];
                
            const updatedQuestions = questions.map((q, i) => {
                if (i === index) {
                    return { ...q, startTime: time };
                }
                return q;
            });
            
            // Sort questions by start time
            updatedQuestions.sort((a, b) => a.startTime - b.startTime);
            
            setFormData(prev => ({
                ...prev,
                questions: updatedQuestions
            }));
            
            // Find new index of the question after sorting
            const newIndex = updatedQuestions.findIndex(q => 
                Math.abs(q.startTime - time) < 0.1
            );
            
            setActiveQuestionIndex(newIndex);
            showNotice('success', `Question time set to ${formatTime(time)}`);
            setHasChanges(true);
        }
    };
    
    // Jump to a question's time in the video
    const jumpToQuestionTime = (time) => {
        if (videoRef.current && time !== undefined) {
            videoRef.current.currentTime = time;
            videoRef.current.pause();
        }
    };// Enhanced function to fetch video file from Minio with better error handling
    const fetchFileFromMinio = useCallback(async (url) => {
        if (!url) {
            console.error('Invalid URL provided to fetchFileFromMinio');
            return null;
        }
        
        try {
            setIsLoading(true);
            
            // Add cache control to prevent caching issues
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'video/mp4',
                    'Access-Control-Allow-Origin': '*',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const blob = await response.blob();
            
            // Extract filename from URL in a more robust way
            const urlParts = url.split('/');
            let fileName = urlParts[urlParts.length - 1];
            
            // Handle the string format from Minio
            if (fileName.includes('_')) {
                const fileNameParts = fileName.split('_');
                fileName = fileNameParts[fileNameParts.length - 1];
            } else if (fileName.length > 14) {
                fileName = fileName.substring(14);
            }
            
            console.log('Successfully fetched file:', fileName);
            
            // Determine the MIME type more robustly
            let fileType = blob.type;
            if (!fileType || fileType === 'application/octet-stream') {
                // Guess MIME type based on extension
                if (fileName.endsWith('.mp4')) {
                    fileType = 'video/mp4';
                } else if (fileName.endsWith('.webm')) {
                    fileType = 'video/webm';
                } else {
                    fileType = 'video/mp4'; // Default to mp4
                }
            }
            
            // Create File object with proper type detection
            const file = new File([blob], fileName, { type: fileType });
            
            return file;
        } catch (e) {
            console.error('Error fetching video file:', e);
            showNotice('error', `Failed to load video: ${e.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [showNotice]);
      // Load initial data from moduleItem
    useEffect(() => {
        const loadFormData = async () => {
            if (!moduleItem) {
                return;
            }
            
            try {
                setIsLoading(true);
                
                console.log('Loading module item data:', moduleItem);
                
                // Initialize form with basic data first (without the file)
                setFormData(prev => ({
                    ...prev,
                    title: moduleItem.title || '',
                    description: moduleItem.description || '',
                    duration: moduleItem?.video?.duration || 0,
                    questions: moduleItem?.video?.questions || {
                        index: null,
                        questionType: null,
                        question: null,
                        startTime: null,
                        answers: [
                            { content: null, isCorrect: null },
                            { content: null, isCorrect: null },
                        ],
                    }
                }));
                
                // Then fetch video file if available
                if (moduleItem?.video?.file) {
                    console.log('Fetching video file from URL:', moduleItem.video.file);
                    
                    // Fetch video file from server with retry mechanism
                    let videoFile = null;
                    let retryCount = 0;
                    const maxRetries = 3;
                    
                    while (!videoFile && retryCount < maxRetries) {
                        try {
                            videoFile = await fetchFileFromMinio(moduleItem.video.file);
                            if (videoFile) {
                                console.log('Video file fetched successfully:', videoFile.name);
                                break;
                            }
                        } catch (fetchErr) {
                            console.error(`Fetch attempt ${retryCount + 1} failed:`, fetchErr);
                        }
                        retryCount++;
                        if (retryCount < maxRetries) {
                            // Add a small delay before retrying
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            console.log(`Retrying fetch (${retryCount}/${maxRetries})...`);
                        }
                    }
                    
                    if (!videoFile) {
                        showNotice('error', 'Failed to load video file after multiple attempts');
                        setFormErrors(prev => ({
                            ...prev,
                            file: 'Video file could not be loaded. Try refreshing the page or contact support.'
                        }));
                    } else {
                        // Update form data with video file
                        setFormData(prev => ({
                            ...prev,
                            file: videoFile,
                        }));
                    }
                } else {
                    console.warn('No video file URL found in module item');
                    setFormErrors(prev => ({
                        ...prev,
                        file: 'No video file associated with this lecture'
                    }));
                }
                
                // Reset changes flag as this is initial data
                setHasChanges(false);
                
            } catch (err) {
                console.error('Error loading lecture data:', err);
                showNotice('error', `Failed to load lecture data: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadFormData();
    }, [moduleItem, fetchFileFromMinio, showNotice]);
    
    // Generate preview URL when file changes
    useEffect(() => {
        let objectUrl = '';
        if (formData.file) {
            objectUrl = URL.createObjectURL(formData.file);
            setVideoPreview(objectUrl);
            
            // Cleanup function to prevent memory leaks
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [formData.file]);
    
    // Handle input field changes
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        
        // Clear any error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        
        // Mark that changes have been made
        setHasChanges(true);
    };
    
    // Enhanced file change handler with validation
    const handleFileChange = (file) => {
        if (file) {
            // Validate that file is a video
            if (!file.type.startsWith('video/')) {
                showNotice('error', 'Please select a valid video file (MP4 or WebM)');
                setFormErrors(prev => ({
                    ...prev,
                    file: 'Only video files are allowed'
                }));
                return;
            }
            
            // Clear any previous file error
            setFormErrors(prev => ({
                ...prev,
                file: ''
            }));
            
            // Update form data with new file
            setFormData(prev => ({
                ...prev,
                file: file
            }));
            
            // Mark that changes have been made
            setHasChanges(true);
        }
    };

    // Handle video metadata loading to get duration
    const handleVideoLoad = () => {
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            
            setFormData(prev => ({
                ...prev,
                duration: duration
            }));
            
            console.log(`Video duration loaded: ${duration} seconds`);
        }
    };
    
    // Validate form before submission
    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '', description: '', file: '' };
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title cannot be empty';
            isValid = false;
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description cannot be empty';
            isValid = false;
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description should be at least 10 characters';
            isValid = false;
        }
        
        if (!formData.file) {
            newErrors.file = 'Please select a video file';
            isValid = false;
        }
        
        setFormErrors(newErrors);
        return isValid;
    };

    // Handle question updates from the QuizQuestionForm component
    const onUpdate = (updatedQuestions) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            questions: updatedQuestions,
        }));
        
        // Mark that changes have been made
        setHasChanges(true);
    };

    // Handle form submission with enhanced validation and UX
    const handleSubmit = async () => {
        // Validate form
        if (!validateForm()) {
            showNotice('error', 'Please fix the errors in the form');
            return;
        }
        
        // Check if video duration is available
        if (!formData.duration) {
            showNotice('error', 'Unable to determine video duration. Please try uploading the video again');
            return;
        }
        
        try {
            // Show submitting state
            setIsSubmitting(true);
            
            // Create FormData for submission
            const submitFormData = new FormData();
            
            // Add file to FormData if it's a valid File object
            if (formData.file instanceof File) {
                submitFormData.append('file', formData.file);
                console.log('Video being uploaded:', formData.file.name, formData.file.type, formData.file.size);
            } else {
                throw new Error('Invalid video file');
            }
            
            // Add other form data
            submitFormData.append('title', formData.title.trim());
            submitFormData.append('type', formData.type);
            submitFormData.append('description', formData.description.trim());
            submitFormData.append('contentType', formData.contentType);
            submitFormData.append('icon', formData.icon);
            submitFormData.append('duration', formData.duration);
            submitFormData.append('questions', JSON.stringify(formData.questions));
            
            // Submit the form data to API
            const res = await dispatch(editLectureByItemId({
                itemId: moduleItem._id,
                formData: submitFormData
            }));
            
            // Handle API response
            if (res.error) {
                showNotice('error', res.error.message || 'Failed to update lecture');
            } else {
                showNotice('success', 'Lecture updated successfully');
                dispatch(toggleRefresh());
                
                // Add slight delay for better UX
                setTimeout(() => {
                    navigate(`/course-management/${courseId}/module/${moduleId}`);
                }, 800);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotice('error', error.message || 'Failed to update lecture');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle cancel button click
    const handleCancel = () => {
        // If there are unsaved changes, ask for confirmation
        if (hasChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };
    
    // Get form completion percentage for progress bar
    const completionPercentage = getFormCompletionPercentage();

    return (
        <Box sx={{ p: 2, maxWidth: '1000px', mx: 'auto', my: 3 }}>
            <StyledCard>
                <StyledCardHeader
                    title="Edit Video Lecture"
                    subheader={moduleItem?.title}
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
                            backgroundColor: 'rgba(0,0,0,0.08)',
                        }}
                    />
                    <Box
                        position="absolute"
                        right="10px"
                        top="-10px"
                        bgcolor={hasChanges ? 'info.main' : (completionPercentage === 100 ? 'success.main' : 'primary.main')}
                        color="white"
                        fontSize="12px"
                        fontWeight="bold"
                        px={1}
                        py={0.5}
                        borderRadius="10px"
                        sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >
                        {hasChanges ? 'MODIFIED' : `${completionPercentage}%`}
                    </Box>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                    {/* Loading indicator */}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading lecture data...</Typography>
                        </Box>
                    )}
                    
                    {/* Alert for changes */}
                    {hasChanges && !isLoading && (
                        <Alert 
                            severity="info"
                            sx={{ mb: 3 }}
                            icon={<Edit />}
                        >
                            You've made changes to this lecture. Don't forget to save your changes!
                        </Alert>
                    )}
                    
                    {!isLoading && (
                        <FormContainer>
                            <Grid container spacing={3}>
                                {/* Title field */}
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        required
                                        label="Lecture Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange('title')}
                                        variant="outlined"
                                        placeholder="Enter an engaging title for your lecture"
                                        helperText={formErrors.title || "A descriptive title helps students understand the content"}
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
                                        onChange={handleInputChange('description')}
                                        variant="outlined"
                                        placeholder="Provide a detailed description of what students will learn"
                                        helperText={formErrors.description || "A good description helps students understand the lecture objectives"}
                                        error={!!formErrors.description}
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Description color="primary" sx={{ alignSelf: 'flex-start', mt: 1 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                
                                {/* Video upload section */}
                                <Grid item xs={12}>
                                    <UploadContainer>
                                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
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
                                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {formErrors.file}
                                            </Typography>
                                        )}
                                    </UploadContainer>
                                </Grid>
                            </Grid>
                              {/* Video Preview */}
                            {videoPreview && !isLoading && (
                                <Fade in={true} timeout={500}>
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PlayArrow color="primary" sx={{ mr: 1 }} />
                                            Video Preview
                                        </Typography>
                                        
                                        <VideoContainer>
                                            <video
                                                ref={videoRef}
                                                controls
                                                key={videoKey}
                                                src={videoPreview?.toString()}
                                                onLoadedMetadata={handleVideoLoad}
                                                onTimeUpdate={handleTimeUpdate}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                            
                                            {formData?.duration > 0 && (
                                                <VideoDuration>
                                                    <PlayArrow fontSize="small" />
                                                    Duration: {formatDuration(formData.duration)}
                                                </VideoDuration>
                                            )}
                                        </VideoContainer>
                                        
                                        {/* Interactive timeline */}
                                        {formData.duration > 0 && (
                                            <TimelineContainer>
                                                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <AccessTime color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                                                    Video Timeline (click to position, then add questions)
                                                </Typography>
                                                
                                                <Box 
                                                    sx={{ 
                                                        position: 'relative', 
                                                        height: '30px', 
                                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        mb: 2
                                                    }}
                                                    onClick={handleTimelineClick}
                                                >
                                                    {/* Timeline progress bar */}
                                                    <Box 
                                                        sx={{ 
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 0,
                                                            height: '100%',
                                                            width: `${(currentTime / formData.duration) * 100}%`,
                                                            backgroundColor: 'primary.main',
                                                            borderRadius: '4px 0 0 4px',
                                                            transition: 'width 0.1s linear'
                                                        }}
                                                    />
                                                    
                                                    {/* Question markers */}
                                                    {Array.isArray(formData.questions) && formData.questions.map((question, index) => {
                                                        const position = (question.startTime / formData.duration) * 100;
                                                        return (
                                                            <TimeMarker 
                                                                key={index}
                                                                hasQuestion={true}
                                                                active={index === activeQuestionIndex}
                                                                sx={{ 
                                                                    left: `${position}%`
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    jumpToQuestionTime(question.startTime);
                                                                    setActiveQuestionIndex(index);
                                                                }}
                                                            >
                                                                <Tooltip title={`Question at ${formatTime(question.startTime)}`} arrow>
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
                                                        <Box sx={{ 
                                                            position: 'absolute',
                                                            left: `${(currentTime / formData.duration) * 100}%`,
                                                            top: '-10px',
                                                            transform: 'translateX(-50%)',
                                                            color: 'text.secondary',
                                                            fontSize: '0.75rem'
                                                        }}>
                                                            <Box sx={{
                                                                width: '2px',
                                                                height: '40px',
                                                                backgroundColor: 'secondary.main',
                                                                mx: 'auto'
                                                            }} />
                                                            {formatTime(currentTime)}
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
                                        
                                        {/* Interactive Questions Section */}
                                        {Array.isArray(formData.questions) && formData.questions.length > 0 && (
                                            <QuestionSection>
                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
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
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                <Typography variant="subtitle1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    Question {questionIndex + 1}
                                                                    <Chip 
                                                                        label={`at ${formatTime(question.startTime)}`}
                                                                        color="primary"
                                                                        size="small"
                                                                        sx={{ ml: 1 }}
                                                                        onClick={() => jumpToQuestionTime(question.startTime)}
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
                                                                        value={question.question || ''}
                                                                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                                                                        multiline
                                                                        rows={2}
                                                                        placeholder="Enter your question here"
                                                                    />
                                                                </Grid>
                                                                
                                                                <Grid item xs={12} sm={6}>
                                                                    <FormControl fullWidth>
                                                                        <InputLabel>Question Type</InputLabel>
                                                                        <Select
                                                                            value={question.questionType || 'multiple-choice'}
                                                                            label="Question Type"
                                                                            onChange={(e) => handleQuestionChange(questionIndex, 'questionType', e.target.value)}
                                                                        >
                                                                            <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                                                                            <MenuItem value="single-choice">Single Choice</MenuItem>
                                                                            <MenuItem value="true-false">True/False</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                
                                                                <Grid item xs={12}>
                                                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Answers</Typography>
                                                                    
                                                                    {question.answers && question.answers.map((answer, answerIndex) => (
                                                                        <Box 
                                                                            key={answerIndex}
                                                                            sx={{ 
                                                                                display: 'flex', 
                                                                                alignItems: 'center',
                                                                                mb: 1,
                                                                                p: 1,
                                                                                borderRadius: 1,
                                                                                bgcolor: answer.isCorrect ? 'success.light' : 'background.paper',
                                                                                '&:hover': {
                                                                                    bgcolor: answer.isCorrect ? 'success.light' : 'background.default'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <StyledTextField
                                                                                fullWidth
                                                                                size="small"
                                                                                label={`Answer ${answerIndex + 1}`}
                                                                                value={answer.content || ''}
                                                                                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, 'content', e.target.value)}
                                                                                sx={{ mr: 2 }}
                                                                            />
                                                                            
                                                                            <FormControlLabel
                                                                                control={
                                                                                    <Switch
                                                                                        checked={Boolean(answer.isCorrect)}
                                                                                        onChange={(e) => {
                                                                                            // For single-choice, uncheck all others
                                                                                            if (question.questionType === 'single-choice' && e.target.checked) {
                                                                                                question.answers.forEach((_, idx) => {
                                                                                                    if (idx !== answerIndex) {
                                                                                                        handleAnswerChange(questionIndex, idx, 'isCorrect', false);
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                            handleAnswerChange(questionIndex, answerIndex, 'isCorrect', e.target.checked);
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
                                                                                    onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
                                    disabled={isSubmitting || (hasChanges === false)}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </ActionButton>
                            </Box>
                        </FormContainer>
                    )}
                </CardContent>
            </StyledCard>
        </Box>
    );
};

export default EditLecture;
