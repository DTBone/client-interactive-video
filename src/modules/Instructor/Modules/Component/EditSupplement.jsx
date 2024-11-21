import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Stack,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createModuleItemSupplement } from '~/store/slices/ModuleItem/action';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';
import { useNotification } from '~/Hooks/useNotification';

const EditSupplement = ({ moduleItem }) => {
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();

    const [formData, setFormData] = useState({
        title: moduleItem?.title || '',
        description: moduleItem?.description || '',
        file: moduleItem?.reading || null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file
            }));
        }
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({
            ...prev,
            file: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            if (formData.file) {
                submitData.append('file', formData.file);
            }

            await dispatch(createModuleItemSupplement({
                courseId,
                moduleId,
                data: submitData
            }));

            dispatch(toggleRefresh());
            showNotice('Success', 'Supplement updated successfully');
            navigate(-1);
        } catch (err) {
            setError(err.message || 'Failed to update supplement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper className="w-full max-w-2xl mx-auto p-6 mt-8">
            <Typography variant="h5" className="mb-6 font-bold">
                Edit Supplement
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <Alert
                        severity="error"
                        className="mb-4"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setError('')}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}

                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        error={!formData.title.trim()}
                        helperText={!formData.title.trim() ? 'Title is required' : ''}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        variant="outlined"
                    />

                    <Box className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {formData.file ? (
                            <div className="flex items-center justify-between">
                                <Typography className="text-sm">
                                    {formData.file.name}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveFile}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        ) : (
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <UploadFileIcon className="text-gray-400 mb-2" />
                                <Typography className="text-sm text-gray-600">
                                    Click to upload file
                                </Typography>
                            </label>
                        )}
                    </Box>
                </Stack>

                <Box className="flex justify-end space-x-4 mt-8">
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        className="px-6"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        className="px-6"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} className="text-white" />
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default EditSupplement;