import React, { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import {
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    LinearProgress,
    Box
} from '@mui/material';
import { useNotification } from '~/Hooks/useNotification';

const FileUpload = ({ onFileChange, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png, .mp4, .webm' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotice } = useNotification();

    // Chuyển đổi MIME types thành extensions và ngược lại
    const mimeToExt = {
        'video/mp4': '.mp4',
        'video/quicktime': '.mov',
        'video/x-msvideo': '.avi',
        'video/webm': '.webm',
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg,.jpeg',
        'image/png': '.png',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
    };

    const extToMime = {
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.avi': 'video/x-msvideo',
        '.webm': 'video/webm',
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    // Chuyển đổi accept string thành array của allowed MIME types
    const getAllowedTypes = useCallback(() => {
        const extensions = accept.split(',');
        return extensions.map(ext => extToMime[ext.trim()]).filter(Boolean);
    }, [accept]);

    const handleFile = useCallback((newFile) => {
        setError(null);
        setUploading(true);

        // Validate file
        const validationError = validateFile(newFile);
        if (validationError) {
            setError(validationError);
            setUploading(false);
            return;
        }

        setFile(newFile);
        if (onFileChange) {
            onFileChange(newFile);
        }

        setTimeout(() => {
            setUploading(false);
        }, 1500);
    }, [onFileChange]);

    const validateFile = (file) => {
        const allowedTypes = getAllowedTypes();
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!allowedTypes.includes(file.type)) {
            showNotice('error', `File type not supported. Allowed types: ${accept}`);
            return `File type not supported. Allowed types: ${accept}`;
        }
        if (file.size > maxSize) {
            showNotice('error', 'File size exceeds 100MB');
            return 'File size exceeds 100MB';
        }
        return null;
    };


    // Drag and drop handlers
    const onDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const onFileSelect = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
        e.target.value = '';
    }, [handleFile]);

    const removeFile = useCallback(() => {
        setFile(null);
        setError(null);
        if (onFileChange) {
            onFileChange(null);
        }
    }, [onFileChange]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'video/mp4',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return 'File type not supported';
        }
        if (file.size > maxSize) {
            return 'File size exceeds 10MB';
        }
        return null;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                border: isDragging ? '2px dashed #2196f3' : '1px solid #e0e0e0',
                borderRadius: '4px',
                bgcolor: isDragging ? '#e3f2fd' : 'background.paper',
                transition: 'all 0.2s ease'
            }}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {!file ? (
                <Box sx={{ textAlign: 'center', py: 3, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
                    <Upload />
                    <Typography variant="body1" sx={{ mb: 0.5, color: 'text.primary' }}>
                        Drag and drop the file here
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                        Or
                    </Typography>

                    <label htmlFor="file-input">
                        <input
                            id="file-input"
                            type="file"
                            hidden
                            onChange={onFileSelect}
                            accept={accept}
                        />
                        <Button
                            variant="contained"
                            component="span"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            Choose File
                        </Button>
                    </label>

                    {/* Show accepted file types */}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Accepted file types: {accept}
                    </Typography>
                </Box>
            ) : null}

            {error && (
                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                        {error}
                    </Typography>
                </Box>
            )}

            {uploading && (
                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                        Uploading...
                    </Typography>
                    <LinearProgress />
                </Box>
            )}

            {file && (
                <List sx={{ px: 1, pb: 1 }}>
                    <ListItem
                        sx={{
                            bgcolor: 'grey.50',
                            borderRadius: 1
                        }}
                    >
                        <FileText
                            size={18}
                            style={{ marginRight: 8, flexShrink: 0 }}
                        />
                        <ListItemText
                            primary={
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ color: 'text.primary' }}
                                >
                                    {file.name}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {formatFileSize(file.size)}
                                </Typography>
                            }
                            sx={{ minWidth: 0 }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={removeFile}
                                size="small"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'error.main'
                                    }
                                }}
                            >
                                <X size={18} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <label htmlFor="file-input">
                            <input
                                id="file-input"
                                type="file"
                                hidden
                                onChange={onFileSelect}
                                accept={accept}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                size="small"
                                sx={{ textTransform: 'none' }}
                            >
                                Choose Another File
                            </Button>
                        </label>
                    </Box>
                </List>
            )}
        </Paper>
    );
};

export default FileUpload;