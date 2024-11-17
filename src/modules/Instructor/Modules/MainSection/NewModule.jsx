import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { useDispatch } from 'react-redux';
import { createModule } from '~/store/slices/Module/action';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

const NewModule = () => {
    const { courseId } = useParams();
    const { showNotice } = useNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        courseId: courseId,
        index: '',
        title: '',
        description: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => { }, [dispatch, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            showNotice("error", 'Please enter a title');
            return;
        }

        try {
            // Tạo module
            await dispatch(createModule({ courseId, formData }));

            // Hiển thị thông báo thành công
            showNotice('success', 'Successfully created module');
            dispatch(toggleRefresh());

            await new Promise(resolve => setTimeout(resolve, 1500));

            // Chuyển hướng
            navigate(`/course-management/${courseId}/module`);

            // Hiện dialog xác nhận
            // if (window.confirm("Reload the page to display the newly created module?")) {
            //     window.location.reload();
            // }
        } catch (error) {
            showNotice('error', error);
        }


    };
    if (!courseId) {
        showNotice('error', 'Course not found');
    }
    return (
        <div className=" bg-gray-50 py-8 px-4">
            <Paper className="max-w-2xl mx-auto p-6">
                <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                    Create New Module
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-3">

                    {/* <TextField
                        fullWidth
                        label="Index" placeholder="1, 2, 3, ..."
                        name="index"
                        value={formData.index}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-white"
                    /> */}

                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-white"
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        className="bg-white"
                    />

                    <Box className="flex justify-end space-x-3">
                        <Button
                            variant="outlined"
                            onClick={() => window.history.back()}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Create
                        </Button>
                    </Box>
                </form>
            </Paper>
        </div>
    )
}

export default NewModule
