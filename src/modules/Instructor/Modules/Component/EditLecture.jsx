import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    TextField,
    Button,
    Paper,
    Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useNotification } from '~/hooks/useNotification';
import QuizQuestionForm from './QuizQuestionForm';
import { createModuleItemLecture, editLectureByItemId } from '~/store/slices/ModuleItem/action';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

const EditLecture = ({ moduleItem }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const { showNotice } = useNotification();
    const { courseId, moduleId } = useParams();

    // State để lưu trữ form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'lecture',
        contentType: 'Video',
        icon: 'video',
        file: null,
        duration: 0,
        questions: {
            index: null,
            questionType: null,
            question: null,
            startTime: null,
            answers: [
                { content: null, isCorrect: null },
                { content: null, isCorrect: null },
            ],
        }
    });
    // const fetchFileFromMinio = async (url) => {
    //     try {
    //         const response = await fetch(url);
    //         const blob = await response.blob();
    //         const urlParts = url.split('/');
    //         const fileName1 = urlParts[urlParts.length - 1];
    //         const fileName = fileName1.substring(14);
    //         return new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
    //     } catch (e) {
    //         console.error('Error fetching file:', e);
    //         showNotice('error', 'Failed to fetch file');
    //         return null;
    //     }
    // }

    const fetchFileFromMinio = useCallback(async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1].substring(14);

            return new File([blob], fileName, { type: 'video/mp4' });
        } catch (e) {
            console.error('Error fetching file:', e);
            return null;
        }
    }, []);
    useEffect(() => {
        const loadFormData = async () => {
            if (moduleItem) {
                try {

                    const filePath = await fetchFileFromMinio(moduleItem?.video?.file);
                    if (!filePath) {
                        showNotice('error', 'Failed to load file');
                        return;
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            title: moduleItem.title,
                            description: moduleItem.description,
                            file: filePath,
                            duration: moduleItem?.video?.duration,
                            questions: moduleItem?.video?.questions,

                        }));
                    }
                }
                catch (err) {
                    console.error('Error loading file:', err);
                    showNotice('error', 'Failed to load file');
                }


            }
        }
        loadFormData();
    }, [moduleItem])
    useEffect(() => {
        let objectUrl = '';
        if (formData.file) {
            objectUrl = URL.createObjectURL(formData.file);
            setVideoPreview(objectUrl);
            //console.log('file:', formData.file);
            //console.log('objectUrl:', objectUrl);
            // Cleanup function
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

    }, [formData.file]);
    // State để lưu URL preview video
    const [videoPreview, setVideoPreview] = useState('');

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleFileChange = (file) => {
        if (file) {
            // Kiểm tra xem file có phải là video không
            if (!file.type.startsWith('video/')) {
                alert('Please select a video file');
                return;
            }

            const fileData = new FormData();
            fileData.append('file', file);

            // Tạo URL để preview video
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);

            setFormData(prev => ({
                ...prev,
                file: file
            }));
        }
    };

    // Hàm xử lý khi video được load
    const handleVideoLoad = () => {
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            setFormData(prev => ({
                ...prev,
                duration: duration
            }));
        }
    };

    const onUpdate = (updatedQuestions) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            questions: updatedQuestions,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            showNotice('error', 'Please enter title');
            return;
        }
        if (!formData.description) {
            showNotice('error', 'Please enter description');
            return;
        }
        if (!formData.duration || !formData.file) {
            showNotice('error', 'Please select a video');
            return;
        }
        try {
            const submitFormData = new FormData();
            if (formData.file instanceof File) {
                submitFormData.append('file', formData.file);
            }
            else {
                showNotice('error', 'Please select a video');
            }
            submitFormData.append('title', formData.title);
            submitFormData.append('type', formData.type);
            submitFormData.append('description', formData.description);
            submitFormData.append('contentType', formData.contentType);
            submitFormData.append('icon', formData.icon);
            submitFormData.append('duration', formData.duration);
            submitFormData.append('questions', JSON.stringify(formData.questions));
            // Debug log
            for (let [key, value] of submitFormData.entries()) {
                console.log(`${key}:`, value instanceof File ? value.name : value);
            }

            const res = await dispatch(editLectureByItemId({
                itemId: moduleItem._id,
                formData: submitFormData
            }));
            if (res.error) {
                showNotice('error', res.error.message);
            } else {
                showNotice('success', 'Lecture edit successfully');
                dispatch(toggleRefresh())
                navigate(`/course-management/${courseId}/module/${moduleId}`);
            }
        } catch (error) {
            showNotice('error', error.message || 'Failed to create lecture');
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <Paper elevation={0} className=" space-y-6 mb-6 pb-6">
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
                        accept=".mp4,.webm"
                        fileSelected={formData.file}
                    />
                </div>

                {/* Video Preview */}
                {videoPreview && (
                    <div>
                        <Box className="mt-4">
                            <video
                                ref={videoRef}
                                className="w-full max-h-[400px]"
                                controls
                                src={videoPreview}
                                onLoadedMetadata={handleVideoLoad}
                            >
                                {/* <source src={videoPreview} type="video/mp4" /> */}
                                Your browser does not support the video tag.
                            </video>
                            {formData?.duration > 0 && (
                                <div className="mt-2 text-gray-600">
                                    Video Duration: {Math.floor(formData?.duration)} seconds
                                </div>
                            )}
                        </Box>
                        {
                            formData.questions && (
                                <Box className="mt-4">
                                    <QuizQuestionForm
                                        onUpdate={onUpdate}
                                        questions={formData.questions}
                                    />
                                </Box>
                            )
                        }

                    </div>
                )}

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
                        Edit Lecture
                    </Button>
                </div>
            </Paper>
        </div>
    )
}

export default EditLecture
