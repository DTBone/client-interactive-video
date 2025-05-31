import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { approveCourse } from '~/store/slices/Course/action';
import {
    Modal,
    Box,
    Typography,
    Button,
    Divider,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    TextField,
    Alert,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Badge,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle,
    AccessTime,
    MonetizationOn,
    Category,
    Assessment,
    Description,
    Language,
    Preview,
    Cancel,
    VideoLibrary,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { getAllModules } from '~/store/slices/Module/action';
import CourseContentPreview from './CourseContentPreview';

function ReviewCourseModal({ open, setOpen, courseData }) {
    const dispatch = useDispatch();
    const [feedback, setFeedback] = useState('');
    const [messageBox, setMessageBox] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]);

    const getLevelColor = (level) => {
        switch (level) {
            case 'beginner':
                return 'success';
            case 'intermediate':
                return 'primary';
            case 'advanced':
                return 'error';
            default:
                return 'default';
        }
    };

    useEffect(() => {
        console.log('courseData', modules);
        if (courseData?.modules) {
            setModules(courseData?.modules);
        }
        else {
            const fetchModules = async () => {
                try {
                    const result = await dispatch(getAllModules(courseData._id));
                    if (getAllModules.fulfilled.match(result)) {

                        setModules(result.payload);
                    }
                } catch (error) {
                    console.error('Error fetching modules:', error);
                }
            }
            fetchModules();

        }
    }, [courseData]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleApprove = async () => {
        const confirmApprove = window.confirm('Are you sure you want to approve this course?');
        if (confirmApprove) {
            setLoading(true);
            try {
                const result = await dispatch(approveCourse({
                    courseId: courseData._id,
                    feedback: feedback,
                    isApproved: true
                }));

                if (approveCourse.fulfilled.match(result)) {
                    setMessageBox('Course approved successfully');
                    setTimeout(() => {
                        setOpen(false);
                        setFeedback('');
                    }, 2000);
                } else {
                    setMessageBox('Failed to approve course');
                }
            } catch (error) {
                setMessageBox('Error approving course: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReject = async () => {
        const confirmReject = window.confirm('Are you sure you want to reject this course?');
        if (!feedback.trim()) {
            setMessageBox('Please provide feedback to the instructor about why the course is being rejected');
            return;
        }

        if (confirmReject) {
            setLoading(true);
            try {
                const result = await dispatch(approveCourse({
                    courseId: courseData._id,
                    feedback: feedback,
                    isApproved: false
                }));

                if (approveCourse.fulfilled.match(result)) {
                    setMessageBox('Course rejected successfully');
                    setTimeout(() => {
                        setOpen(false);
                        setFeedback('');
                    }, 2000);
                } else {
                    setMessageBox('Failed to reject course');
                }
            } catch (error) {
                setMessageBox('Error rejecting course: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleViewCourse = () => {
        window.open(`/course-management/${courseData._id}`, '_blank');
    };

    const handlePreview = () => {
        window.open(`/course-management/${courseData._id}`, '_blank');
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="review-course-modal"
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0.5,
                    }
                }
            }}
        >
            <Card sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '95%', sm: 700 },
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: 3,
                boxShadow: 24,
                p: 0,
            }}>
                <CardHeader
                    avatar={
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Chip
                                    label={courseData?.status?.toUpperCase()}
                                    color={courseData?.status === 'published' ? 'success' : 'warning'}
                                    size="small"
                                />
                            }
                        >
                            <Avatar src={courseData?.instructor?.profile?.avatar} alt={courseData?.instructor?.profile?.fullname || 'I'} />
                        </Badge>
                    }
                    title={<Typography variant="h6" fontWeight="bold">{courseData?.title}</Typography>}
                    subheader={
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="text.secondary">
                                {courseData?.instructor?.profile?.fullname || 'Unknown'}
                            </Typography>
                            <Chip
                                label={courseData?.isApproved ? 'APPROVED' : 'PENDING'}
                                color={courseData?.isApproved ? 'success' : 'warning'}
                                size="small"
                            />
                        </Box>
                    }
                    action={
                        <Box display="flex" gap={1}>
                            <Tooltip title="Preview Course">
                                <Button
                                    variant="outlined"
                                    startIcon={<Preview />}
                                    onClick={handlePreview}
                                    size="small"
                                >
                                    Preview
                                </Button>
                            </Tooltip>
                        </Box>
                    }
                    sx={{ pb: 0, pt: 2 }}
                />
                <Divider />
                <CardContent sx={{ pt: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Course Details" icon={<Description />} />
                        <Tab label="Content Preview" icon={<VideoLibrary />} />
                    </Tabs>

                    {/* Course Information */}
                    {tabValue === 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Category />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Category"
                                            secondary={courseData?.category?.name}
                                        />
                                        <Chip
                                            label={courseData?.level}
                                            color={getLevelColor(courseData?.level)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AccessTime />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Duration"
                                            secondary={`${courseData?.totalDuration || 0} hours`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MonetizationOn />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Price"
                                            secondary={`$${courseData?.price}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Language />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Language"
                                            secondary={courseData?.language}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Assessment />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Content"
                                            secondary={`${modules?.length || 0} modules`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Description />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Description"
                                            secondary={courseData?.description}
                                            secondaryTypographyProps={{
                                                sx: {
                                                    maxHeight: 100,
                                                    overflow: 'auto',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    )}

                    {/* Content Preview */}
                    {tabValue === 1 && (
                        <CourseContentPreview modules={modules} />
                    )}

                    {/* Feedback Section */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Feedback for Instructor
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label={courseData?.isApproved ? "Feedback" : "Review Feedback (Required for rejection)"}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Add your review comments or feedback for the instructor..."
                            required={!courseData?.isApproved}
                            error={!feedback.trim() && tabValue === 0}
                            helperText={!feedback.trim() && tabValue === 0 ? "Feedback is required for course rejection" : ""}
                        />
                    </Box>

                    {/* Message Box */}
                    {messageBox && (
                        <Box sx={{ mt: 2 }}>
                            <Alert
                                severity={messageBox.includes('successfully') ? 'success' : 'error'}
                                onClose={() => setMessageBox('')}
                            >
                                {messageBox}
                            </Alert>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center" sx={{ mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        {!courseData?.isApproved && (
                            <>
                                <Tooltip title={!feedback.trim() ? "Feedback is required to reject" : "Reject Course"}>
                                    <span>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Cancel />}
                                            onClick={handleReject}
                                            disabled={loading || !feedback.trim()}
                                        >
                                            Reject
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Approve Course">
                                    <span>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
                                            onClick={handleApprove}
                                            disabled={loading}
                                        >
                                            Approve
                                        </Button>
                                    </span>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Modal>
    );
}

ReviewCourseModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    courseData: PropTypes.object
};

export default ReviewCourseModal; 