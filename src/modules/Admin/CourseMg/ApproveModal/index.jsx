import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { approveCourse } from '~/store/slices/Course/action';
import {
    Modal,
    Box,
    Typography,
    Button,
    Divider,
    Grid2 as Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    TextField,
} from '@mui/material';
import {
    CheckCircle,
    Warning,
    AccessTime,
    MonetizationOn,
    Category,
    Assessment,
    Person,
    Description,
    Language,
    Launch,
    Preview
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ApproveCourseModal({ open, setOpen, courseData }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');
    const [messageBox, setMessageBox] = useState('');

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

    const handleApprove = async () => {
        const confirmApprove = window.confirm('Are you sure you want to approve this course?');
        if (confirmApprove) {
            try {
                const result = await dispatch(approveCourse({
                    courseId: courseData._id,
                    feedback: feedback
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
                setMessageBox('Error approving course');
            }
        }
    };

    const handleViewCourse = () => {
        window.open(`/course/${courseData._id}`, '_blank');
    };

    const handlePreview = () => {
        window.open(`/courses/${courseData._id}/preview`, '_blank');
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="approve-course-modal"
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0.5,
                    }
                }
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {xs: '90%', sm: 700},
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Warning color="warning" fontSize="large" />
                        <Typography variant="h6">Course Approval Request</Typography>
                    </Box>
                    <Chip
                        label={courseData?.status?.toUpperCase()}
                        color={courseData?.status === 'published' ? 'success' : 'warning'}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Course Information */}
                <Grid container spacing={3}>
                    {/* Title and Basic Info */}
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            {courseData?.title}
                        </Typography>
                    </Grid>

                    {/* Course Details */}
                    <Grid item xs={12}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Instructor"
                                    secondary={courseData?.instructor?.profile?.fullname || 'Unknown'}
                                />
                            </ListItem>

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

                            <ListItem>
                                <ListItemIcon>
                                    <Assessment />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Content"
                                    secondary={`${courseData?.totalLectures || 0} lectures • ${courseData?.totalQuizzes || 0} quizzes`}
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

                    {/* Feedback Section */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Approval Feedback (Optional)"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Add any comments or feedback for the instructor..."
                        />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={<Preview />}
                                onClick={handlePreview}
                            >
                                Preview Course
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Launch />}
                                onClick={handleViewCourse}
                            >
                                View Course
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CheckCircle />}
                                onClick={handleApprove}
                            >
                                Approve Course
                            </Button>
                            {messageBox && (
                                <Typography
                                    variant="subtitle2"
                                    color={messageBox.includes('successfully') ? 'success.main' : 'error.main'}
                                >
                                    {messageBox}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default ApproveCourseModal;