import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { deleteModule, getAllModules, updateModule } from '~/store/slices/Module/action';
import { clearError, toggleRefresh } from '~/store/slices/Module/moduleSlice';
import DelModuleModal from '../Component/DelModuleModal';
import { Delete as DeleteIcon } from '@mui/icons-material';


const EditModule = () => {
    const { courseId, moduleId } = useParams();
    const { modules, error } = useSelector((state) => state.module);
    const { showNotice } = useNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const moduleData = location.state?.currentModule;


    const [formData, setFormData] = useState({
        courseId: courseId,
        index: '',
        title: '',
        description: '',
        // index: moduleData?.index,
        // title: moduleData?.title,
        // description: moduleData?.description,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(getAllModules(courseId));
            } catch (error) {
                showNotice('error', "Error fetching module data  ");
                console.error("Error fetching module data:", error);
            }
        };

        fetchData();
    }, [dispatch, courseId, moduleId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (moduleData) {
                    clearData();
                    setFormData({
                        index: moduleData.index,
                        title: moduleData.title,
                        description: moduleData.description,
                    });

                } else if (modules.length > 0) {
                    const currentModule = modules.find(module => module.index === moduleId);
                    setFormData({
                        index: currentModule.index,
                        title: currentModule.title,
                        description: currentModule.description,
                    });
                }
                console.log("cur", moduleData);
            } catch (error) {
                showNotice('error', "Error fetching module data  ");
                console.error("Error fetching module data:", error);
            }
        };

        fetchData();
    }, [dispatch, moduleData]);

    useEffect(() => {
        if (error) {
            showNotice('error', error);
            dispatch(clearError());
        }
    }, [error]);
    const clearData = () => {
        setFormData({
            index: '',
            title: '',
            description: '',
        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update module
            await dispatch(updateModule({ courseId, moduleId, formData }));
            console.log("form Data ", formData);
            clearData();
            dispatch(toggleRefresh())
            showNotice('success', "Upadated successfully")
            navigate(`/course-management/${courseId}/module`);
        } catch (err) {
            //showNotice('error', "error updating module");
            console.error("update module error", err);
            return;
        }


    }

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
        console.log("handleDeleteClick", isDeleteModalOpen);
    };

    const handleConfirmDelete = async (password) => {
        setIsDeleting(true);
        try {

            // If password is correct, proceed with deletion

            await dispatch(deleteModule({ courseId, moduleId, password })).unwrap();

            showNotice('success', 'Module deleted successfully');
            setIsDeleteModalOpen(false);
            navigate(`/course-management/${courseId}/module`);
            dispatch(toggleRefresh());

        } catch (error) {
            //showNotice('error', error.toString());
        } finally {
            setIsDeleting(false);
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

    // }

    return (
        <div className="  bg-gray-50 py-8 px-4">
            <Paper className="max-w-2xl mx-auto p-6">
                <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                    Edit Module
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <TextField
                        fullWidth
                        label="Index" placeholder="1, 2, 3, ..."
                        name="index"
                        disabled={true}
                        value={formData.index || ''}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-white"
                    />

                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-white"
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        className="bg-white"
                    />

                    <Box className="flex justify-between space-x-3">
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteClick}

                        >
                            Delete Module
                        </Button>
                        <DelModuleModal
                            open={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            onConfirm={handleConfirmDelete}
                            moduleName={formData?.title}
                            isLoading={isDeleting}
                        />
                        <div className='flex gap-3'>


                            <Button
                                variant="outlined"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Update
                            </Button>
                        </div>
                    </Box>
                </form>
            </Paper>
        </div>
    )
}

export default EditModule
