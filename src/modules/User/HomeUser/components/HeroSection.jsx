import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import CourseCard from './CourseCard/CourseCard';
import CourseCarousel from './CourseCard/CourseCarousel';

const HeroSection = () => {
    const sampleCourses = [
        {
            id: 1,
            title: "React JS Cơ Bản",
            instructor: "Nguyễn Văn A",
            students: 1500,
            rating: 5,
            price: 0,
            image: "https://source.unsplash.com/400x300/?technology"
        },
        {
            id: 2,
            title: "Lập trình Java nâng cao",
            instructor: "Trần Văn B",
            students: 1200,
            rating: 4.5,
            price: 300000,
            image: "https://source.unsplash.com/400x300/?coding"
        },
        {
            id: 3,
            title: "Python cho người mới bắt đầu",
            instructor: "Lê Thị C",
            students: 1800,
            rating: 4.8,
            price: 200000,
            image: "https://source.unsplash.com/400x300/?python"
        },
        {
            id: 3,
            title: "Python cho người mới bắt đầu",
            instructor: "Lê Thị C",
            students: 1800,
            rating: 4.8,
            price: 200000,
            image: "https://source.unsplash.com/400x300/?python"
        },
        {
            id: 4,
            title: "Python cho người mới bắt đầu",
            instructor: "Lê Thị C",
            students: 1800,
            rating: 4.8,
            price: 200000,
            image: "https://source.unsplash.com/400x300/?python"
        },
        {
            id: 5,
            title: "Python cho người mới bắt đầu",
            instructor: "Lê Thị C",
            students: 1800,
            rating: 4.8,
            price: 200000,
            image: "https://source.unsplash.com/400x300/?python"
        },
    ];



    return (
        <div className="flex flex-row items-center justify-between w-full h-full bg-[#fffffa] gap-8">
            {/* <Box sx={{ mb: 4, mt: 2, }}>
                <Typography variant="h4" className=' font-bold mt-4'>Welcome back!</Typography>

            </Box> */}
            <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "auto" }}>

                {sampleCourses.map((course, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <CourseCard key={course.id} course={course} />
                    </Grid>
                ))}
            </Grid>


        </div>
    )
}

export default HeroSection
