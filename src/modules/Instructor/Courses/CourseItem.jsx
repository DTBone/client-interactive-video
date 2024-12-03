import React from 'react';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import defaultImage from '~/assets/DefaultImage/course.jpg';
import { useNavigate } from 'react-router-dom';
// Styled component for hover effect
const StyledCard = styled(Card)(({ theme }) => ({
    width: 320,  // Fixed width
    height: 320, // Fixed height
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));


const FreeTag = styled('div')(() => ({
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: '0.75rem',
    fontWeight: 600,
}));


const StyledCardMedia = styled(CardMedia)({
    height: 160,  // Fixed height for image
    width: '100%', // Full width of card

    borderRadius: 4,
    objectFit: 'cover',
});

const StyledCardContent = styled(CardContent)({
    height: 160, // Fixed height for content
    padding: '16px',
    '&:last-child': {
        paddingBottom: '16px',
    },
});

const CourseItem = ({ isFree, courseImg, courseName, courseId, status, approveBy, course }) => {
    const navigate = useNavigate();
    //console.log("imge url", courseImg)
    const handleClickCourseItem = (courseId) => {
        navigate(`/course-management/${courseId.trim().toLowerCase().replace(/\s+/g, '-')}`)
    }
    const handleClickListStudentOfCourse = (courseId) => {
        navigate(`student/${courseId.trim().toLowerCase().replace(/\s+/g, '-')}`)
    }
    console.log("CourseId: ", courseId)
    return (
        <StyledCard elevation={2} onClick={() => handleClickCourseItem(courseId)}>
            <div style={{ position: 'relative', padding: '1rem' }}

            >
                <StyledCardMedia
                    component="img"
                    image={courseImg || defaultImage}
                    alt={courseName}
                    sx={{ backgroundColor: '#8B0000', }}
                />
                {isFree && (
                    <FreeTag>
                        Free
                    </FreeTag>
                )}
            </div>

            <StyledCardContent>
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
                        whiteSpace: 'nowrap',
                        maxWidth: '80%',
                    }}
                >
                    {courseName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Status: {status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Approve: {approveBy ? "Passed" : "Not Approve Yet"}
                </Typography>
                <div className='flex justify-end'>
                    {/* <Button
                        variant="contained"
                        onClick={() => handleClickListStudentOfCourse(courseId)}
                        sx={{}}
                    >List Student</Button> */}
                </div>
            </StyledCardContent>
        </StyledCard >
    );
};

export default CourseItem;