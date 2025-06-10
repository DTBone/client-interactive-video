// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     Grid, TextField, MenuItem, Button, CircularProgress,
//     List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle,
//     DialogContent, DialogActions, Chip, Paper, Stepper, Step, StepLabel, StepContent,
//     Autocomplete, Card, CardContent, CardHeader, CardMedia, CardActionArea,
//     Divider, Box, Typography, Container, Tooltip, Alert, Tabs, Tab,
// } from '@mui/material';
// import { 
//     Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
//     School as SchoolIcon, VideoLibrary as VideoIcon, 
//     Tag as TagIcon, MenuBook as CourseIcon, CheckCircle as CheckIcon,
//     Info as InfoIcon, Description as DescriptionIcon, MonetizationOn as PriceIcon,
//     ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon,
//     OndemandVideo as VideoFileIcon
// } from '@mui/icons-material';
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
// import { createCourse, getCourseByID, updateCourse } from '~/store/slices/Course/action';
// import spinnerLoading from '~/assets/spinnerLoading.gif';
// import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
// import ImageUpload from './UploadImage';
// import { clearCurrentCourse, clearError } from '~/store/slices/Course/courseSlice';
// import { useNotification } from '~/Hooks/useNotification';
// import { uploadToCloudnary } from '~/Utils/uploadToCloudnary';
// import Header from '~/Components/Header';
// import FileUpload from '../Modules/Component/FileUpload';

// const suggestedTags = [
//     // Ngôn ngữ lập trình
//     'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
//     // Framework & Libraries
//     'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js',
//     // Database
//     'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
//     // Development Tools
//     'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
//     // Mobile Development
//     'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',
//     // Web Development
//     'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'TypeScript', 'WebPack', 'REST API', 'GraphQL',
//     // Testing
//     'Unit Testing', 'Integration Testing', 'Jest', 'Selenium', 'Cypress',
//     // Development Concepts
//     'OOP', 'Design Patterns', 'Data Structures', 'Algorithms', 'Clean Code', 'Microservices',
//     'DevOps', 'Agile', 'TDD', 'CI/CD',
//     // Security
//     'Cybersecurity', 'Authentication', 'Authorization', 'OAuth', 'JWT',
//     // Level
//     'Beginner', 'Intermediate', 'Advanced',
//     // Course Type
//     'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning', 'AI',
//     'Game Development', 'Mobile Development', 'Desktop Development'
// ];

// const CourseSection = ({ state }) => {
//     const { courseId } = useParams();
//     const [courseID, setCourseID] = useState(courseId || null);
//     const { currentCourse, loading, error } = useSelector((state) => state.course);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { showNotice } = useNotification();
//     const [courseData, setCourseData] = useState({});
//     const [currentTag, setCurrentTag] = useState(null);
//     const [activeStep, setActiveStep] = useState(0);
//     const [activeTab, setActiveTab] = useState(0);
//     const [openModuleDialog, setOpenModuleDialog] = useState(false);
//     const [currentModule, setCurrentModule] = useState({
//         id: null,
//         index: 1,
//         title: '',
//         description: '',
//     });

//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedImageFile, setSelectedImageFile] = useState(null);
//     const [inputValue, setInputValue] = useState('');
//     const [filteredSuggestions, setFilteredSuggestions] = useState(suggestedTags);
//     const [formValidation, setFormValidation] = useState({
//         basicInfo: false,
//         media: false,
//         tags: false
//     });

//     const [videoPreview, setVideoPreview] = useState(currentCourse?.sumaryVideo || '');
//     const [videoKey, setVideoKey] = useState(0);
//     const videoRef = useRef(null);
//     const [fileVideo, setFileVideo] = useState(null);

//     // Thêm tab categories cho tags
//     const [tagCategory, setTagCategory] = useState('all');

//     const handleTagChange = (event, newValue) => {
//         if (newValue && !courseData.tags?.includes(newValue)) {
//             setCourseData(prev => ({
//                 ...prev,
//                 tags: [...(prev.tags || []), newValue]
//             }));
//             setCurrentTag(null);
//             setInputValue('');
            
//             // Validate tag section when tags are added
//             validateForm('tags', [...(courseData.tags || []), newValue].length > 0);
//         }
//     };
    
//     const handleDeleteTag = (tagToDelete) => {
//         const updatedTags = courseData.tags.filter(tag => tag !== tagToDelete);
//         setCourseData(prev => ({
//             ...prev,
//             tags: updatedTags
//         }));
        
//         // Validate tag section when tags are removed
//         validateForm('tags', updatedTags.length > 0);
//     };
    
//     // Form validation
//     const validateForm = (section, isValid) => {
//         setFormValidation(prev => ({
//             ...prev,
//             [section]: isValid
//         }));
//     };

//     // Validate basic info whenever relevant fields change
//     useEffect(() => {
//         if (courseData.courseId && courseData.title && courseData.description) {
//             validateForm('basicInfo', true);
//         } else {
//             validateForm('basicInfo', false);
//         }
//     }, [courseData.courseId, courseData.title, courseData.description]);
    
