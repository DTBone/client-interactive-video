import { Avatar, Button, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import HeaderCourse from '../../Components/Common/Header/HeaderCourse'
import Breadcrumb from '../../Components/Common/Breadcrumbs/Breadcrumb'
import EnrollCourseBtn from './Button/EnrollCourseBtn'
import CourseRegisFailed from './Notification/CourseRegisFailed';
import SuccessfulCourseRegis from './Notification/SuccessfulCourseRegis';
import Tabcourse from './Tab/tabcourse'
import courseService from '../../services/api/courseService'

import {useNavigate, useParams} from 'react-router-dom';
import { enrollCourse as enroll } from '~/store/slices/Course/action'
import { useDispatch } from 'react-redux'



const EnrollToCourse = () => {

    // const [enrollCourse, setState] = useState(false);
    // const [isSubmit, setSubmit] = useState(false);

    //     useEffect(() => {
    //         dispatch(getAllCourse()); // Gọi API để lấy danh sách khóa học
    //     }, [dispatch]);


    //     if (!courseState) {
    //         console.error("courseState is undefined");
    //         return null; // Hoặc hiển thị loading state
    //     }


    const dispatch = useDispatch();
    const [enrollCourse, setState] = useState(false);
    const [course, setCourse] = useState({});
    const [intructor, setIntructor] = useState({});
    const courseId = window.location.pathname.split('/').at(-1);
    const { id } = useParams();
    const [isSubmit, setSubmit] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const handleDataFromButotnSubmit = async (data) => {
        const result = await dispatch(enroll({ courseId: courseId}));
        console.log(result);
        if (result.payload.success) {
            setSubmit(true);
            setState(data);
            setSubmit(data);
            openSnackbar();
        }
        else setSubmit(false)
    };
    const handleLearn = () => {
        console.log('course', course);
        navigate(`/learns/${courseId}/`, { state: { course } });
    }
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(courseId, user._id);
                setCourse(data.data);
                setIntructor(data.data.instructor);
                console.log(data);
                setState(data.isEnrolled);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourse();
    }, [courseId]);


    const [snackbarState, setSnackbarState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });

    const openSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: true });
    };

    const closeSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };
    return (
        <div className='space-y-2'>
            <section className=' '>
                <HeaderCourse />


            </section>
            <section className='ml-5'>

                <Breadcrumb
                    courseId={id}
                //moduleIndex={ }
                //itemTitle={ }
                />
            </section>

            <section className="bg-[#f2f6fd] w-full h-3/4 mt-2 flex flex-row justify-center items-center ">
                <div className="flex-grow-[6]  ml-5 max-w-4xl ">
                    <div className='flex flex-col gap-4 justify-start items-start h-[400px]'>
                        <Typography
                            variant='h2'
                            className='text-start font-bold'
                            sx={{ fontWeight: 500, marginTop: "16px" }}
                            noWrap={false}>{course?.title}</Typography>
                        <Typography noWrap={false} >{course?.description}</Typography>
                        <Typography>Intrucstors: {intructor?.profile?.fullname}
                            <Avatar
                                alt={intructor?.profile?.fullname}
                                src={intructor?.profile?.picture}
                                sx={{ width: 56, height: 56 }}
                            />
                        </Typography>
                        <Typography>{intructor?.email}</Typography>

                        <div className='mt-auto mb-6'>
                            {enrollCourse ? (
                                <div>
                                    <Button onClick={handleLearn} variant='contained' sx={{ width: "18rem", height: "4rem", background: "#0048b0" }}>
                                        Go To Course
                                    </Button>
                                    <span className="ml-4 text-sm text-gray-500">Already go to course</span>
                                </div>
                            ) : (
                                <EnrollCourseBtn course={course} submitCourse={handleDataFromButotnSubmit} />
                            )}
                            {isSubmit ? (
                                <SuccessfulCourseRegis
                                    snackbarState={snackbarState}
                                    openSnackbar={openSnackbar}
                                    closeSnackbar={closeSnackbar}
                                />

                            ) : (
                                <CourseRegisFailed
                                    snackbarState={snackbarState}
                                    openSnackbar={openSnackbar}
                                    closeSnackbar={closeSnackbar}
                                />

                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-grow-[4] ml-10">
                    <Card sx={{ maxWidth: 600, minHeight: 350 }}>
                        <CardMedia
                            sx={{ height: 300 }}
                            image={course?.photo}
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {course?.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <section className='ml-5 space-y-2 mr-6'>
                <Tabcourse course={course} />
            </section>
        </div>
    )
}

export default EnrollToCourse
