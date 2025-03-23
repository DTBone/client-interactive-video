import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CourseCard from './CourseCard/CourseCard';

const NewCoursesSection = () => {
    // State để theo dõi số lượng khóa học cần hiển thị
    const [visibleCourses, setVisibleCourses] = useState(3);
    const { courses, loading, error } = useSelector((state) => state.course);

    // Hàm xử lý khi nhấn vào nút "Show more"
    const handleShowMore = () => {
        setVisibleCourses(prevVisible => prevVisible + 8);
    };

    // Lấy số lượng khóa học hiện tại cần hiển thị
    const coursesToShow = courses.slice(0, visibleCourses);

    // Kiểm tra xem còn khóa học nào chưa hiển thị không
    const hasMoreCourses = visibleCourses < courses.length;
    return (
        <div className=" flex flex-col items-start justify-between w-full h-full bg-[#fffffa]">

            <Typography variant='h5' fontWeight={600} color='text.primary' mb={2}>
                New Courses
            </Typography>

            <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "auto" }}>

                {coursesToShow.map((course, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <CourseCard key={course.id} course={course} />
                    </Grid>
                ))}
            </Grid>

            {hasMoreCourses && (
                <Button
                    variant='outlined'
                    color='primary'
                    sx={{ mt: 2 }}
                    onClick={handleShowMore}
                >
                    Show 8 more
                </Button>
            )}
        </div>
    )
}

export default NewCoursesSection