//     // Validate tag section whenever tags change
//     useEffect(() => {
//         if (courseData.tags && courseData.tags.length > 0) {
//             validateForm('tags', true);
//         }
//     }, [courseData.tags]);
    
//     // Các hàm điều hướng stepper
//     const handleNext = () => {
//         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     };
    
//     const handleBack = () => {
//         setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     };
    
//     const handleReset = () => {
//         setActiveStep(0);
//     };
    
//     // Xử lý thay đổi tab
//     const handleTabChange = (event, newValue) => {
//         setActiveTab(newValue);
//     };

//     // Xử lý thay đổi tag category
//     const handleTagCategoryChange = (category) => {
//         setTagCategory(category);
//     };

//     // Filter tags by category
//     const getFilteredTags = (category) => {
//         const categoryMap = {
//             'languages': suggestedTags.slice(0, 11),
//             'frameworks': suggestedTags.slice(11, 20),
//             'database': suggestedTags.slice(20, 27),
//             'tools': suggestedTags.slice(27, 34),
//             'mobile': suggestedTags.slice(34, 39),
//             'web': suggestedTags.slice(39, 48),
//             'level': ['Beginner', 'Intermediate', 'Advanced'],
//             'all': suggestedTags
//         };
        
//         return category === 'all' ? suggestedTags : (categoryMap[category] || []);
//     };

//     useEffect(() => {
//         if (state === 'new') {
//             setCourseData({});
//             setCurrentModule({ title: '', description: '' });
//             setSelectedImageFile(null);
//             // Clear redux state
//             dispatch(clearCurrentCourse());
//         }
//     }, [state, dispatch]);


//     useEffect(() => {
//         let mounted = true;
//         const fetchCourse = async () => {
//             if (state === 'edit' && courseID && mounted) {
//                 try {
//                     await dispatch(getCourseByID(courseID));
//                 } catch (error) {
//                     console.error('Error:', error);
//                 }
//             }
//         };
//         fetchCourse();

//         return () => {
//             mounted = false;
//         };
//     }, [courseID, state, dispatch]); 

//     useEffect(() => {
//         if (error) {
//             showNotice('error', "Error fetching course");
//             dispatch(clearError());
//         }
//     }, [error, dispatch, showNotice]);

//     useEffect(() => {
//         if (currentCourse) {
//             setCourseData(currentCourse);
//             setSelectedImageFile(currentCourse.photo);
//             setVideoPreview(currentCourse.sumaryVideo);
            
//             // Update form validation based on current data
//             validateForm('basicInfo', 
//                 currentCourse.courseId && currentCourse.title && currentCourse.description);
//             validateForm('tags', currentCourse.tags && currentCourse.tags.length > 0);
//             validateForm('media', true); // Media is optional
//         }
//     }, [currentCourse]);
    
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         const newValue = name === 'price' ? Number(value) : value;

//         setCourseData(prev => ({
//             ...prev, 
//             [name]: newValue 
//         }));
//     };

//     const handleSubmit = async (actionType, e) => {
//         if (e) e.preventDefault();

//         // Form validation
//         if (!courseData.courseId) {
//             showNotice("error", 'Please enter a course ID');
//             setActiveTab(0); // Switch to basic info tab
//             return;
//         }
//         if (!courseData.title) {
//             showNotice("error", 'Please enter a title');
//             setActiveTab(0);
//             return;
//         }
//         if (!courseData.description) {
//             showNotice("error", 'Please enter a description');
//             setActiveTab(0);
//             return;
//         }
        
//         // Recommend adding tags if none
//         if (!courseData.tags || courseData.tags.length === 0) {
//             showNotice("warning", 'Consider adding some tags to improve course discoverability');
//             // Don't return, just warn
//         }

//         try {
//             setIsLoading(true);

//             // Handle image upload
//             let uploadedImageUrl = courseData.photo;
//             if (selectedImageFile && selectedImageFile !== courseData.photo) {
//                 try {
//                     uploadedImageUrl = await uploadToCloudnary(selectedImageFile);
//                 } catch (error) {
//                     showNotice('error', "Error uploading image");
//                     console.error('Error uploading image:', error);
//                     setIsLoading(false);
//                     return;
//                 }
//             }

//             const statusMap = {
//                 delete: 'unpublished',
//                 published: 'published',
//                 draft: 'draft',
//             };

//             const updatedCourseData = {
//                 ...courseData,
//                 photo: uploadedImageUrl,
//                 video: fileVideo,
//                 status: statusMap[actionType] || 'published',
//             };

//             // Prepare form data for API
//             const formData = new FormData();
//             if (updatedCourseData.instructor && typeof updatedCourseData.instructor === 'object') {
//                 formData.append("instructor", updatedCourseData.instructor._id);
//             } else {
//                 formData.append("instructor", updatedCourseData.instructor);
//             }

