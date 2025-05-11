import { Avatar, Button, Card, CardContent, CardMedia, Chip, Divider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import HeaderCourse from '../../Components/Common/Header/HeaderCourse'
import Breadcrumb from '../../Components/Common/Breadcrumbs/Breadcrumb'
import EnrollCourseBtn from './Button/EnrollCourseBtn'
import CourseRegisFailed from './Notification/CourseRegisFailed';
import SuccessfulCourseRegis from './Notification/SuccessfulCourseRegis';
import Tabcourse from './Tab/tabcourse'
import courseService from '../../services/api/courseService'

import { useNavigate, useParams } from 'react-router-dom';
import { enrollCourse as enroll } from '~/store/slices/Course/action'
import { useDispatch, useSelector } from 'react-redux'
import Header from '~/Components/Header'

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Footer from '~/Components/Footer'

const EnrollToCourse = () => {

    const dispatch = useDispatch();
    const [enrollCourse, setState] = useState(false);
    const [enrollments, setEnroll] = useState();
    const [course, setCourse] = useState({});
    const [intructor, setIntructor] = useState({});
    const courseId = window.location.pathname.split('/').at(-1);
    const { currentCourse } = useSelector((state) => state.course)
    const [isSubmit, setSubmit] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();    const handleDataFromButotnSubmit = async (data) => {
        const result = await dispatch(enroll({ courseId: courseId }));
        console.log(result);
        if (result.payload.success) {
            setSubmit(true);
            setState(true);
            
            // Only show notification for paid courses
            if (course.price > 0) {
                openSnackbar();
            } else {
                // For free courses, just update enrolled status without notification
                if (user) {
                    const updatedUser = JSON.parse(localStorage.getItem('user'));
                    if (!updatedUser.enrolled_courses.includes(courseId)) {
                        updatedUser.enrolled_courses.push(courseId);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }
            }
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
                setEnroll(data.enrollments);
                console.log(enrollments);
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
        <div className='space-y-2 min-h-screen'>
            <section className='p-0 w-full m-0 '>
                <Header />
                <Divider />
            </section>
            <section className='px-6'>
                <Breadcrumb
                    courseId={courseId}
                //moduleIndex={ }
                //itemTitle={ }
                />
            </section>

            <section className="bg-[#f2f6fd] w-full  mt-2 flex flex-row justify-center items-center px-6">
                <div className="flex-grow-[6]  ml-5 max-w-4xl ">
                    <div className='flex flex-col gap-2 justify-start items-start h-[400px]'>
                        <Typography
                            variant='h2'
                            className='text-start font-bold'
                            sx={{ fontWeight: 500, marginTop: "16px" }}
                            noWrap={false}>{course?.title}
                        </Typography>
                        {/* Course Stats */}
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            {/* <Chip
                                icon={<AccessTimeIcon />}
                                label={`${course?.duration || '0'} hours`}
                                size="small"
                                sx={{ bgcolor: 'white' }}
                            /> */}
                            <Chip
                                icon={<PeopleAltIcon />}
                                label={`${enrollments || '0'} students`}
                                size="small"
                                sx={{ bgcolor: 'white' }}
                            />
                            <Chip
                                icon={<StarIcon />}
                                label={`${course?.averageRating || '0'} rating`}
                                size="small"
                                sx={{ bgcolor: 'white' }}
                            />
                            <Chip
                                icon={<LocalOfferIcon />}
                                label={course?.level || 'Beginner'}
                                size="small"
                                sx={{ bgcolor: 'white' }}
                            />
                        </Stack>
                        <Typography noWrap={false} >{course?.description}
                        </Typography>
                        <div className="flex flex-row gap-4 align-items-center">
                            <Avatar
                                alt={intructor?.profile?.fullname}
                                src={intructor?.profile?.picture}
                                sx={{ width: 56, height: 56 }}
                            />
                            <Typography>Intrucstors: {intructor?.profile?.fullname}
                                <Typography>{intructor?.email}</Typography>
                            </Typography>


                        </div>


                        <div className='mt-auto mb-6'>
                            {enrollCourse ? (
                                <div>
                                    <Button onClick={handleLearn} variant='contained' sx={{ width: "18rem", height: "4rem", background: theme => theme.palette.primary.main }}>
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
                    {course?.sumaryVideo ? (
                        <video
                            // width="600"
                            // height="350"
                            controls // Thêm điều khiển play/pause
                            preload="metadata" // Tải metadata trước nhưng không tự phát
                            poster={course?.photo} // Ảnh thay thế khi video chưa tải
                        >
                            <source src={course.sumaryVideo} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    ) : (
                        <Card sx={{ maxWidth: 600, minHeight: 350 }}>
                            {course?.photo ? (
                                <CardMedia
                                    sx={{ height: 400 }}
                                    image={course.photo}
                                    title="Course Image"
                                />
                            ) : (
                                <p className="text-center p-5">Không có hình ảnh</p>
                            )}
                        </Card>
                    )}
                </div>

            </section>
            <section className='ml-5 space-y-2 mr-6 px-6'>
                <Tabcourse course={course} isEnrolled={enrollCourse} />
            </section>

            <Footer className="mt-auto" />

        </div>
    )
}

export default EnrollToCourse


