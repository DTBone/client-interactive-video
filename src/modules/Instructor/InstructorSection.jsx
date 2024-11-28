import { Button, Grid, Typography } from '@mui/material'
import { useEffect } from 'react';

import CourseItem from './Courses/CourseItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseByInstructor } from '~/store/slices/Course/action';

import { clearCurrentCourse } from '~/store/slices/Course/courseSlice';
import CoursePage from './CoursePage';

const InstructorSection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const courses = useSelector(state => state.course.courses)
    const handleClickNewCourse = () => {
        dispatch(clearCurrentCourse());
        navigate(`/course-management/new-course`)
    }


    const checkFreeCourse = (price) => {
        if (price === 0) {
            return true
        }
        return false
    }
    useEffect(() => {
        dispatch(getCourseByInstructor())
    }, [dispatch])

    //console.log(`Courses: `, courses)
    return (
        // <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex h-[calc(100vh-150px)] justify-center overflow-y-auto ">
            {/* <Grid container className=" justify-start gap-5 mx-5 py-4">
                    {courses.map((course, index) => (
                        <CourseItem key={index} isFree={checkFreeCourse(course.price)} courseImg={course.photo} courseName={course.title}
                            courseId={course._id}
                            course={course}
                            status={course.status} approveBy={course.isApproved} />
                    ))}
                </Grid> */}
            <CoursePage courses={courses} />
        </div>

        // </div >
    )
}

export default InstructorSection
