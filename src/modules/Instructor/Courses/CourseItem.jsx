import React from 'react';
import { 
    Box, Button, Card, CardActions, CardContent, CardMedia, Chip, 
    Divider, IconButton, Rating, Stack, Tooltip, Typography 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import defaultImage from '~/assets/DefaultImage/course.jpg';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Styled component for hover effect
const StyledCard = styled(Card)(({ theme }) => ({
    width: 320,  // Fixed width
    height: 'auto', // Automatic height based on content
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
}));

const StatusChip = styled(Chip)(({ color }) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    fontWeight: 600,
    zIndex: 1
}));

const FreeTag = styled('div')(() => ({
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'white',
    padding: '6px 10px',
    borderRadius: 16,
    fontSize: '0.75rem',
    fontWeight: 700,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1
}));

const StyledCardMedia = styled(CardMedia)({
    height: 180,  // Fixed height for image
    width: '100%', // Full width of card
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const StyledCardContent = styled(CardContent)({
    padding: '16px',
    '&:last-child': {
        paddingBottom: '16px',
    },
});

const CourseItem = ({ isFree, courseImg, courseName, courseId, status, approveBy, course }) => {
    const navigate = useNavigate();

    const handleClickCourseItem = (courseId) => {
        navigate(`/course-management/${courseId}`);
    }

    const handleClickListStudentOfCourse = (e, courseId) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền đến thẻ Card
        navigate(`student/${courseId}`);
    }

    const handleEditCourse = (e, courseId) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền đến thẻ Card
        navigate(`/course-management/${courseId}`);
    }

    // Xác định màu sắc cho trạng thái khóa học
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'unpublished':
                return 'error';
            default:
                return 'default';
        }
    };

    // Lấy thông tin học sinh đăng ký từ dữ liệu khóa học (nếu có)
    const enrolledCount = course?.enrollmentCount || 0;
    
    // Lấy số lượng module hoặc bài học
    const moduleCount = course?.modules?.length || 0;
    const lessonCount = course?.modules?.reduce((total, module) => 
        total + (module.moduleItems?.length || 0), 0) || 0;

    return (
        <StyledCard elevation={3}>
            <Box sx={{ position: 'relative' }}>
                <StyledCardMedia
                    component="img"
                    image={courseImg || defaultImage}
                    alt={courseName}
                    onClick={() => handleClickCourseItem(courseId)}
                />                {isFree && (
                    <FreeTag>
                        Free
                    </FreeTag>
                )}
                <StatusChip 
                    label={status || "Unpublished"} 
                    color={getStatusColor(status)} 
                    size="small"
                />
            </Box>

            <StyledCardContent onClick={() => handleClickCourseItem(courseId)}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '3rem',
                        lineHeight: '1.5rem',
                        fontWeight: 600,
                    }}
                >
                    {courseName}
                </Typography>

                <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <SchoolIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            {moduleCount} module{moduleCount !== 1 ? 's' : ''}
                        </Typography>
                    </Stack>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <AssignmentIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            {lessonCount} {lessonCount !== 1 ? 'lessons' : 'lesson'}
                        </Typography>
                    </Stack>
                    
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PeopleAltIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            {enrolledCount} {enrolledCount !== 1 ? 'students' : 'student'}
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                        label={approveBy ? "Approved" : "Not Approved"} 
                        color={approveBy ? "success" : "default"} 
                        size="small"
                        variant="outlined"
                    />
                    <Typography variant="h6" color={isFree ? "success.main" : "primary.main"} fontWeight="bold">
                        {isFree ? 'Free' : `$${course?.price?.toLocaleString()}`}
                    </Typography>
                </Box>
            </StyledCardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>                <Button 
                    size="small" 
                    variant="contained" 
                    fullWidth
                    onClick={(e) => handleClickListStudentOfCourse(e, courseId)}
                    startIcon={<PeopleAltIcon />}
                >
                    Student List
                </Button>
                
                <Tooltip title="Edit Course">
                    <IconButton 
                        color="primary" 
                        onClick={(e) => handleEditCourse(e, courseId)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </StyledCard>
    );
};

export default CourseItem;