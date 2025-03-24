import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, TextField, MenuItem, Button, CircularProgress,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip, Paper,
    Autocomplete,
    Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse';
import { createCourse, getCourseByID, updateCourse } from '~/store/slices/Course/action';
import spinnerLoading from '~/assets/spinnerLoading.gif';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
import ImageUpload from './UploadImage'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { clearCurrentCourse, clearError } from '~/store/slices/Course/courseSlice';
import { useNotification } from '~/hooks/useNotification';
import { uploadToCloudnary } from '~/Utils/uploadToCloudnary';
import Header from '~/Components/Header';

const suggestedTags = [
    // Ngôn ngữ lập trình
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
    // Framework & Libraries
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js',
    // Database
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    // Development Tools
    'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
    // Mobile Development
    'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',
    // Web Development
    'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'TypeScript', 'WebPack', 'REST API', 'GraphQL',
    // Testing
    'Unit Testing', 'Integration Testing', 'Jest', 'Selenium', 'Cypress',
    // Development Concepts
    'OOP', 'Design Patterns', 'Data Structures', 'Algorithms', 'Clean Code', 'Microservices',
    'DevOps', 'Agile', 'TDD', 'CI/CD',
    // Security
    'Cybersecurity', 'Authentication', 'Authorization', 'OAuth', 'JWT',
    // Level
    'Beginner', 'Intermediate', 'Advanced',
    // Course Type
    'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning', 'AI',
    'Game Development', 'Mobile Development', 'Desktop Development'
];

