import React, { useState, useRef, useEffect } from 'react';
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
import { createModuleItemLecture } from '~/store/slices/ModuleItem/action';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

const Lecture = () => {
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

    const [videoPreview, setVideoPreview] = useState('');
    const [videoKey, setVideoKey] = useState(0);

    useEffect(() => {
        console.log('videoPreview: ', videoPreview)
        // Cleanup URL khi component unmount hoặc file thay đổi
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };

    }, [videoPreview]);

    // State để lưu URL preview video

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    // const handleFileChange = (file) => {
    //     if (file) {
    //         // Kiểm tra xem file có phải là video không
    //         if (!file.type.startsWith('video/')) {
    //             showNotice('error', 'Please select a video file');
    //             return;
    //         }

    //         const fileData = new FormData();
    //         fileData.append('file', file);
    //         console.log('file selectedA: ', fileData.get('file'))
    //         onUpdateData({
    //             ...moduleItemData,
    //             references: {
    //                 ...moduleItemData.references,
    //                 fileName: file.name,
    //                 size: file.size,
    //                 file: fileData
    //             }
    //         });

    //         // Tạo URL để preview video
    //         const videoURL = URL.createObjectURL(file);
    //         console.log('video URL: ', videoURL)
    //         setVideoPreview(videoURL);

    //         setFormData(prev => ({
    //             ...prev,
    //             file: file
    //         }));
    //     }
    // };

    const handleFileChange = (file) => {
        if (file) {
            // Kiểm tra xem file có phải là video không
            if (!file.type.startsWith('video/')) {
                showNotice('error', 'Please select a video file');
                return;
            }

            const fileData = new FormData();
            fileData.append('file', file);

            // Tạo URL để preview video

            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }

            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
            setVideoKey(prevKey => prevKey + 1);


            setFormData(prev => ({
                ...prev,
                file: file
            }));
        } else {
            setVideoPreview(null);
            setFormData(prev => ({
                ...prev,
                file: null,
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

            const res = await dispatch(createModuleItemLecture({
                courseId,
                moduleId,
                formData: submitFormData
            }));
            if (res.error) {
                showNotice('error', res.error.message);
            } else {
                showNotice('success', 'Lecture created successfully');
                dispatch(toggleRefresh())
                //navigate(-1);
            }
        } catch (error) {
            showNotice('error', error.message || 'Failed to create lecture');
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Paper elevation={0} className=" space-y-6">
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

                />
            </div>

            {/* Video Preview */}
            {videoPreview && (
                <div>
                    <Box className="mt-4">
                        <video
                            key={videoKey}
                            ref={videoRef}
                            className="w-full max-h-[400px]"
                            controls
                            onLoadedMetadata={handleVideoLoad}
                        >
                            <source src={videoPreview} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {formData?.video?.duration > 0 && (
                            <div className="mt-2 text-gray-600">
                                Video Duration: {Math.floor(formData?.video?.duration)} seconds
                            </div>
                        )}
                    </Box>
                    <Box className="mt-4">
                        <QuizQuestionForm onUpdate={onUpdate} />
                    </Box>
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
                    Create Module Item
                </Button>
            </div>
        </Paper>
    );
};

export default Lecture;