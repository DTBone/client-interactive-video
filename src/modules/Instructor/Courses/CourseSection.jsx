import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, TextField, MenuItem, Button, CircularProgress,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse';
import ErrorModal from '~/Components/ErrorModal';
import { createCourse, getCourseByID, updateCourse } from '~/store/slices/Course/action';
import spinnerLoading from '~/assets/spinnerLoading.gif';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';

import ImageUpload from './UploadImage';
import NoticeSnackbar from '~/Components/Common/NoticeSnackbar';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { clearError } from '~/store/slices/Course/courseSlice';

const CourseSection = ({ state }) => {
    const { courseId } = useParams();
    const { currentCourse, loading, error } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState({});

    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const [currentModule, setCurrentModule] = useState({
        id: null,
        index: 1,
        title: '',
    });

    const [imageUrl, setImageUrl] = useState(courseData.photo || '');
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        if (state === 'new') {
            setCourseData({});
            setImageUrl('');
            setCurrentModule({ title: '', description: '' });
            // Clear redux state nếu cần
            dispatch({ type: 'CLEAR_CURRENT_COURSE' }); // Thêm action này vào reducer
        }
    }, [state]);
    useEffect(() => {
        const fetchCourse = async () => {
            if (state === 'edit' && courseId) {
                setIsLoading(true);
                try {
                    await dispatch(getCourseByID(courseId));
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCourse();
    }, [courseId, state]);

    useEffect(() => {
        if (state === 'edit' && currentCourse) {
            setCourseData(currentCourse);
            setImageUrl(currentCourse.photo || '');
        }
    }, [currentCourse, state]);

    useEffect(() => {
        if (currentCourse?.data) {
            setCourseData(currentCourse.data);
        }
        console.log('course:', courseData, error)
    }, [currentCourse]);
    useEffect(() => {

        setCourseData(prev => ({ ...prev, photo: imageUrl }));
        // console.log('imageUrl:', imageUrl);
        // console.log('currentcourse image:', currentCourse?.data?.photo);
        // console.log('courseData image:', courseData.photo);
    }, [imageUrl]);

    useEffect(() => {
        let mounted = true;

        const fetchCourse = async () => {
            if (state === 'edit' && courseId && mounted) {
                setIsLoading(true);
                try {
                    await dispatch(getCourseByID(courseId));
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    if (mounted) {
                        setIsLoading(false);
                    }
                }
            }
        };

        fetchCourse();

        return () => {
            mounted = false;
        };
    }, [courseId, state]);

    useEffect(() => {
        if (error) {
            showSnackbar('error', error);
            // Có thể clear error sau khi đã hiển thị
            dispatch(clearError());
        }
    }, [error]);
    useEffect(() => {
        console.log("courseData changed:", courseData);
        console.log("modules:", courseData.modules);
    }, [courseData]);
    // useEffect(() => {
    //     console.log('Component State:', state);
    //     console.log('Course Data:', courseData);
    //     console.log('Current Course from Redux:', currentCourse);
    // }, [state, courseData, currentCourse]);
    //snackbar

    const [snackbar, setSnackbar] = React.useState({
        status: 'success',
        content: ''
    });
    const [open, setOpen] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const showSnackbar = (status, content) => {
        setSnackbar({
            status: status,
            content: content
        });
        setOpen(true);  // Set open riêng
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const newValue = name === 'price' ? Number(value) : value;

        setCourseData(prev => {
            const updatedData = { ...prev, [name]: newValue };

            return updatedData;
        });
    };




    // const handleSubmit = async (actionType) => {
    //     try {
    //         let updatedCourseData;

    //         if (actionType === 'delete') {
    //             updatedCourseData = { ...courseData, status: 'unpublished' };
    //         } else if (actionType === 'published') {
    //             updatedCourseData = { ...courseData, status: 'published' };
    //         } else if (actionType === 'draft') {
    //             updatedCourseData = { ...courseData, status: 'draft' };
    //         } else {
    //             updatedCourseData = { ...courseData };
    //         }

    //         setCourseData(updatedCourseData);
    //         console.log('Updated course data:', updatedCourseData);

    //         switch (actionType) {
    //             case 'delete':
    //             case 'published':
    //                 if (courseId) {
    //                     await dispatch(updateCourse({ courseId, courseData: updatedCourseData }));
    //                     showSnackbar('success', 'Update status course successfully!');
    //                     //console.log(`${actionType} course:`, updatedCourseData);
    //                 }
    //                 break;
    //             case 'draft': // Lưu khóa học dưới dạng nháp
    //                 if (!courseId) {
    //                     // Nếu không có courseId, tạo khóa học mới dưới dạng nháp

    //                     showSnackbar('success', 'Create course draft successfully!');

    //                 } else {
    //                     // Nếu đã có courseId, cập nhật khóa học với trạng thái nháp
    //                     await dispatch(updateCourse({ courseId: courseId, ...courseData, status: 'draft' }));

    //                     showSnackbar('success', 'Update course draft successfully!');

    //                 }
    //                 //console.log('draft', courseData)
    //                 break;
    //             default: // Tạo hoặc cập nhật khóa học với trạng thái 'published'
    //                 if (courseId) {
    //                     updatedCourseData = { ...courseData, status: 'published', photo: imageUrl };
    //                     await dispatch(updateCourse({ courseId, courseData: updatedCourseData }));

    //                     showSnackbar('success', 'Update course successfully!');

    //                 } else {
    //                     await dispatch(createCourse({ ...courseData, status: 'published' }));

    //                     showSnackbar('success', 'Create course successfully!');

    //                 }
    //                 console.log('update', courseData)
    //                 break;
    //         }



    //         // Sau khi update thành công, fetch lại dữ liệu mới
    //         if (courseId) {
    //             await dispatch(getCourseByID(courseId));
    //         }
    //     } catch (error) {
    //         showSnackbar('error', `error: ${error.message}`);

    //     }
    // };
    const handleSubmit = async (actionType) => {
        try {
            let updatedCourseData;


            // Xác định courseData và message dựa trên actionType
            switch (actionType) {
                case 'delete':
                    updatedCourseData = { ...courseData, status: 'unpublished' };

                    break;
                case 'published':
                    updatedCourseData = { ...courseData, status: 'published' };

                    break;
                case 'draft':
                    updatedCourseData = { ...courseData, status: 'draft' };

                    break;
                default:
                    updatedCourseData = {
                        ...courseData,
                        status: 'published',
                        photo: imageUrl
                    };

            }

            setCourseData(updatedCourseData);

            // Thực hiện action tương ứng
            if (courseId) {
                // Update existing course
                await dispatch(updateCourse({
                    courseId,
                    courseData
                })).unwrap();


                showSnackbar('success', 'Course updated successfully!');
                // Fetch lại dữ liệu sau khi update thành công
                await dispatch(getCourseByID(courseId));

            } else {
                // Create new published course
                await dispatch(createCourse(courseData)).unwrap();


                showSnackbar('success', 'Course created successfully!');
                await dispatch(getCourseByID(courseId));
            }

        } catch (error) {
            showSnackbar('error', "Error while performing ");
            console.error('Error details:', error);
        }
    };
    // Xử lý module

    const handleOpenModuleDialog = (module) => {

        if (module) {
            // Edit existing module - keep current index and title
            setCurrentModule({
                id: module._id ? module._id : module.id,
                index: module.index,
                title: module.title
            });
        } else {
            // Add new module - calculate next index
            const nextIndex = courseData.modules ? courseData.modules.length + 1 : 1;
            setCurrentModule({
                id: null,
                index: nextIndex,
                title: ''
            });
        }

        setOpenModuleDialog(true);
    };


    const handleCloseModuleDialog = () => {
        setCurrentModule({
            id: null,
            index: 1,
            title: ''
        });
        setOpenModuleDialog(false);
    };

    const handleSaveModule = () => {
        if (!currentModule.title.trim()) {
            // Validate empty title
            return;
        }

        setCourseData(prev => {
            const newModule = currentModule.id
                ? currentModule // Nếu đang update module cũ
                : {
                    id: Date.now(),
                    index: currentModule.index, // Tự động tạo index
                    title: currentModule.title.trim(),
                    moduleItems: [] // Khởi tạo mảng rỗng cho moduleItems
                };
            const updatedData = currentModule.id
                ? {
                    ...prev,
                    modules: prev.modules.map(m =>
                        m.id === currentModule.id
                            ? newModule
                            : m
                    )
                }
                : {
                    ...prev,
                    modules: [...(prev.modules || []), newModule]
                };

            // Log trong callback để xem giá trị mới
            console.log("Updated course data:", updatedData.modules);
            return updatedData;
        });
        console.log("course data: ", courseData)
        console.log("module data: ", courseData.modules)
        handleCloseModuleDialog();
    };

    // const handleDeleteModule = (moduleId) => {
    //     setCourseData(prev => {
    //         // Remove module and reindex remaining modules
    //         const filteredModules = prev.modules
    //             .filter(m => m.id !== moduleId)
    //             .map((module, idx) => ({
    //                 ...module,
    //                 index: idx + 1
    //             }));

    //         return {
    //             ...prev,
    //             modules: filteredModules
    //         };
    //     });
    // };
    const handleOpenModuleSection = (courseId, moduleindex) => {
        if (!courseId || !moduleindex) return;
        const courseSlug = courseId.trim().toLowerCase().replace(/\s+/g, '-');
        if (!moduleindex) {
            navigate(`/course-management/${courseSlug}/module`);
        }

        // Create URL-friendly strings



        navigate(`/course-management/${courseSlug}/module/${moduleindex}`);
    };



    if (loading || isLoading) {
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
                <Breadcrumb />
            </header>
            {open ? <NoticeSnackbar
                open={open}
                handleClose={handleClose}
                status={snackbar.status}
                content={snackbar.content}

            /> : null}
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


                        <Grid item xs={12}>
                            <ImageUpload initialImage={currentCourse?.data?.photo} setCourseData={setCourseData} setImageUrl={setImageUrl} />
                        </Grid>

                        {/* Modules */}
                        {courseId ?
                            (
                                <Grid item xs={12}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3
                                            onClick={() => handleOpenModuleSection(courseId, 1)}
                                            style={{
                                                cursor: 'pointer',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                        >
                                            Modules
                                        </h3>
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenModuleDialog()}
                                        >
                                            Add Module
                                        </Button>
                                    </div>
                                    <List>
                                        {courseData.modules?.map((module, index) => (
                                            <ListItem
                                                key={module.id}
                                                divider
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleOpenModuleSection(courseId, module.index)}
                                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                            >
                                                <ListItemText
                                                    primary={`${index + 1}. Module ${module.index}`}
                                                    secondary={module.title}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện click lan tỏa
                                                        handleOpenModuleDialog(module);
                                                    }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    {/* <IconButton edge="end" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteModule(module.id);
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton> */}
                                                    <IconButton edge="end" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenModuleSection(courseId, module.index);
                                                    }}>
                                                        <ArrowRightAltIcon />
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
                        sx={{ width: '300px' }}
                    />

                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button onClick={handleCloseModuleDialog}>Cancel</Button>
                    <div className='space-x-2'>
                        <Button onClick={() => handleOpenModuleSection(courseId, currentModule.index)}>Detail</Button>
                        <Button onClick={handleSaveModule}>Save</Button>
                    </div>
                </DialogActions>

            </Dialog>
        </div >
    );
};

export default CourseSection;