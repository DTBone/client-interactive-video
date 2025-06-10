import React, { useEffect, useState } from 'react';
import { 
  Typography, Select as MuiSelect, MenuItem, FormControl, 
  InputLabel, Box, Card, CardContent, CardHeader, 
  Stepper, Step, StepLabel, StepContent, Button, 
  Paper, Divider, CircularProgress, Chip, Alert, 
  IconButton, Grid, Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  MenuBook, VideoLibrary, Quiz as QuizIcon, 
  Code, ArrowForward, ArrowBack, 
  LibraryBooks, Add, Help, ArrowCircleRight,
  School, Article, Assignment
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import SelectContentType from '../Component/SelectContentType';
import Supplement from '../Component/Supplement';
import Lecture from '../Component/Lecture';
import Quiz from '../Component/Quiz';
import Programming from '../Component/Programming';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { getAllModules } from '~/store/slices/Module/action';

// Styled components for enhanced UI
const ContentTypeCard = styled(Card)(({ theme }) => ({
    maxWidth: '1000px',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease',
    overflow: 'visible',
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

const ContentTypeSelect = styled(FormControl)(({ theme }) => ({
    minWidth: 300,
    maxWidth: '100%',
    margin: theme.spacing(2, 0),
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
        },
    },
}));

const ContentTypeTabs = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
}));

const ContentTypeButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '10px',
    padding: theme.spacing(1.5, 2.5),
    transition: 'all 0.2s ease',
    fontWeight: active ? 600 : 400,
    border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.background.paper, 0.8),
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.background.paper, 0.9),
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
}));

const ContentTypeIcon = styled(Box)(({ theme, type }) => {
    const getTypeColor = (contentType) => {
        switch (contentType) {
            case 'Reading': return theme.palette.info.main;
            case 'Video': return theme.palette.success.main;
            case 'Practice Quiz': return theme.palette.warning.main;
            case 'Programming Assignment': return theme.palette.error.main;
            default: return theme.palette.primary.main;
        }
    };
    
    return {
        backgroundColor: alpha(getTypeColor(type), 0.15),
        color: getTypeColor(type),
        borderRadius: '50%',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing(1),
    };
});

const ModuleTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    margin: theme.spacing(0, 0, 1, 0),
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
    }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    borderRadius: '12px',
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
}));

