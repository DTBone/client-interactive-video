import { Button, Grid, Typography, Paper, Box } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoursebyUser } from '~/store/slices/Course/action';
import CourseCardWithProgress from './CourseCard/CourseCardWithProgress';

const ContinueLearningSection = () => {
    const { courses } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllCoursebyUser());
    }, [dispatch]);

    const coursesToShow = courses.slice(0, 4);
    const hasMore = courses.length > 4;

    return (
        <Paper elevation={3} sx={{ width: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #f8fafc 0%, #e3f2fd 100%)', p: 4, mb: 4 }}>
            <Typography variant='h4' fontWeight={700} color='primary.main' mb={1} sx={{ letterSpacing: 1 }}>
                Khóa học của bạn
            </Typography>
            <Typography variant='body1' color='text.secondary' mb={3}>
                Tiếp tục học các khoá bạn đã đăng ký. Theo dõi tiến độ và hoàn thành mục tiêu của bạn!
            </Typography>
            <Grid container spacing={3}>
                {coursesToShow.map((course, index) => (
                    <Grid item key={index} xs={12} sm={6} md={3}>
                        <CourseCardWithProgress key={course.id} course={course} />
                    </Grid>
                ))}
            </Grid>
            {hasMore && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 3, px: 4, fontWeight: 600 }}>
                        Xem tất cả
                    </Button>
                </Box>
            )}
        </Paper>
    )
}

export default ContinueLearningSection
