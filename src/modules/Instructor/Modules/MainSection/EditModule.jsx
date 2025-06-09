import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Paper, Typography, Box, Card, CardContent, 
    CardHeader, Divider, IconButton, InputAdornment, Tooltip,
    LinearProgress, Grid, Alert, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, CircularProgress
} from '@mui/material';
import { 
    MenuBook, Description, Edit, School, Save, 
    CheckCircleOutline, ArrowBack, Delete as DeleteIcon,
    Warning as WarningIcon, Title as TitleIcon, Numbers
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { deleteModule, getAllModules, updateModule } from '~/store/slices/Module/action';
import { clearError, toggleRefresh } from '~/store/slices/Module/moduleSlice';
import DelModuleModal from '../Component/DelModuleModal';


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
    padding: theme.spacing(2),
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

const DeleteButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.9),
        boxShadow: '0 4px 8px rgba(244, 67, 54, 0.3)',
    },
}));

const EditModule = () => {
    const { courseId, moduleId } = useParams();
    const { modules, error } = useSelector((state) => state.module);
    const { showNotice } = useNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moduleData = location.state?.currentModule;
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
    
    const [loadingModule, setLoadingModule] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch all modules initially
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingModule(true);
                await dispatch(getAllModules(courseId));
            } catch (error) {
                showNotice('error', "Error fetching module data");
                console.error("Error fetching module data:", error);
            } finally {
                setLoadingModule(false);
            }
        };

        fetchData();
    }, [dispatch, courseId, moduleId]);    // Load module data from either location state or fetched modules
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingModule(true);
                if (moduleData) {
                    clearData();
                    setFormData({
                        courseId: courseId,
                        index: moduleData.index,
                        title: moduleData.title,
                        description: moduleData.description || '',
                    });
                } else if (modules.length > 0) {
                    const currentModule = modules.find(module => module.index === moduleId);
                    if (currentModule) {
                        setFormData({
                            courseId: courseId,
                            index: currentModule.index,
                            title: currentModule.title,
                            description: currentModule.description || '',
                        });
                    } else {
                        showNotice('warning', "Module not found");
                        navigate(`/course-management/${courseId}/module`);
                    }
                }
                // Reset changes tracker when loading new data
                setHasChanges(false);
            } catch (error) {
                showNotice('error', "Error loading module data");
                console.error("Error loading module data:", error);
            } finally {
                setLoadingModule(false);
            }
        };

        if (modules.length > 0 || moduleData) {
            fetchData();
        }
    }, [modules, moduleData]);    // Handle error from Redux state
    useEffect(() => {
        if (error) {
            showNotice('error', error);
            dispatch(clearError());
        }
    }, [error, dispatch, showNotice]);
    
    // Clear form data
    const clearData = () => {
        setFormData({
            courseId: courseId,
            index: '',
            title: '',
            description: '',
        });
    };
    
    // Form validation
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
    
    // Handle form changes
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
        
        // Track that changes have been made
        setHasChanges(true);
    };
    
    // Calculate completion percentage for progress bar
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
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotice("error", 'Please correct the form errors');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Update module
            await dispatch(updateModule({ courseId, moduleId, formData }));
            
            // Reset form state
            clearData();
            dispatch(toggleRefresh());
            setHasChanges(false);
            
            // Show success notification
            showNotice('success', "Module updated successfully");
            
            // Navigate back to modules list
            navigate(`/course-management/${courseId}/module`);
        } catch (err) {
            showNotice('error', "Error updating module");
            console.error("Update module error", err);
        } finally {
            setIsSubmitting(false);
        }
    }    // Open delete confirmation modal
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    // Handle module deletion with password confirmation
    const handleConfirmDelete = async (password) => {
        setIsDeleting(true);
        try {
            // Proceed with deletion using password
            await dispatch(deleteModule({ courseId, moduleId, password })).unwrap();

            // Show success message and redirect
            showNotice('success', 'Module deleted successfully');
            setIsDeleteModalOpen(false);
            
            // Add a small delay for better user experience
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Navigate back and refresh module list
            navigate(`/course-management/${courseId}/module`);
            dispatch(toggleRefresh());
        } catch (error) {
            showNotice('error', error?.message || "Error deleting module");
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Cancel edit and return to module list
    const handleCancel = () => {
        // Ask for confirmation only if changes were made
        if (hasChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                navigate(`/course-management/${courseId}/module`);
            }
        } else {
            navigate(`/course-management/${courseId}/module`);
        }
    };
    // const handleDelete = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const result = await dispatch(deleteModule({ courseId, moduleId })).unwrap();

    //         // Chỉ hiển thị thông báo thành công và navigate nếu không có lỗi
    //         showNotice('success', "Deleted successfully");
    //         navigate(`/course-management/${courseId}/module`);
    //         dispatch(toggleRefresh());
    //     } catch (err) {

    //         console.error("delete module error", err);
    //         return;
    //     }

    // }    // Calculate completion percentage for progress bar
    const completionPercentage = getFormCompletionPercentage();
    
    if (loadingModule) {
        return (
            <div className="bg-gray-50 py-8 px-4 min-h-[80vh] flex items-center justify-center">
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                        Loading module...
                    </Typography>
                </Box>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 py-8 px-4 min-h-[80vh] flex items-start">
            <ModuleFormCard elevation={3}>
                <CardHeaderStyled
                    title="Edit Module"
                    avatar={<Edit fontSize="large" />}
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
                
                <CardContent>
                    {hasChanges && (
                        <Alert 
                            severity="info"
                            sx={{ mb: 3 }}
                            icon={<Edit />}
                        >
                            You've made changes to this module. Don't forget to save your updates!
                        </Alert>
                    )}
                    
                    <FormContainer onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    label="Module Index"
                                    name="index"
                                    value={formData.index || ''}
                                    variant="outlined"
                                    disabled={true}
                                    helperText="Module index cannot be changed"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Numbers color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    required
                                    label="Module Title"
                                    name="title"
                                    value={formData.title || ''}
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
                                    value={formData.description || ''}
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
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <DeleteButton
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteClick}
                                disabled={isSubmitting}
                            >
                                Delete Module
                            </DeleteButton>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                                    disabled={isSubmitting || !formData.title.trim() || !hasChanges}
                                    startIcon={<Save />}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </ActionButton>
                            </Box>
                        </Box>
                    </FormContainer>
                </CardContent>
            </ModuleFormCard>
            
            <DelModuleModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                moduleName={formData?.title}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default EditModule
