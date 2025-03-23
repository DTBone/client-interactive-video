import React, { useState } from 'react'
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import CourseCard from './CourseCard/CourseCard';

const coursesByCategory = {
    all: [
        { id: 1, title: "React JS Cơ Bản", instructor: "Nguyễn Văn A", students: 1500, price: 0, image: "https://source.unsplash.com/400x300/?technology" },
        { id: 2, title: "Lập trình Java nâng cao", instructor: "Trần Văn B", students: 1200, price: 300000, image: "https://source.unsplash.com/400x300/?coding" },
        { id: 3, title: "Python cho người mới bắt đầu", instructor: "Lê Thị C", students: 1800, price: 200000, image: "https://source.unsplash.com/400x300/?python" }
    ],
    frontend: [
        { id: 4, title: "CSS Mastery", instructor: "Nguyễn Văn D", students: 1000, price: 150000, image: "https://source.unsplash.com/400x300/?css" },
        { id: 5, title: "JavaScript Basics", instructor: "Phạm Thị E", students: 2000, price: 0, image: "https://source.unsplash.com/400x300/?javascript" }
    ],
    backend: [
        { id: 6, title: "Node.js for Beginners", instructor: "Trần Văn F", students: 2500, price: 250000, image: "https://source.unsplash.com/400x300/?nodejs" }
    ],
    mobile: [
        { id: 7, title: "Flutter Development", instructor: "Lê Thị G", students: 1800, price: 300000, image: "https://source.unsplash.com/400x300/?flutter" }
    ],
    data: [
        { id: 8, title: "Machine Learning Basics", instructor: "Nguyễn Văn H", students: 3500, price: 500000, image: "https://source.unsplash.com/400x300/?ai" }
    ],
    devops: [
        { id: 9, title: "Docker & Kubernetes", instructor: "Phạm Văn I", students: 2200, price: 400000, image: "https://source.unsplash.com/400x300/?docker" }
    ]
};
const CoursesByCategorySection = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    return (
        <div className="max-w-[1200px] flex flex-col items-start justify-between w-full h-full bg-[#fffffa]  ">
            <Typography variant="h5" fontWeight={600} color='text.primary' mb={2}>Courses By Category</Typography>

            {/* Tab filter categories */}
            <Tabs
                value={selectedCategory}
                onChange={(e, newValue) => setSelectedCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
            >
                <Tab label="All" value="all" />
                <Tab label="Frontend" value="frontend" />
                <Tab label="Backend" value="backend" />
                <Tab label="Mobile" value="mobile" />
                <Tab label="Data Science" value="data" />
                <Tab label="DevOps" value="devops" />
            </Tabs>

            {/* Courses grid */}
            <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "auto", flexGrow: 1 }}>
                {coursesByCategory[selectedCategory].map((course, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <CourseCard key={course.id} course={course} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default CoursesByCategorySection
