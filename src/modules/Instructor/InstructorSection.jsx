import { Button, Grid, Typography } from '@mui/material'
import { useEffect } from 'react';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import CourseItem from './Courses/CourseItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseByInstructor } from '~/store/slices/Course/action';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
import { clearCurrentCourse } from '~/store/slices/Course/courseSlice';

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
        <div className="h-screen flex flex-col overflow-hidden">
            <header className=''>
                <HeaderCourse />
                <Breadcrumb />
            </header>
            <div className='mx-5 mt-3 flex flex-row justify-between'>
                <Typography sx={{ fontSize: '2rem' }}>Wellcome, {user?.profile?.fullname} </Typography>
                <Button onClick={() => handleClickNewCourse()}>Add New Course</Button>
            </div>
            <div className="flex h-full justify-center overflow-auto ">
                <Grid container className=" justify-start gap-5 mx-5 py-4">
                    {courses.map((course, index) => (
                        <CourseItem key={index} isFree={checkFreeCourse(course.price)} courseImg={course.photo} courseName={course.title}
                            courseId={course._id}
                            status={course.status} approveBy={course.isApproved} />

                    ))}
                </Grid>
            </div>

        </div >
    )
}

export default InstructorSection
