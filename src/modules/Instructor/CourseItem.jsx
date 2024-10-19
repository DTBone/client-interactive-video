import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import defaultImage from '~/assets/DefaultImage/course.jpg';
import { useNavigate } from 'react-router-dom';
// Styled component for hover effect
const StyledCard = styled(Card)(({ theme }) => ({
    width: 320,  // Fixed width
    height: 280, // Fixed height
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

const CourseItem = ({ isFree, courseImg, courseName, courseId, status }) => {
    const navigate = useNavigate();
    const handleClickCourseItem = (courseId) => {
        navigate(`${courseId.trim().toLowerCase().replace(/\s+/g, '-')}`)
    }
    return (
        <StyledCard elevation={2}>
            <div style={{ position: 'relative', padding: '1rem' }}
                onClick={() => handleClickCourseItem(courseId)}
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
                    }}
                >
                    {courseName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Status: {status}
                </Typography>
            </StyledCardContent>
        </StyledCard >
    );
};

export default CourseItem;