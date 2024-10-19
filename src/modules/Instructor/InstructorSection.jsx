import { Button, Grid, Typography } from '@mui/material'
import { useState } from 'react';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import CourseItem from './CourseItem';
import { useNavigate } from 'react-router-dom';

const InstructorSection = () => {
    const navigate = useNavigate();
    const handleClickNewCourse = () => {
        navigate(`new-course`)
    }
    const Courses = [
        {
            courseId: 'java',
            courseImg: 'data:image/jpeg;base64,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',
            courseName: 'Algorithms',
            isFree: false
        },
        {
            courseImg: '',
            courseId: 'java2',
            courseName: 'Data Structures',
            isFree: true
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: false,
            status: 'unpublished'
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true,
            status: 'draft'
        },
        {
            courseImg: '',
            courseId: 'react',
            courseName: 'React',
            isFree: true,
            status: 'published'
        }

    ]
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header className=' '>
                <HeaderCourse />
            </header>
            <div className='mx-5 mt-3 flex flex-row justify-between'>
                <Typography sx={{ fontSize: '2rem' }}>List Course</Typography>
                <Button onClick={() => handleClickNewCourse()}>Add New Course</Button>
            </div>
            <div className="flex h-full justify-center overflow-auto">
                <Grid container className=" justify-start gap-5 mx-5 py-4">
                    {Courses.map((course, index) => (
                        <CourseItem key={index} isFree={course.isFree} courseImg={course.courseImg} courseName={course.courseName}
                            courseId={course.courseId}
                            status={course.status} />

                    ))}
                </Grid>
            </div>

        </div >
    )
}

export default InstructorSection
