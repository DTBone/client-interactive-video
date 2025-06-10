/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
    TextField, Button, Paper, Card, CardHeader, CardContent,
    Typography, Box, Divider, LinearProgress, Grid,
    InputAdornment, Alert, IconButton, Tooltip, Chip,
    CircularProgress, Fade
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
    Title, Description, Save, ArrowBack, FileCopy,
    PictureAsPdf, DeleteOutline, Edit, CheckCircleOutline,
    Error as ErrorIcon, AttachFile
} from '@mui/icons-material';
import { createModuleItemSupplement, editSupplementByItemId } from '~/store/slices/ModuleItem/action';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';
import { useNotification } from '~/Hooks/useNotification';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';

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

const FileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
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

const EditSupplement = ({ moduleItem }) => {
    const navigate = useNavigate();
    const { courseId, moduleId, moduleItemId } = useParams();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);    // Khởi tạo state cho form data
    const [formData, setFormData] = useState({
        title: moduleItem.title || '',
        description: moduleItem.description || '',
        file: '',
    });
    
    // State quản lý lỗi form
    const [formErrors, setFormErrors] = useState({
        title: '',
        description: '',
        file: ''
    });
    
    // State cho hiển thị thông tin file
    const [fileInfo, setFileInfo] = useState({
        name: '',
        size: 0,
        type: '',
        preview: ''
    });
      // Validate form
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
            newErrors.description = 'Description must be at least 10 characters';
            isValid = false;
        }
        
        if (!formData.file) {
            newErrors.file = 'Please select a PDF file';
            isValid = false;
        }
        
        setFormErrors(newErrors);
        return isValid;
    };

    // Xử lý thay đổi input cơ bản
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        
        // Xóa lỗi khi người dùng nhập liệu
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        
        // Đánh dấu là đã thay đổi
        setHasChanges(true);
    };

    // Xử lý thay đổi file
    const handleFileChange = (file) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file
            }));
            
            // Cập nhật thông tin file
            setFileInfo({
                name: file.name,
                size: file.size,
                type: file.type,
                // Tạo URL xem trước nếu là PDF
                preview: file.type === 'application/pdf' ? URL.createObjectURL(file) : ''
            });
            
            // Xóa lỗi file
            setFormErrors(prev => ({
                ...prev,
                file: ''
            }));
            
            // Đánh dấu là đã thay đổi
            setHasChanges(true);
        }
    };    // Tính toán phần trăm hoàn thành form
    const getFormCompletionPercentage = () => {
        let completed = 0;
        let total = 3; // title, description, file
        
        if (formData.title?.trim()) completed++;
        if (formData.description?.trim()) completed++;
        if (formData.file) completed++;
        
        return Math.round((completed / total) * 100);
    };
    
    // Format file size thành dạng dễ đọc
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };    // Fetch file from Minio
    const fetchFileFromMinio = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const urlParts = url.split('/');
            let fileName = urlParts[urlParts.length - 1];
            
            // Process file name
            if (fileName.length > 14) {
                fileName = fileName.substring(14);
            }
            
            // Create file object
            const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });
            
            // Update file info state
            setFileInfo({
                name: fileName,
                size: blob.size,
                type: blob.type || 'application/pdf',
                preview: URL.createObjectURL(blob)
            });
            
            return file;
        } catch (e) {
            console.error('Error fetching file:', e);
            showNotice('error', 'Cannot load file from server');
            return null;
        }
    };    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            if (moduleItem && moduleItem.reading && typeof moduleItem.reading === 'string') {
                try {
                    const file = await fetchFileFromMinio(moduleItem.reading);
                    if (file) {
                        setFormData(prev => ({
                            ...prev,
                            file: file,
                            title: moduleItem.title || '',
                            description: moduleItem.description || ''
                        }));
                        
                        // Initially, no changes have been made
                        setHasChanges(false);
                    }
                } catch (error) {
                    console.error('Error loading initial data:', error);
                    showNotice('error', 'Cannot load initial data');
                }
            }
        };
        
        if (moduleItem) {
            loadInitialData();
        }
    }, [moduleItem, showNotice]);    // Handle form submission
    const handleSubmit = async () => {
        // Validate form
        if (!validateForm()) {
            showNotice('error', 'Please complete all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Create new FormData instance
            const submitFormData = new FormData();
            
            // Add file to FormData
            if (formData.file instanceof File) {
                submitFormData.append('file', formData.file, formData.file.name);
                console.log('File being submitted:', formData.file.name, formData.file.type, formData.file.size);
            } else {
                throw new Error('Invalid file object');
            }
            
            // Add other form data
            submitFormData.append('title', formData.title.trim());
            submitFormData.append('description', formData.description.trim());

            // Debug log FormData contents
            for (let pair of submitFormData.entries()) {
                console.log(`FormData: ${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`);
            }

            // Call API to update supplement
            const resultAction = await dispatch(editSupplementByItemId({
                itemId: moduleItemId,
                formData: submitFormData
            }));

            // Handle result
            if (createModuleItemSupplement.fulfilled.match(resultAction) || editSupplementByItemId.fulfilled.match(resultAction)) {
                showNotice('success', 'Document updated successfully');
                dispatch(toggleRefresh());
                
                // Add slight delay for better UX
                setTimeout(() => {
                    navigate(`/course-management/${courseId}/module/${moduleId}`);
                }, 800);
            } else {
                throw new Error(resultAction.payload || 'Could not update document');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotice('error', error.message || 'Failed to update document');
        } finally {
            setIsSubmitting(false);
        }
    };    // Handle cancellation
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
    
    // Tính toán % hoàn thành form
    const completionPercentage = getFormCompletionPercentage();
    
    return (
        <Box sx={{ p: 2, maxWidth: '900px', mx: 'auto', my: 3 }}>
            <StyledCard>                <StyledCardHeader
                    title="Edit Document"
                    subheader={moduleItem?.title}
                    avatar={<Edit fontSize="large" />}
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
                
                <CardContent sx={{ p: 3 }}>                    {/* Alert for changes */}
                    {hasChanges && (
                        <Alert 
                            severity="info"
                            sx={{ mb: 3 }}
                            icon={<Edit />}
                        >
                            You've made changes to this document. Don't forget to save your changes!
                        </Alert>
                    )}
                    
                    <FormContainer>
                        <Grid container spacing={3}>                            {/* Title */}
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    required
                                    label="Document Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange('title')}
                                    variant="outlined"
                                    placeholder="Enter a concise title describing the document content"
                                    helperText={formErrors.title || "A good title helps students understand the document content"}
                                    error={!!formErrors.title}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Title color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            {/* Description */}
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
                                    placeholder="Enter detailed description about the content and purpose of the document"
                                    helperText={formErrors.description || "Detailed description helps students understand the document before downloading"}
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
                                <Box sx={{ 
                                    border: theme => `1px dashed ${formErrors.file ? theme.palette.error.main : theme.palette.primary.main}`,
                                    borderRadius: 2,
                                    p: 3,
                                    backgroundColor: theme => alpha(theme.palette.background.paper, 0.7)
                                }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachFile color="primary" sx={{ mr: 1 }} />
                                        Document File (PDF)
                                        {formData.file && <Chip 
                                            label="File selected" 
                                            color="success" 
                                            size="small" 
                                            sx={{ ml: 2 }} 
                                            icon={<CheckCircleOutline fontSize="small" />}
                                        />}
                                    </Typography>
                                    
                                    <FileUpload
                                        onFileChange={handleFileChange}
                                        accept=".pdf"
                                        fileSelected={formData.file}
                                    />
                                    
                                    {formErrors.file && (
                                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                            <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            {formErrors.file}
                                        </Typography>
                                    )}
                                    
                                    {/* Hiển thị thông tin file đã chọn */}
                                    {formData.file && fileInfo.name && (
                                        <Fade in={true}>
                                            <FileCard>
                                                <PictureAsPdf color="error" fontSize="large" />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2">{fileInfo.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {fileInfo.size ? formatFileSize(fileInfo.size) : ''}
                                                        {fileInfo.preview && (
                                                            <Tooltip title="Preview if browser supports">
                                                                <Button 
                                                                    size="small" 
                                                                    sx={{ ml: 2 }}
                                                                    onClick={() => window.open(fileInfo.preview, '_blank')}
                                                                >
                                                                    Preview
                                                                </Button>
                                                            </Tooltip>
                                                        )}
                                                    </Typography>
                                                </Box>
                                                <Chip label="PDF" color="error" size="small" variant="outlined" />
                                            </FileCard>
                                        </Fade>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        {/* Buttons */}
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
                                disabled={isSubmitting || !hasChanges || completionPercentage !== 100}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </ActionButton>
                        </Box>
                    </FormContainer>
                </CardContent>
            </StyledCard>
        </Box>
    );
};

export default EditSupplement;