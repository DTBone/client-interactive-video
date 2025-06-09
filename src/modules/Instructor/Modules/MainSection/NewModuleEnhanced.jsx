import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Paper, Typography, Box, Card, CardContent, 
    CardHeader, Divider, IconButton, InputAdornment, Tooltip,
    LinearProgress, Grid, Alert
} from '@mui/material';
import { 
    MenuBook, Description, ExpandMore, School,
    CheckCircleOutline, ArrowBack, Save, Title as TitleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { useDispatch } from 'react-redux';
import { createModule } from '~/store/slices/Module/action';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

// Styled components
const ModuleFormCard = styled(Card)(({ theme }) => ({
    maxWidth: '800px',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'visible',
    '&:hover': {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-4px)'
    }
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiCardHeader-title': {
        fontSize: '1.5rem',
        fontWeight: 600
    },
}));

const FormContainer = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
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

const NewModule = () => {
    const { courseId } = useParams();
    const { showNotice } = useNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courseId: courseId,
        index: '',
        title: '',
        description: '',
    });
    
    const [formErrors, setFormErrors] = useState({
        title: '',
        description: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '', description: '' };
        
        if (!formData.title.trim()) {
            newErrors.title = 'Module title is required';
            isValid = false;
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Module title must be at least 3 characters';
            isValid = false;
        }
        
        if (formData.description.trim().length > 0 && formData.description.trim().length < 10) {
            newErrors.description = 'Description should be at least 10 characters if provided';
            isValid = false;
        }
        
        setFormErrors(newErrors);
        return isValid;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const getFormCompletionPercentage = () => {
        let completed = 0;
        let total = 1; // Title is required
        
        if (formData.title.trim()) completed++;
        if (formData.description.trim()) {
            total++;
            completed++;
        }
        
        return Math.round((completed / total) * 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotice("error", 'Please correct the form errors');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Create module
            await dispatch(createModule({ courseId, formData }));

            // Show success notification
            showNotice('success', 'Module created successfully');
            dispatch(toggleRefresh());

            // Add a small delay for better user experience
            await new Promise(resolve => setTimeout(resolve, 800));

            // Redirect back to modules page
            navigate(`/course-management/${courseId}/module`);
        } catch (error) {
            showNotice('error', error.message || 'Error creating module');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCancel = () => {
        navigate(`/course-management/${courseId}/module`);
    };

    if (!courseId) {
        showNotice('error', 'Course not found');
        return <Navigate to="/instructor/course-management" />;
    }

    const completionPercentage = getFormCompletionPercentage();

    return (
        <div className="bg-gray-50 py-8 px-4 min-h-[80vh] flex items-start">
            <ModuleFormCard elevation={3}>
                <CardHeaderStyled
                    title="Create New Module"
                    avatar={<School fontSize="large" />}
                    action={
                        <Tooltip title="Return to modules" placement="top">
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
                        {completionPercentage}%
                    </Box>
                </Box>
                
                <CardContent>
                    {completionPercentage === 100 && (
                        <Alert 
                            icon={<CheckCircleOutline />} 
                            severity="success"
                            sx={{ mb: 3 }}
                        >
                            Your module information is complete and ready to be created!
                        </Alert>
                    )}
                    
                    <FormContainer onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    required
                                    label="Module Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="Enter an engaging title for your module"
                                    helperText={formErrors.title || "A descriptive title helps students understand the module content"}
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
                            
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    label="Module Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    placeholder="Provide a brief overview of what will be covered in this module"
                                    helperText={formErrors.description || "Optional: A good description helps students understand the module's learning objectives"}
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
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        
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
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !formData.title.trim()}
                                startIcon={<Save />}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Module'}
                            </ActionButton>
                        </Box>
                    </FormContainer>
                </CardContent>
            </ModuleFormCard>
        </div>
    );
};

export default NewModule;
