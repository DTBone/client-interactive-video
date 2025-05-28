import { PlayArrow } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, CardMedia, LinearProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const CourseCardWithProgress = ({ course }) => {
    const navigate = useNavigate()
    return (
        <Card sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            boxShadow: '0 2px 12px 0 rgba(60,72,88,0.08)',
            transition: "transform 0.3s, box-shadow 0.3s",
            '&:hover': {
                transform: 'translateY(-6px) scale(1.04)',
                boxShadow: '0 8px 24px 0 rgba(60,72,88,0.18)',
            },
        }}>
            <CardMedia
                component="img"
                height="140"
                image={course.photo}
                alt={course.title}
                sx={{
                    height: "170px",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
            />
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }} noWrap>{course.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {course.instructor?.profile?.avatar && (
                        <img src={course.instructor.profile.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8 }} />
                    )}
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {course.instructor?.profile?.fullname || "Giảng viên ẩn danh"}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight={600} sx={{ minWidth: 48 }}>
                        {course.progress?.overallPercentage || 0}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={course.progress?.overallPercentage}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            flex: 1,
                            ml: 1,
                            background: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 100%)',
                            },
                        }}
                    />
                </Box>
            </CardContent>
            <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<PlayArrow />}
                    onClick={() => navigate(`/learns/${course?._id}`)}
                    sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                    Continue Learning
                </Button>
            </CardActions>
        </Card>
    )
}

CourseCardWithProgress.propTypes = {
    course: PropTypes.shape({
        photo: PropTypes.string,
        title: PropTypes.string,
        progress: PropTypes.shape({
            overallPercentage: PropTypes.number,
        }),
        instructor: PropTypes.shape({
            profile: PropTypes.shape({
                fullname: PropTypes.string,
                avatar: PropTypes.string,
            })
        })
    }).isRequired
};

export default CourseCardWithProgress
