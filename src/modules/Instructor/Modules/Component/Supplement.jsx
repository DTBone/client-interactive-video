import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
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
    InputAdornment
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
    Description, 
    Title as TitleIcon, 
    UploadFile, 
    Save, 
    ArrowBack, 
    PictureAsPdf, 
    Article, 
    InsertDriveFile, 
    CheckCircleOutline, 
    Warning
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useNotification } from '~/hooks/useNotification';
import { createModuleItemSupplement } from '~/store/slices/ModuleItem/action';
import { useDispatch } from 'react-redux';
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

const FilePreview = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const SupplementEnhanced = () => {
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for form errors
    const [formErrors, setFormErrors] = useState({
        title: '',
        description: '',
        file: ''
    });
    
    // Khởi tạo state cho form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
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

    // Xử lý thay đổi input cơ bản với validation
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        
        // Clear any existing form error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Xử lý thay đổi file với validation
    const handleFileChange = (file) => {
        if (file) {
            // Check if file is PDF
            if (!file.type.includes('pdf')) {
                setFormErrors(prev => ({
                    ...prev,
                    file: 'Only PDF files are allowed'
                }));
                showNotice('error', 'Please upload a PDF file');
                return;
            }
            
            // Clear any file error
            setFormErrors(prev => ({
                ...prev,
                file: ''
            }));
            
            setFormData(prev => ({
                ...prev,
                file: file
            }));
        }
    };
    
    // Validate form before submission
    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '', description: '', file: '' };
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description should be at least 10 characters';
            isValid = false;
        }
        
        if (!formData.file) {
            newErrors.file = 'Please select a PDF file';
            isValid = false;
        }
        
        setFormErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        // Validation
        if (!validateForm()) {
            showNotice('error', 'Please fix the errors in the form');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Tạo FormData mới khi submit
            const submitFormData = new FormData();
            if (formData.file instanceof File) {
                submitFormData.append('file', formData.file, formData.file.name);
            } else {
                throw new Error('Invalid file');
            }
            submitFormData.append('title', formData.title);
            submitFormData.append('description', formData.description);

            // Debug log
            for (let [key, value] of submitFormData.entries()) {
                console.log(`${key}:`, value instanceof File ? value.name : value);
            }

            const resultAction = await dispatch(createModuleItemSupplement({
                courseId,
                moduleId,
                formData: submitFormData
            }));

            if (createModuleItemSupplement.fulfilled.match(resultAction)) {
                showNotice('success', 'Successfully created module item');
                dispatch(toggleRefresh());
                
                // Add slight delay for better UX
                setTimeout(() => {
                    navigate(`/course-management/${courseId}/module/${moduleId}`);
                }, 800);
            } else if (createModuleItemSupplement.rejected.match(resultAction)) {
                showNotice('error', resultAction.payload);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotice('error', error.message || 'Failed to create module item');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle cancel button
    const handleCancel = () => {
        if (formData.title || formData.description || formData.file) {
            if (window.confirm('Are you sure you want to cancel? All your data will be lost.')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };
    
    // Get completion percentage
    const completionPercentage = getFormCompletionPercentage();

    // Get appropriate file icon based on file type
    const getFileIcon = () => {
        return <PictureAsPdf fontSize="large" color="error" />;
    };
    
    return (
        <Box sx={{ p: 2, maxWidth: '1000px', mx: 'auto', my: 3 }}>
            <StyledCard>
                <StyledCardHeader
                    title="Add Supplementary Material"
                    subheader="Upload PDF documents to supplement your course"
                    avatar={<Article fontSize="large" />}
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
                        bgcolor={completionPercentage === 100 ? 'success.main' : 'primary.main'}
                        color="white"
                        fontSize="12px"
                        fontWeight="bold"
                        px={1}
                        py={0.5}
                        borderRadius="10px"
                        sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
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
                                label="Document Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange('title')}
                                variant="outlined"
                                placeholder="Enter a descriptive title for this document"
                                helperText={formErrors.title || "A clear title helps students understand the document's content"}
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
                                label="Document Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                variant="outlined"
                                placeholder="Explain what this document contains and how it helps with the course"
                                helperText={formErrors.description || "A good description helps students decide whether to access this resource"}
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
                        
                        {/* File upload */}
                        <Grid item xs={12}>
                            <UploadContainer>
                                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PictureAsPdf color="primary" sx={{ mr: 1 }} />
                                    PDF Document
                                    {formData.file && (
                                        <Chip 
                                            label="File Selected" 
                                            color="success" 
                                            size="small" 
                                            sx={{ ml: 2 }} 
                                            icon={<CheckCircleOutline fontSize="small" />}
                                        />
                                    )}
                                </Typography>
                                
                                <FileUpload
                                    onFileChange={handleFileChange}
                                    accept=".pdf"
                                    fileSelected={formData.file}
                                />
                                
                                {formErrors.file && (
                                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                        <Warning fontSize="small" sx={{ mr: 0.5 }} />
                                        {formErrors.file}
                                    </Typography>
                                )}
                            </UploadContainer>
                        </Grid>
                        
                        {/* File preview */}
                        {formData.file && (
                            <Grid item xs={12}>
                                <Fade in={!!formData.file} timeout={500}>
                                    <FilePreview>
                                        {getFileIcon()}
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={500}>
                                                {formData.file.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                                            </Typography>
                                        </Box>
                                    </FilePreview>
                                </Fade>
                            </Grid>
                        )}
                    </Grid>
                    
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
                            disabled={isSubmitting || completionPercentage !== 100}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Document'}
                        </ActionButton>
                    </Box>
                </CardContent>
            </StyledCard>
        </Box>
    );
};

export default SupplementEnhanced;
