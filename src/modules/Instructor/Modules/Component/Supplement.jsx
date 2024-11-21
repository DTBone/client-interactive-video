import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useNotification } from '~/hooks/useNotification';
import { createModuleItemSupplement } from '~/store/slices/ModuleItem/action';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

const Supplement = () => {
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    // Khởi tạo state cho form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
    });

    // Xử lý thay đổi input cơ bản
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    // Xử lý thay đổi file
    const handleFileChange = (file) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file
            }));
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.file) {
            showNotice('error', 'Please select a file');
            return;
        }
        if (!formData.title) {
            showNotice('error', 'Please enter title');
            return;
        }
        if (!formData.description) {
            showNotice('error', 'Please enter description');
            return;
        }

        try {
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
                navigate(`/course-management/${courseId}/module/${moduleId}`);;
            } else if (createModuleItemSupplement.rejected.match(resultAction)) {
                showNotice('error', resultAction.payload);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotice('error', error.message || 'Failed to create module item');
        }
    };

    return (
        <Paper elevation={0} className="space-y-6">
            <div className="space-y-4">
                <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    variant="outlined"
                />

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    variant="outlined"
                />

                <div className="w-full">
                    <FileUpload
                        onFileChange={handleFileChange}
                        accept=".pdf"

                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    className="px-6"
                >
                    Create Module Item
                </Button>
            </div>
        </Paper>
    );
};

export default Supplement;