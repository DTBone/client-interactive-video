import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, TextField, MenuItem, FormControlLabel, Switch, Button, CircularProgress,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse';
import ErrorModal from '~/Components/ErrorModal';
import { createCourse, getCourseByID, updateCourse } from '~/store/slices/Course/action';
import spinnerLoading from '~/assets/spinnerLoading.gif';

const CourseSection = () => {
    const { courseId } = useParams();
    const { currentCourse, loading, error } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const [courseData, setCourseData] = useState({});
    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const [currentModule, setCurrentModule] = useState({ title: '', description: '' });

    useEffect(() => {
        if (courseId) {
            dispatch(getCourseByID(courseId));
        }
    }, [courseId, dispatch]);

    useEffect(() => {
        if (currentCourse?.data) {
            setCourseData(currentCourse.data);
        }
    }, [currentCourse]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const newValue = name === 'price' ? Number(value) : value;

        setCourseData(prev => {
            const updatedData = { ...prev, [name]: newValue };

            return updatedData;
        });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (actionType) => {
        let updatedCourseData;

        if (actionType === 'delete') {
            updatedCourseData = { ...courseData, status: 'unpublished' };
        } else if (actionType === 'published') {
            updatedCourseData = { ...courseData, status: 'published' };
        } else if (actionType === 'draft') {
            updatedCourseData = { ...courseData, status: 'draft' };
        } else {
            updatedCourseData = { ...courseData };
        }

        setCourseData(updatedCourseData);
        console.log('Updated course data:', updatedCourseData);

        switch (actionType) {
            case 'delete':
            case 'published':
                if (courseId) {
                    dispatch(updateCourse({ courseId, courseData: updatedCourseData }));
                    console.log(`${actionType} course:`, updatedCourseData);
                }
                break;
            case 'draft': // Lưu khóa học dưới dạng nháp
                if (!courseId) {
                    // Nếu không có courseId, tạo khóa học mới dưới dạng nháp
                    dispatch(createCourse({ ...courseData, status: 'draft' }));
                } else {
                    // Nếu đã có courseId, cập nhật khóa học với trạng thái nháp
                    dispatch(updateCourse({ courseId: courseId, ...courseData, status: 'draft' }));
                }
                console.log('draft', courseData)
                break;
            default: // Tạo hoặc cập nhật khóa học với trạng thái 'published'
                if (courseId) {
                    dispatch(updateCourse({ courseId: courseId, ...courseData, status: 'published' }));
                } else {
                    dispatch(createCourse({ ...courseData, status: 'published' }));
                }
                console.log('update', courseData)
                break;
        }
    };


    const handleOpenModuleDialog = (module = null) => {
        setCurrentModule(module || { title: '', description: '' });
        setOpenModuleDialog(true);
    };

    const handleCloseModuleDialog = () => {
        setOpenModuleDialog(false);
    };

    const handleSaveModule = () => {
        if (currentModule.id) {
            // Update existing module
            setCourseData(prev => ({
                ...prev,
                modules: prev.modules.map(m => m.id === currentModule.id ? currentModule : m)
            }));
        } else {
            // Add new module
            setCourseData(prev => ({
                ...prev,
                modules: [...(prev.modules || []), { ...currentModule, id: Date.now() }]
            }));
        }
        handleCloseModuleDialog();
    };

    const handleDeleteModule = (moduleId) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== moduleId)
        }));
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <img alt="Loading" src={spinnerLoading} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <ErrorModal errorMessage={error} />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header>
                <HeaderCourse />
            </header>
            <div className="flex h-full px-6 overflow-y-auto pt-5">
                <form onSubmit={handleSubmit} className="w-full">
                    <Grid container spacing={3}>
                        {/* Course ID */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required

                                label="Course ID"
                                name="courseId"
                                value={courseData?.courseId || ''}
                                onChange={handleInputChange}
                                disabled={!!courseId}
                            />
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Course Title"
                                name="title"
                                value={courseData.title || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={courseData.description || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Level price approved*/}

                        <Grid item xs={12} md={4}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Level"
                                name="level"
                                value={courseData.level || 'beginner'}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                required
                                fullWidth
                                type='number'
                                label="Price"
                                name="price"
                                value={courseData.price || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Approved By"
                                value={courseData?.approvedBy?.email || 'Pending Approval'}
                                disabled
                            />
                        </Grid>

                        {/* <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={courseData.status === 'published'}
                                        onChange={(e) => handleSwitchChange({
                                            target: {
                                                name: 'status',
                                                value: e.target.checked ? 'published' : 'draft'
                                            }
                                        })}
                                    />
                                }
                                label="Public"
                            />
                        </Grid> */}



                        {/* Photo Upload */}
                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="photo-upload"
                                type="file"
                                onChange={handlePhotoUpload}
                            />
                            <label htmlFor="photo-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                >
                                    Upload Photo
                                </Button>
                            </label>
                            {courseData.photo && (
                                <div className="mt-2 border p-2">
                                    <img
                                        src={courseData.photo}
                                        alt="Course"
                                        className="w-40 h-40 object-cover"
                                    />
                                    <p className="mt-2">Path: {courseData.photo}</p>
                                </div>
                            )}
                        </Grid>

                        {/* Modules */}
                        {courseId ? (
                            <Grid item xs={12}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3>Modules</h3>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenModuleDialog()}
                                    >
                                        Add Module
                                    </Button>
                                </div>
                                <List>
                                    {courseData.modules?.map((module, index) => (
                                        <ListItem key={module.id} divider>
                                            <ListItemText
                                                primary={`${index + 1}. ${module.title}`}
                                                secondary={module.description}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" onClick={() => handleOpenModuleDialog(module)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton edge="end" onClick={() => handleDeleteModule(module.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        ) : (<p />)}


                        {/* Save Button */}
                        <Grid item xs={12} md={6}>

                            {courseId ? (courseData.status === "published" ?
                                (<Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={loading}
                                    fullWidth
                                    onClick={() => handleSubmit('delete')}
                                    style={{ marginBottom: '10px' }}
                                >
                                    Delete as Course
                                </Button>) : (<Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={loading}
                                    fullWidth
                                    onClick={() => handleSubmit('published')}
                                    style={{ marginBottom: '10px' }}
                                >
                                    Published as Course
                                </Button>)) : (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={loading}
                                    fullWidth
                                    onClick={() => handleSubmit('draft')}
                                    style={{ marginBottom: '10px' }}
                                >
                                    Save as Draft
                                </Button>
                            )}


                        </Grid>

                        <Grid item xs={12} md={6} >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                style={{ marginBottom: '10px' }}
                                onClick={() => handleSubmit()}
                            >
                                {loading ? <CircularProgress size={24} /> : (courseId ? 'Update Course' : 'Create Course')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>

            {/* Module Dialog */}
            <Dialog open={openModuleDialog} onClose={handleCloseModuleDialog}>
                <DialogTitle>{currentModule.id ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Module Title"
                        type="text"
                        fullWidth
                        value={currentModule.title}
                        onChange={(e) => setCurrentModule(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Module Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentModule.description}
                        onChange={(e) => setCurrentModule(prev => ({ ...prev, description: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModuleDialog}>Cancel</Button>
                    <Button onClick={handleSaveModule}>Save</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default CourseSection;