//             // Add text data
//             Object.keys(updatedCourseData).forEach((key) => {
//                 if (key !== 'video' && key !== 'instructor' && key !== 'courseReviews' && key !== 'enrollmentCount') {
//                     formData.append(key, updatedCourseData[key]);
//                 }
//             });

//             // Add video file
//             if (updatedCourseData.video instanceof File) {
//                 formData.append('sumaryVideo', updatedCourseData.video);
//             }

//             setCourseData(updatedCourseData);

//             // Submit to API
//             if (courseId) {
//                 await dispatch(updateCourse({
//                     courseId,
//                     formData: formData
//                 })).unwrap();
//                 showNotice('success', 'Course updated successfully!');
//                 await dispatch(getCourseByID(courseId));
//             } else {
//                 await dispatch(createCourse(formData)).unwrap();
//                 showNotice('success', 'Course created successfully!');
//                 navigate('/instructor/course-management', { replace: true });
//             }

//         } catch (error) {
//             showNotice('error', "Error while performing action");
//             console.error('Error details:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Module handling
//     const handleOpenModuleDialog = (module) => {
//         if (module) {
//             setCurrentModule({
//                 id: module._id ? module._id : module.id,
//                 index: module.index,
//                 title: module.title,
//                 description: module.description,
//             });
//         } else {
//             const nextIndex = courseData.modules ? courseData.modules.length + 1 : 1;
//             setCurrentModule({
//                 id: null,
//                 index: nextIndex,
//                 title: '',
//                 description: '',
//             });
//         }
//         setOpenModuleDialog(true);
//     };

//     const handleCloseModuleDialog = () => {
//         setCurrentModule({
//             id: null,
//             index: 1,
//             title: '',
//             description: '',
//         });
//         setOpenModuleDialog(false);
//     };

//     const handleSaveModule = () => {
//         if (!currentModule.title.trim()) {
//             showNotice('error', 'Module title is required');
//             return;
//         }

//         setCourseData(prev => {
//             const newModule = currentModule.id
//                 ? currentModule
//                 : {
//                     id: Date.now(),
//                     index: currentModule.index,
//                     title: currentModule.title.trim(),
//                     description: currentModule.description.trim(),
//                     moduleItems: []
//                 };
                
//             const updatedData = currentModule.id
//                 ? {
//                     ...prev,
//                     modules: prev.modules.map(m =>
//                         m.id === currentModule.id ? newModule : m
//                     )
//                 }
//                 : {
//                     ...prev,
//                     modules: [...(prev.modules || []), newModule]
//                 };

//             return updatedData;
//         });
        
//         handleCloseModuleDialog();
//         showNotice('success', currentModule.id ? 'Module updated successfully' : 'Module added successfully');
//     };

//     const handleOpenModuleSection = (courseId, moduleindex) => {
//         if (!courseId || moduleindex == null) {
//             console.error('Invalid courseId or moduleindex:', { courseId, moduleindex });
//             return;
//         }

//         const courseSlug = courseId.trim().toLowerCase().replace(/\s+/g, '-');
//         const path = moduleindex === 0
//             ? `/course-management/${courseSlug}/module`
//             : `/course-management/${courseSlug}/module/${moduleindex}`;

//         navigate(path);
//     };

//     const handleFileChange = (file) => {
//         if (file) {
//             if (!file.type.startsWith('video/')) {
//                 showNotice('error', 'Please select a video file');
//                 return;
//             }

//             if (videoPreview) {
//                 URL.revokeObjectURL(videoPreview);
//             }

//             const videoURL = URL.createObjectURL(file);
//             setVideoPreview(videoURL);
//             setVideoKey(prevKey => prevKey + 1);
//             setFileVideo(file);
            
//             // Mark media as valid since we have a video
//             validateForm('media', true);
//         } else {
//             setVideoPreview(null);
//             setFileVideo('');
//         }
//     };

//     const handleVideoLoad = () => {
//         if (videoRef.current) {
//             // Store video duration if needed
//             const duration = videoRef.current.duration;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="h-screen flex items-center justify-center">
//                 <img alt="Loading" src={spinnerLoading} />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex flex-col bg-gray-50">
//             <header>
//                 <Header />
//                 <Divider />
//                 <Box sx={{ backgroundColor: '#f8f9fa', padding: '12px 24px' }}>
//                     <Breadcrumb courseId={courseID} />
//                 </Box>
//                 <Box 
//                     sx={{ 
//                         backgroundColor: courseData.status === 'published' ? '#e3f2fd' : '#fff8e1',
//                         padding: '16px 24px',
//                         borderBottom: '1px solid #e0e0e0'
//                     }}
//                 >
//                     <Typography variant="h5" fontWeight="bold">
//                         {state === 'edit' ? 'Edit Course: ' + (courseData.title || '') : 'Create New Course'}
//                     </Typography>
//                     {courseData.status && (
//                         <Chip 
//                             label={courseData.status.toUpperCase()} 
//                             color={courseData.status === 'published' ? 'success' : 'warning'}
//                             size="small"
//                             sx={{ ml: 2 }}
//                         />
//                     )}
//                 </Box>
//             </header>

