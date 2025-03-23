import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CourseCarousel from './CourseCard/CourseCarousel'
import CourseCard from './CourseCard/CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoursebyUser } from '~/store/slices/Course/action';
import CourseCardWithProgress from './CourseCard/CourseCardWithProgress';

const ContinueLearningSection = () => {
    const { courses, loading, error } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllCoursebyUser());
        console.log('courses', courses);
    }, [courses])

    const coursesToShow = courses.slice(0, 4);

    return (
        <div className=" flex flex-col items-start justify-between w-full h-full bg-[#fffffa]">
            <Typography variant='h5' fontWeight={600} color='text.primary' mb={2}>
                Recent Courses
            </Typography>
            <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "auto" }}>

                {coursesToShow.map((course, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <CourseCardWithProgress key={course.id} course={course} />
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}

export default ContinueLearningSection
