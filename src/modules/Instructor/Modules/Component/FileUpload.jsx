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

const FileUpload = ({ onFileChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = useCallback((newFile) => {
        setUploading(true);

        // Validate file
        const error = validateFile(newFile);
        if (!error) {
            setFile(newFile);
            if (onFileChange) {
                onFileChange(newFile);
            }
        }

        setTimeout(() => {
            setUploading(false);
        }, 1500);
    }, [onFileChange]);

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

        const droppedFile = e.dataTransfer.files[0]; // Chỉ lấy file đầu tiên
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const onFileSelect = useCallback((e) => {
        const selectedFile = e.target.files[0]; // Chỉ lấy file đầu tiên
        if (selectedFile) {
            handleFile(selectedFile);
        }
        e.target.value = ''; // Reset input
    }, [handleFile]);

    const removeFile = useCallback(() => {
        setFile(null);
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
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                </Box>
            ) : null}

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

                    {/* Button to choose another file */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <label htmlFor="file-input">
                            <input
                                id="file-input"
                                type="file"
                                hidden
                                onChange={onFileSelect}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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