//             <Container maxWidth="lg" className="flex-1 py-6">
//                 <form onSubmit={(e) => {
//                     e.preventDefault();
//                     handleSubmit('published', e);
//                 }} className="w-full">
                    
//                     {/* Course Progress Preview */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                         <Box sx={{ flex: 1, position: 'relative' }}>
//                             <Box 
//                                 sx={{ 
//                                     position: 'relative', 
//                                     height: '8px', 
//                                     backgroundColor: '#e0e0e0',
//                                     borderRadius: 4,
//                                     overflow: 'hidden'
//                                 }}
//                             >
//                                 <Box 
//                                     sx={{ 
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0,
//                                         height: '100%',
//                                         width: `${Math.min(
//                                             (((formValidation.basicInfo ? 1 : 0) + 
//                                             (formValidation.media ? 1 : 0) + 
//                                             (formValidation.tags ? 1 : 0)) / 3) * 100, 
//                                             100
//                                         )}%`,
//                                         backgroundColor: 'primary.main',
//                                         borderRadius: 4,
//                                         transition: 'width 0.5s ease'
//                                     }}
//                                 />
//                             </Box>
//                         </Box>
//                         <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//                             {Math.round(
//                                 (((formValidation.basicInfo ? 1 : 0) + 
//                                 (formValidation.media ? 1 : 0) + 
//                                 (formValidation.tags ? 1 : 0)) / 3) * 100
//                             )}% complete
//                         </Typography>
//                     </Box>
                    
//                     {/* Tab Navigation */}
//                     <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//                         <Tabs 
//                             value={activeTab} 
//                             onChange={handleTabChange}
//                             variant="scrollable"
//                             scrollButtons="auto"
//                             aria-label="course creation tabs"
//                         >
//                             <Tab 
//                                 icon={<InfoIcon />} 
//                                 iconPosition="start" 
//                                 label="Basic Info" 
//                                 sx={{
//                                     color: formValidation.basicInfo ? 'success.main' : 'inherit',
//                                 }}
//                             />
//                             <Tab 
//                                 icon={<VideoFileIcon />} 
//                                 iconPosition="start" 
//                                 label="Media" 
//                                 sx={{
//                                     color: formValidation.media ? 'success.main' : 'inherit',
//                                 }}
//                             />
//                             <Tab 
//                                 icon={<TagIcon />} 
//                                 iconPosition="start" 
//                                 label="Tags" 
//                                 sx={{
//                                     color: formValidation.tags ? 'success.main' : 'inherit',
//                                 }}
//                             />
//                             {courseId && <Tab icon={<SchoolIcon />} iconPosition="start" label="Modules" />}
//                         </Tabs>
//                     </Box>

//                     {/* Tab 1: Basic Info */}
//                     {activeTab === 0 && (
//                         <Box>
//                             <Card variant="outlined" sx={{ mb: 4 }}>
//                                 <CardHeader 
//                                     title={
//                                         <Box display="flex" alignItems="center">
//                                             <InfoIcon color="primary" sx={{ mr: 1 }} />
//                                             <Typography variant="h6">Course Information</Typography>
//                                         </Box>
//                                     }
//                                     subheader="Basic details about your course"
//                                 />
//                                 <CardContent>
//                                     <Grid container spacing={3}>
//                                         {/* Course ID */}
//                                         <Grid item xs={12}>
//                                             <TextField
//                                                 fullWidth
//                                                 required
//                                                 label="Course ID"
//                                                 name="courseId"
//                                                 value={courseData?.courseId || ''}
//                                                 onChange={handleInputChange}
//                                                 disabled={!!courseId}
//                                                 helperText={!courseId && "This ID will be used for URL generation and cannot be changed later"}
//                                                 InputProps={{
//                                                     startAdornment: <CourseIcon sx={{ color: 'text.secondary', mr: 1 }} />
//                                                 }}
//                                             />
//                                         </Grid>

//                                         {/* Title */}
//                                         <Grid item xs={12}>
//                                             <TextField
//                                                 required
//                                                 fullWidth
//                                                 label="Course Title"
//                                                 name="title"
//                                                 value={courseData.title || ''}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter an engaging title for your course"
//                                                 InputProps={{
//                                                     startAdornment: <DescriptionIcon sx={{ color: 'text.secondary', mr: 1 }} />
//                                                 }}
//                                             />
//                                         </Grid>

//                                         {/* Description */}
//                                         <Grid item xs={12}>
//                                             <TextField
//                                                 required
//                                                 fullWidth
//                                                 multiline
//                                                 rows={4}
//                                                 label="Course Description"
//                                                 name="description"
//                                                 value={courseData.description || ''}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Describe what students will learn in this course"
//                                                 helperText={`${(courseData.description?.length || 0)} characters (min. recommended: 100)`}
//                                             />
//                                         </Grid>