const CourseSection = ({ state }) => {
    const { courseId } = useParams();
    const [courseID, setCourseID] = useState(courseId || null);
    const { currentCourse, loading, error } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showNotice } = useNotification();
    const [courseData, setCourseData] = useState({});
    const [currentTag, setCurrentTag] = useState(null);
    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const [currentModule, setCurrentModule] = useState({
        id: null,
        index: 1,
        title: '',
        description: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestedTags);

    const handleTagChange = (event, newValue) => {
        if (newValue && !courseData.tags?.includes(newValue)) {
            setCourseData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newValue]
            }));
            setCurrentTag(null);
            setInputValue('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setCourseData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToDelete)
        }));
    };

    useEffect(() => {
        if (state === 'new') {
            setCourseData({});
            setCurrentModule({ title: '', description: '' });
            setSelectedImageFile(null);
            // Clear redux state nếu cần
            dispatch({ type: 'CLEAR_CURRENT_COURSE' }); // Thêm action này vào reducer
        }
    }, [state]);


    useEffect(() => {
        let mounted = true;
        const fetchCourse = async () => {
            if (state === 'edit' && courseID && mounted) {
                //setIsLoading(true);
                try {
                    //dispatch(clearCurrentCourse());
                    console.log('courseId effect:', courseID);
                    await dispatch(getCourseByID(courseID));

                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    if (mounted) {
                        //setIsLoading(false);
                    }
                }
            }
        };
        fetchCourse();

        return () => {
            mounted = false;
        };
    }, [courseID, state]); // Chỉ gọi lại khi courseId thay đổi

    useEffect(() => {
        if (error) {
            showNotice('error', "Error fetching course");
            dispatch(clearError());
        }
    }, [error]);

    useEffect(() => {
        if (currentCourse) {
            setCourseData(currentCourse);
            setSelectedImageFile(currentCourse.photo);
        }
        console.log('course:', currentCourse, error, loading,);
        console.log('courseData:', courseData);
    }, [currentCourse])
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const newValue = name === 'price' ? Number(value) : value;

        setCourseData(prev => {
            const updatedData = { ...prev, [name]: newValue };

            return updatedData;
        });
    };


    const handleSubmit = async (actionType, e) => {
        if (e) e.preventDefault();

        if (!courseData.courseId) {
            showNotice("error", 'Please enter a course ID');
            return;
        }
        if (!courseData.title) {
            showNotice("error", 'Please enter a title');
            return;
        }
        if (!courseData.description) {
            showNotice("error", 'Please enter a description');
            return;
        }

        try {
            setIsLoading(true);

            let uploadedImageUrl = courseData.photo; // Giữ ảnh cũ nếu không có ảnh mới
            // Upload ảnh lên Cloudinary nếu có file ảnh mới được chọn
            if (selectedImageFile) {
                try {
                    uploadedImageUrl = await uploadToCloudnary(selectedImageFile);
                } catch (error) {
                    showNotice('error', "Error uploading image");
                    console.error('Error uploading image:', error);
                    return; // Exit if image upload fails
                }
            }


            const updatedCourseData = (() => {
                const baseData = {
                    ...courseData,
                    photo: uploadedImageUrl
                };

                switch (actionType) {
                    case 'delete':
                        return { ...baseData, status: 'unpublished' };
                    case 'published':
                        return { ...baseData, status: 'published' };
                    case 'draft':
                        return { ...baseData, status: 'draft' };
                    default:
                        return { ...baseData, status: 'published' };
                }
            })();

            setCourseData(updatedCourseData);


            // Thực hiện action tương ứng
            if (courseId) {
                await dispatch(updateCourse({
                    courseId,
                    courseData: updatedCourseData
                })).unwrap();
                showNotice('success', 'Course updated successfully!');
                await dispatch(getCourseByID(courseId));
            } else {
                await dispatch(createCourse(updatedCourseData)).unwrap();
                showNotice('success', 'Course created successfully!');
                navigate('/instructor/course-management', { replace: true });
            }


        } catch (error) {
            showNotice('error', "Error while performing action");
            console.error('Error details:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // Xử lý module

    const handleOpenModuleDialog = (module) => {

        if (module) {
            // Edit existing module - keep current index and title
            setCurrentModule({
                id: module._id ? module._id : module.id,
                index: module.index,
                title: module.title,
                description: module.description,
            });
        } else {
            // Add new module - calculate next index
            const nextIndex = courseData.modules ? courseData.modules.length + 1 : 1;
            setCurrentModule({
                id: null,
                index: nextIndex,
                title: '',
                description: '',
            });
        }

        setOpenModuleDialog(true);
    };


    const handleCloseModuleDialog = () => {
        setCurrentModule({
            id: null,
            index: 1,
            title: '',
            description: '',
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
                    description: currentModule.description.trim(),  // Thêm description vào module
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
            //console.log("Updated course data:", updatedData.modules);
            return updatedData;
        });
        //console.log("course data: ", courseData)
        //console.log("module data: ", courseData.modules)
        handleCloseModuleDialog();
    };


    const handleOpenModuleSection = (courseId, moduleindex) => {
        // Ensure courseId and moduleindex are valid
        console.log("courseId: ", courseId);
        if (!courseId || moduleindex == null) {
            console.error('Invalid courseId or moduleindex:', { courseId, moduleindex });
            return;
        }

        // Create a URL-friendly slug from courseId
        const courseSlug = courseId.trim().toLowerCase().replace(/\s+/g, '-');

        // Build the navigation path
        const path = moduleindex === 0
            ? `/course-management/${courseSlug}/module`
            : `/course-management/${courseSlug}/module/${moduleindex}`;

        // Navigate to the constructed path
        navigate(path);
    };




    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <img alt="Loading" src={spinnerLoading} />
            </div>
        );
    }


    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header>
                <Header />
                <Divider />
                <div className=" px-6">
                    <Breadcrumb
                        courseId={courseID}
                    // moduleIndex={currentModule.index}
                    // itemTitle={currentModule.title}
                    // courseTitle={courseData.title}
                    // handleClickNewCourse={() => {
                    //     dispatch(clearCurrentCourse());
                    //     navigate(`/course-management/new-course`);
                    // }}
                    // handleClick={() => {
                    //     if (courseID) {
                    //         navigate(`/course-management/${courseID}`);
                    //     } else {
                    //         navigate(`/course-management`);
                    //     }
                    // }}
                    />
                </div>


            </header>

            <div className="flex h-full overflow-y-auto pt-5 px-6">
                <form onSubmit={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleSubmit('published', e);
                }}
                    className="w-full">
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
                            <ImageUpload
                                initialImage={currentCourse?.data?.photo}
                                setCourseData={setCourseData}
                                onFileSelect={setSelectedImageFile}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} className="p-3 border rounded">
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <Autocomplete
                                            value={currentTag}
                                            onChange={handleTagChange}
                                            inputValue={inputValue}
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                            }}
                                            options={suggestedTags.filter(tag =>
                                                !courseData.tags?.includes(tag)
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    label="Add Tag"
                                                    placeholder="Type or select a tag"
                                                    fullWidth
                                                />
                                            )}
                                            freeSolo
                                            style={{ minWidth: 250 }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {courseData.tags?.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => handleDeleteTag(tag)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </div>
                                    {/* Tag Suggestions Section */}
                                    {!courseData.tags?.length && (
                                        <div className="mt-2">
                                            <div className="text-sm text-gray-600 mb-2">Suggested tags:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {suggestedTags.slice(0, 10).map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        onClick={() => handleTagChange(null, tag)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Paper>
                        </Grid>

                        {/* Modules */}
                        {courseId ?
                            (
                                <Grid item xs={12}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3
                                            onClick={() => handleOpenModuleSection(courseId, 0)}
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
                                                key={index}
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
                                //disabled={loading}
                                fullWidth
                                style={{ marginBottom: '10px' }}
                                onClick={(e) => handleSubmit('published', e)}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : (courseId ? 'Update Course' : 'Create Course')}
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
                    //sx={{ width: '300px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        multiline
                        rows={4}
                        type="text"
                        fullWidth
                        value={currentModule.description}
                        onChange={(e) => setCurrentModule(prev => ({ ...prev, description: e.target.value }))}
                    //sx={{ width: '300px' }}
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