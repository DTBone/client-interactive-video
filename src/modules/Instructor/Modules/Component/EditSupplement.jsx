/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Paper
} from '@mui/material';
import { createModuleItemSupplement } from '~/store/slices/ModuleItem/action';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';
import { useNotification } from '~/hooks/useNotification';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';

const EditSupplement = ({ moduleItem }) => {
    //console.log('module item compoennt:', moduleItem)
    const navigate = useNavigate();
    const { courseId, moduleId, moduleItemId } = useParams();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    // Khởi tạo state cho form data
    const [formData, setFormData] = useState({
        title: moduleItem.title,
        description: moduleItem.description,
        file: '',
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

    const fetchFileFromMinio = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const urlParts = url.split('/');
            const fileName1 = urlParts[urlParts.length - 1];
            const fileName = fileName1.substring(14);
            return new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
        } catch (e) {
            console.error('Error fetching file:', e);
            showNotice('error', 'Failed to fetch file');
            return null;
        }
    }

    useEffect(() => {
        const loadInitialData = async () => {
            if (moduleItem.reading && typeof moduleItem.reading === 'string') {
                const file = await fetchFileFromMinio(moduleItem.reading);
                setFormData(prev => ({
                    ...prev,
                    file: file,
                    title: moduleItem.title,
                    description: moduleItem.description
                }));
            }
            //console.log('file loaded', formData)
        }
        loadInitialData();
    }, [moduleItem.reading]);

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


    const handleDeleteItem = async () => {
        try {
            console.log('Delete item', moduleItemId);
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotice('error', error.message || 'Failed to delete module item');
        }
    }
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
                        fileSelected={formData.file}


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
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteItem}
                    className="px-6"
                >
                    Delete
                </Button>
            </div>
        </Paper>
    );
};

export default EditSupplement;