//                                         {/* Level price approved*/}
//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 required
//                                                 fullWidth
//                                                 select
//                                                 label="Course Level"
//                                                 name="level"
//                                                 value={courseData.level || 'beginner'}
//                                                 onChange={handleInputChange}
//                                                 helperText="Select the appropriate difficulty level"
//                                                 InputProps={{
//                                                     startAdornment: <SchoolIcon sx={{ color: 'text.secondary', mr: 1 }} />
//                                                 }}
//                                             >
//                                                 <MenuItem value="beginner">Beginner</MenuItem>
//                                                 <MenuItem value="intermediate">Intermediate</MenuItem>
//                                                 <MenuItem value="advanced">Advanced</MenuItem>
//                                             </TextField>
//                                         </Grid>

//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 type='number'
//                                                 label="Course Price ($)"
//                                                 name="price"
//                                                 value={courseData.price || ''}
//                                                 onChange={handleInputChange}
//                                                 placeholder="0 for free courses"
//                                                 InputProps={{
//                                                     startAdornment: <PriceIcon sx={{ color: 'text.secondary', mr: 1 }} />
//                                                 }}
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12} md={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="Approval Status"
//                                                 value={courseData?.approvedBy?.email || 'Pending Approval'}
//                                                 disabled
//                                                 InputProps={{
//                                                     startAdornment: <CheckIcon sx={{ color: courseData?.approvedBy ? 'success.main' : 'text.disabled', mr: 1 }} />
//                                                 }}
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card>
                            
//                             {/* Tab Navigation Buttons */}
//                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                                 <Button 
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={() => setActiveTab(1)}
//                                     endIcon={<ArrowForwardIcon />}
//                                     disabled={!formValidation.basicInfo}
//                                 >
//                                     Next: Media
//                                 </Button>
//                             </Box>
//                         </Box>
//                     )}

//                     {/* Tab 2: Media */}
//                     {activeTab === 1 && (
//                         <Box>
//                             <Card variant="outlined" sx={{ mb: 4 }}>
//                                 <CardHeader 
//                                     title={
//                                         <Box display="flex" alignItems="center">
//                                             <VideoIcon color="primary" sx={{ mr: 1 }} />
//                                             <Typography variant="h6">Course Media</Typography>
//                                         </Box>
//                                     }
//                                     subheader="Upload a thumbnail image and intro video for your course"
//                                 />
//                                 <CardContent>
//                                     <Grid container spacing={4}>
//                                         <Grid item xs={12} md={6}>
//                                             <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
//                                                 <VideoIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                 Course Preview Video
//                                             </Typography>
//                                             <Paper 
//                                                 elevation={0} 
//                                                 sx={{ 
//                                                     p: 3, 
//                                                     border: '1px dashed #ccc',
//                                                     borderRadius: 2,
//                                                     backgroundColor: '#fafafa'
//                                                 }}
//                                             >
//                                                 <FileUpload
//                                                     onFileChange={handleFileChange}
//                                                     accept='.mp4,.webm'
//                                                 />
//                                                 {videoPreview ? (
//                                                     <Box className="mt-4" sx={{ border: '1px solid #eee', borderRadius: 1, overflow: 'hidden' }}>
//                                                         <video
//                                                             key={videoKey}
//                                                             ref={videoRef}
//                                                             className="w-full max-h-[400px]"
//                                                             controls
//                                                             onLoadedMetadata={handleVideoLoad}
//                                                         >
//                                                             <source src={videoPreview} type="video/mp4" />
//                                                             Your browser does not support the video tag.
//                                                         </video>
//                                                     </Box>
//                                                 ) : (
//                                                     <Alert severity="info" sx={{ mt: 2 }}>
//                                                         A brief intro video can increase student engagement by 80%
//                                                     </Alert>
//                                                 )}
//                                             </Paper>
//                                         </Grid>
//                                         <Grid item xs={12} md={6}>
//                                             <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
//                                                 <MenuBook fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                 Course Thumbnail Image
//                                             </Typography>
//                                             <Paper 
//                                                 elevation={0} 
//                                                 sx={{ 
//                                                     p: 3, 
//                                                     border: '1px dashed #ccc',
//                                                     borderRadius: 2,
//                                                     backgroundColor: '#fafafa',
//                                                     height: '100%',
//                                                     display: 'flex',
//                                                     flexDirection: 'column'
//                                                 }}
//                                             >
//                                                 <ImageUpload
//                                                     initialImage={currentCourse?.photo}
//                                                     setCourseData={setCourseData}
//                                                     onFileSelect={setSelectedImageFile}
//                                                 />
//                                                 {!selectedImageFile && (
//                                                     <Alert severity="info" sx={{ mt: 'auto' }}>
//                                                         Recommended image size: 1280 x 720 pixels
//                                                     </Alert>
//                                                 )}
//                                             </Paper>
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card>
                            
//                             {/* Tab Navigation Buttons */}
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     onClick={() => setActiveTab(0)}
//                                     startIcon={<ArrowBackIcon />}
//                                 >
//                                     Back: Basic Info
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={() => setActiveTab(2)}
//                                     endIcon={<ArrowForwardIcon />}
//                                 >
//                                     Next: Tags
//                                 </Button>
//                             </Box>
//                         </Box>
//                     )}

//                     {/* Tab 3: Tags */}
//                     {activeTab === 2 && (
//                         <Box>
//                             <Card variant="outlined" sx={{ mb: 4 }}>
//                                 <CardHeader 
//                                     title={
//                                         <Box display="flex" alignItems="center">
//                                             <TagIcon color="primary" sx={{ mr: 1 }} />
//                                             <Typography variant="h6">Course Tags</Typography>
//                                         </Box>
//                                     }
//                                     subheader="Add relevant tags to help students find your course"
//                                 />
//                                 <CardContent>
//                                     <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
//                                         <div className="flex flex-col gap-3">
//                                             <Box sx={{ mb: 3 }}>
//                                                 <Autocomplete
//                                                     value={currentTag}
//                                                     onChange={handleTagChange}
//                                                     inputValue={inputValue}
//                                                     onInputChange={(event, newInputValue) => {
//                                                         setInputValue(newInputValue);
//                                                     }}
//                                                     options={suggestedTags.filter(tag =>
//                                                         !courseData.tags?.includes(tag)
//                                                     )}
//                                                     renderInput={(params) => (
//                                                         <TextField
//                                                             {...params}
//                                                             size="medium"
//                                                             label="Add Tag"
//                                                             placeholder="Type or select a tag"
//                                                             fullWidth
//                                                             InputProps={{
//                                                                 ...params.InputProps,
//                                                                 startAdornment: (
//                                                                     <>
//                                                                         <TagIcon sx={{ color: 'text.secondary', mr: 1 }} />
//                                                                         {params.InputProps.startAdornment}
//                                                                     </>
//                                                                 )
//                                                             }}
//                                                         />
//                                                     )}
//                                                     freeSolo
//                                                 />
//                                             </Box>
                                            
//                                             <Box sx={{ mb: 3 }}>
//                                                 <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
//                                                     Current tags ({courseData.tags?.length || 0}):
//                                                 </Typography>
//                                                 <Box sx={{ 
//                                                     p: courseData.tags?.length ? 2 : 0,
//                                                     border: courseData.tags?.length ? '1px dashed #e0e0e0' : 'none',
//                                                     borderRadius: 1,
//                                                     backgroundColor: courseData.tags?.length ? '#fafafa' : 'transparent',
//                                                     minHeight: courseData.tags?.length ? 'auto' : '60px'
//                                                 }}>
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {courseData.tags?.map((tag, index) => (
//                                                             <Chip
//                                                                 key={index}
//                                                                 label={tag}
//                                                                 onDelete={() => handleDeleteTag(tag)}
//                                                                 color="primary"
//                                                                 variant="outlined"
//                                                                 sx={{ m: 0.5 }}
//                                                             />
//                                                         ))}
//                                                         {!courseData.tags?.length && (
//                                                             <Typography variant="body2" color="text.disabled" sx={{ p: 2 }}>
//                                                                 No tags added yet. Tags help improve course visibility.
//                                                             </Typography>
//                                                         )}
//                                                     </div>
//                                                 </Box>
//                                             </Box>
                                            
//                                             {/* Tag Category Filter */}
//                                             <Box sx={{ mb: 2 }}>
//                                                 <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
//                                                     Browse tags by category:
//                                                 </Typography>
//                                                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                                                     <Chip 
//                                                         label="All" 
//                                                         onClick={() => handleTagCategoryChange('all')}
//                                                         color={tagCategory === 'all' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'all' ? 'filled' : 'outlined'}
//                                                     />
//                                                     <Chip 
//                                                         label="Languages" 
//                                                         onClick={() => handleTagCategoryChange('languages')}
//                                                         color={tagCategory === 'languages' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'languages' ? 'filled' : 'outlined'}
//                                                     />
//                                                     <Chip 
//                                                         label="Frameworks" 
//                                                         onClick={() => handleTagCategoryChange('frameworks')}
//                                                         color={tagCategory === 'frameworks' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'frameworks' ? 'filled' : 'outlined'}
//                                                     />
//                                                     <Chip 
//                                                         label="Databases" 
//                                                         onClick={() => handleTagCategoryChange('database')}
//                                                         color={tagCategory === 'database' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'database' ? 'filled' : 'outlined'}
//                                                     />
//                                                     <Chip 
//                                                         label="Development Tools" 
//                                                         onClick={() => handleTagCategoryChange('tools')}
//                                                         color={tagCategory === 'tools' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'tools' ? 'filled' : 'outlined'}
//                                                     />
//                                                     <Chip 
//                                                         label="Level" 
//                                                         onClick={() => handleTagCategoryChange('level')}
//                                                         color={tagCategory === 'level' ? 'primary' : 'default'}
//                                                         variant={tagCategory === 'level' ? 'filled' : 'outlined'}
//                                                     />
//                                                 </Box>
//                                             </Box>
                                            
//                                             {/* Suggested Tags Section */}
//                                             <Divider sx={{ my: 2 }}>
//                                                 <Chip label="Suggested Tags" size="small" />
//                                             </Divider>
                                            
//                                             <Box sx={{ p: 2, backgroundColor: '#f5f7fa', borderRadius: 2 }}>
//                                                 <div className="flex flex-wrap gap-1">
//                                                     {getFilteredTags(tagCategory).map((tag, index) => (
//                                                         <Chip
//                                                             key={index}
//                                                             label={tag}
//                                                             size="small"
//                                                             onClick={() => handleTagChange(null, tag)}
//                                                             disabled={courseData.tags?.includes(tag)}
//                                                             sx={{ m: 0.5, cursor: 'pointer' }}
//                                                         />
//                                                     ))}
//                                                 </div>
//                                             </Box>
//                                         </div>
//                                     </Paper>
//                                 </CardContent>
//                             </Card>
                            
//                             {/* Tab Navigation Buttons */}
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     onClick={() => setActiveTab(1)}
//                                     startIcon={<ArrowBackIcon />}
//                                 >
//                                     Back: Media
//                                 </Button>
//                                 {courseId && (
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={() => setActiveTab(3)}
//                                         endIcon={<ArrowForwardIcon />}
//                                     >
//                                         Next: Modules
//                                     </Button>
//                                 )}
//                             </Box>
//                         </Box>
//                     )}
                    
//                     {/* Tab 4: Modules (only visible when editing an existing course) */}
//                     {activeTab === 3 && courseId && (
//                         <Box>
//                             <Card variant="outlined" sx={{ mb: 4 }}>
//                                 <CardHeader 
//                                     title={
//                                         <Box display="flex" alignItems="center">
//                                             <SchoolIcon color="primary" sx={{ mr: 1 }} />
//                                             <Typography variant="h6">Course Modules</Typography>
//                                         </Box>
//                                     }
//                                     subheader="Organize your course content into modules"
//                                     action={
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             startIcon={<AddIcon />}
//                                             onClick={() => handleOpenModuleDialog()}
//                                             size="small"
//                                             sx={{ mt: 1 }}
//                                         >
//                                             Add Module
//                                         </Button>
//                                     }
//                                 />
//                                 <CardContent>
//                                     <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
//                                         {courseData.modules && courseData.modules.length > 0 ? (
//                                             <List>
//                                                 {courseData.modules?.map((module, index) => (
//                                                     <ListItem
//                                                         key={index}
//                                                         divider
//                                                         button
//                                                         onClick={() => handleOpenModuleSection(courseId, module.index)}
//                                                         sx={{
//                                                             '&:hover': { 
//                                                                 backgroundColor: '#f5f5f5',
//                                                             }
//                                                         }}
//                                                     >
//                                                         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                                                             <Box 
//                                                                 sx={{ 
//                                                                     backgroundColor: 'primary.main', 
//                                                                     color: 'white', 
//                                                                     width: 36, 
//                                                                     height: 36, 
//                                                                     display: 'flex', 
//                                                                     alignItems: 'center', 
//                                                                     justifyContent: 'center',
//                                                                     borderRadius: '50%',
//                                                                     mr: 2
//                                                                 }}
//                                                             >
//                                                                 {index + 1}
//                                                             </Box>
//                                                             <ListItemText
//                                                                 primary={
//                                                                     <Typography variant="subtitle1" fontWeight="medium">
//                                                                         {module.title}
//                                                                     </Typography>
//                                                                 }
//                                                                 secondary={
//                                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                                         <Typography variant="body2" color="text.secondary" noWrap>
//                                                                             {module.description || 'No description available'}
//                                                                         </Typography>
//                                                                         {module.moduleItems && (
//                                                                             <Chip 
//                                                                                 label={`${module.moduleItems.length} items`} 
//                                                                                 size="small" 
//                                                                                 sx={{ ml: 1 }}
//                                                                             />
//                                                                         )}
//                                                                     </Box>
//                                                                 }
//                                                             />
//                                                         </Box>
//                                                         <ListItemSecondaryAction>
//                                                             <Tooltip title="Edit Module">
//                                                                 <IconButton 
//                                                                     edge="end" 
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         handleOpenModuleDialog(module);
//                                                                     }}
//                                                                 >
//                                                                     <EditIcon />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                             <Tooltip title="Go to Module Details">
//                                                                 <IconButton edge="end" onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     handleOpenModuleSection(courseId, module.index);
//                                                                 }}>
//                                                                     <ArrowRightAltIcon />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                         </ListItemSecondaryAction>
//                                                     </ListItem>
//                                                 ))}
//                                             </List>
//                                         ) : (
//                                             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, px: 3 }}>
//                                                 <MenuBook sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
//                                                 <Typography variant="h6" color="text.secondary" gutterBottom>
//                                                     No modules added yet
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
//                                                     Organize your course content by adding modules. Each module can contain lessons, quizzes and resources.
//                                                 </Typography>
//                                                 <Button
//                                                     variant="contained"
//                                                     color="primary"
//                                                     startIcon={<AddIcon />}
//                                                     onClick={() => handleOpenModuleDialog()}
//                                                 >
//                                                     Create Your First Module
//                                                 </Button>
//                                             </Box>
//                                         )}
//                                     </Paper>
//                                 </CardContent>
//                             </Card>
                            
//                             {/* Tab Navigation Buttons */}
//                             <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     onClick={() => setActiveTab(2)}
//                                     startIcon={<ArrowBackIcon />}
//                                 >
//                                     Back: Tags
//                                 </Button>
//                             </Box>
//                         </Box>
//                     )}
                    
//                     {/* Action Buttons */}
//                     <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
//                         <Box>
//                             {courseId ? (
//                                 courseData.status === "published" ? (
//                                     <Button
//                                         type="button"
//                                         variant="outlined"
//                                         color="error"
//                                         disabled={loading || isLoading}
//                                         startIcon={<DeleteIcon />}
//                                         onClick={() => handleSubmit('delete')}
//                                         sx={{ minWidth: 180 }}
//                                     >
//                                         Unpublish Course
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         type="button"
//                                         variant="outlined"
//                                         color="success"
//                                         disabled={loading || isLoading}
//                                         startIcon={<CheckIcon />}
//                                         onClick={() => handleSubmit('published')}
//                                         sx={{ minWidth: 180 }}
//                                     >
//                                         Publish Course
//                                     </Button>
//                                 )
//                             ) : (
//                                 <Button
//                                     type="button"
//                                     variant="outlined"
//                                     color="secondary"
//                                     disabled={loading || isLoading}
//                                     startIcon={<EditIcon />}
//                                     onClick={() => handleSubmit('draft')}
//                                     sx={{ minWidth: 180 }}
//                                 >
//                                     Save as Draft
//                                 </Button>
//                             )}
//                         </Box>
                        
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             size="large"
//                             fullWidth={false}
//                             sx={{ minWidth: 180 }}
//                             onClick={(e) => handleSubmit('published', e)}
//                             disabled={loading || isLoading}
//                         >
//                             {isLoading ? (
//                                 <CircularProgress size={24} />
//                             ) : courseId ? (
//                                 'Update Course'
//                             ) : (
//                                 'Create Course'
//                             )}
//                         </Button>
//                     </Box>
//                 </form>
//             </Container>

//             {/* Module Dialog */}
//             <Dialog 
//                 open={openModuleDialog} 
//                 onClose={handleCloseModuleDialog}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     <Box display="flex" alignItems="center">
//                         {currentModule.id ? (
//                             <>
//                                 <EditIcon color="primary" sx={{ mr: 1 }} />
//                                 Edit Module
//                             </>
//                         ) : (
//                             <>
//                                 <AddIcon color="primary" sx={{ mr: 1 }} />
//                                 Add New Module
//                             </>
//                         )}
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={3}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 autoFocus
//                                 margin="dense"
//                                 label="Module Title"
//                                 type="text"
//                                 fullWidth
//                                 required
//                                 value={currentModule.title}
//                                 onChange={(e) => setCurrentModule(prev => ({ ...prev, title: e.target.value }))}
//                                 placeholder="Enter a descriptive title for this module"
//                                 helperText="Example: Introduction to JavaScript, Database Concepts, etc."
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 margin="dense"
//                                 label="Module Description"
//                                 multiline
//                                 rows={4}
//                                 type="text"
//                                 fullWidth
//                                 value={currentModule.description}
//                                 onChange={(e) => setCurrentModule(prev => ({ ...prev, description: e.target.value }))}
//                                 placeholder="Provide a brief overview of what will be covered in this module"
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: 2 }}>
//                     <Button 
//                         onClick={handleCloseModuleDialog}
//                         variant="outlined"
//                     >
//                         Cancel
//                     </Button>
//                     <div className='space-x-2'>
//                         {currentModule.id && (
//                             <Button 
//                                 onClick={() => handleOpenModuleSection(courseId, currentModule.index)}
//                                 variant="outlined"
//                                 color="primary"
//                                 startIcon={<ArrowRightAltIcon />}
//                             >
//                                 Go to Details
//                             </Button>
//                         )}
//                         <Button 
//                             onClick={handleSaveModule}
//                             variant="contained"
//                             color="primary"
//                             startIcon={currentModule.id ? <EditIcon /> : <AddIcon />}
//                             disabled={!currentModule.title.trim()}
//                         >
//                             {currentModule.id ? 'Update' : 'Add Module'}
//                         </Button>
//                     </div>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default CourseSection;