// Main component
const NewModuleItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams();
    const { showNotice } = useNotification();
    const { modules, loading, error } = useSelector((state) => state.module);
    
    const [contentType, setContentType] = useState('');
    const [module, setModule] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    
    // Load modules when component mounts
    useEffect(() => {
        const fetchModules = async () => {
            try {
                await dispatch(getAllModules(courseId));
            } catch (error) {
                showNotice('error', "Error loading modules");
            }
        };
        
        fetchModules();
    }, [courseId, dispatch]);
    
    // Handle content type change
    const handleChange = (event) => {
        setContentType(event.target.value);
        setActiveStep(1); // Move to next step when content type is selected
    };
    
    // Find the current module
    useEffect(() => {
        if (modules && modules.length > 0) {
            const foundModule = modules.find(module => module.index === moduleId);
            if (foundModule) {
                setModule(foundModule);
            } else {
                showNotice('warning', "Module not found");
                navigate(`/course-management/${courseId}/module`);
            }
        }
    }, [modules, moduleId, courseId, navigate, showNotice]);    // Get icon based on content type
    const getContentTypeIcon = (type) => {
        switch (type) {
            case 'Reading':
                return <MenuBook fontSize="medium" />;
            case 'Video':
                return <VideoLibrary fontSize="medium" />;
            case 'Practice Quiz':
                return <QuizIcon fontSize="medium" />;
            case 'Programming Assignment':
                return <Code fontSize="medium" />;
            default:
                return <Help fontSize="medium" />;
        }
    };
    
    // Handle navigation between steps
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleCancel = () => {
        navigate(`/course-management/${courseId}/module/${moduleId}`);
    };
    
    // Render the appropriate content component based on selected type
    const renderContentComponent = () => {
        switch (contentType) {
            case 'Reading':
                return <Supplement />;
            case 'Video':
                return <Lecture />;
            case 'Practice Quiz':
                return <Quiz />;
            case 'Programming Assignment':
                return <Programming />;
            default:
                return (
                    <Box sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        textAlign: 'center',
                        backgroundColor: alpha('#f5f5f5', 0.5),
                        borderRadius: 2
                    }}>
                        <Help sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Please select a content type to continue
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
                            Choose the type of content you want to create for this module item.
                            Different content types have different features and capabilities.
                        </Typography>
                    </Box>
                );
        }
    };    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '70vh',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="textSecondary">
                    Loading module information...
                </Typography>
            </Box>
        );
    }

    if (!module && !loading) {
        return (
            <Alert 
                severity="error" 
                sx={{ 
                    maxWidth: 600,
                    mx: 'auto',
                    mt: 4,
                    p: 2,
                    alignItems: 'center'
                }}
            >
                <Typography variant="h6">Module not found</Typography>
                <Typography variant="body2">
                    The requested module could not be found. Please check the URL and try again.
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/course-management/${courseId}/module`)}
                >
                    Return to Modules
                </Button>
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <ContentTypeCard>
                <StyledCardHeader
                    title="Create New Module Item"
                    subheader={module && `Adding to Module ${module.index}: ${module.title}`}
                    avatar={<Add fontSize="large" />}
                    action={
                        <Tooltip title="Return to module" placement="top">
                            <IconButton 
                                color="inherit" 
                                onClick={handleCancel}
                                size="large"
                            >
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>
                    }
                />

                <CardContent>
                    <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
                        <Step>
                            <StepLabel>Select Content Type</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Configure Content</StepLabel>
                        </Step>
                    </Stepper>
                    
                    {activeStep === 0 ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                What type of content do you want to create?
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Choose the type of educational content you want to add to this module. 
                                Each type offers different ways for students to learn and engage with the material.
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <ContentTypeTabs>
                                <ContentTypeButton
                                    active={contentType === 'Reading'}
                                    onClick={() => setContentType('Reading')}
                                    startIcon={
                                        <ContentTypeIcon type="Reading">
                                            <MenuBook />
                                        </ContentTypeIcon>
                                    }
                                >
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle1" fontWeight={600}>Reading</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Text-based content with rich formatting and attachments
                                        </Typography>
                                    </Box>
                                </ContentTypeButton>
                                
                                <ContentTypeButton
                                    active={contentType === 'Video'}
                                    onClick={() => setContentType('Video')}
                                    startIcon={
                                        <ContentTypeIcon type="Video">
                                            <VideoLibrary />
                                        </ContentTypeIcon>
                                    }
                                >
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle1" fontWeight={600}>Video</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Video lectures with optional attachments and notes
                                        </Typography>
                                    </Box>
                                </ContentTypeButton>
                                
                                <ContentTypeButton
                                    active={contentType === 'Practice Quiz'}
                                    onClick={() => setContentType('Practice Quiz')}
                                    startIcon={
                                        <ContentTypeIcon type="Practice Quiz">
                                            <QuizIcon />
                                        </ContentTypeIcon>
                                    }
                                >
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle1" fontWeight={600}>Practice Quiz</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Interactive quizzes to test student knowledge
                                        </Typography>
                                    </Box>
                                </ContentTypeButton>
                                
                                <ContentTypeButton
                                    active={contentType === 'Programming Assignment'}
                                    onClick={() => setContentType('Programming Assignment')}
                                    startIcon={
                                        <ContentTypeIcon type="Programming Assignment">
                                            <Code />
                                        </ContentTypeIcon>
                                    }
                                >
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle1" fontWeight={600}>Programming Assignment</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Coding exercises with automated testing
                                        </Typography>
                                    </Box>
                                </ContentTypeButton>
                            </ContentTypeTabs>
                            
                            {contentType && (
                                <Alert 
                                    severity="info" 
                                    icon={getContentTypeIcon(contentType)}
                                    action={
                                        <Button 
                                            color="inherit" 
                                            size="small" 
                                            onClick={handleNext}
                                            endIcon={<ArrowForward />}
                                        >
                                            Continue
                                        </Button>
                                    }
                                >
                                    You've selected <strong>{contentType}</strong> as your content type.
                                    Click Continue to configure your content.
                                </Alert>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    onClick={handleCancel}
                                    startIcon={<ArrowBack />}
                                >
                                    Cancel
                                </Button>
                                
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForward />}
                                    disabled={!contentType}
                                >
                                    Continue
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <ContentTypeIcon type={contentType} sx={{ mr: 2 }}>
                                    {getContentTypeIcon(contentType)}
                                </ContentTypeIcon>
                                <Typography variant="h5">
                                    Configure {contentType}
                                </Typography>
                                <Chip 
                                    label={contentType} 
                                    color="primary" 
                                    size="small" 
                                    sx={{ ml: 2 }}
                                />
                            </Box>

                            <ContentContainer>
                                {renderContentComponent()}
                            </ContentContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                >
                                    Back to Content Types
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </ContentTypeCard>
        </Box>
    );
}

export default NewModuleItem
