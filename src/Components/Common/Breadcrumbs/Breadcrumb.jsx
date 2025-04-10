import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCourseByID } from '~/store/slices/Course/action';
import { clearCurrentCourse } from '~/store/slices/Course/courseSlice';


function handleClick(event) {

    event.preventDefault();
    console.info('You clicked a breadcrumb.');

}

export default function Breadcrumb({ courseId, moduleIndex, itemTitle, studentManager }) {
    const user = useSelector(state => state.auth.user)
    const role = user?.role || 'student';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse } = useSelector((state) => state.course)
    const [course, setCourse] = useState(currentCourse);
    console.log("props", courseId, moduleIndex, itemTitle, studentManager)
    const [loadCourse, setLoadCourse] = useState(false);

    // dispatch(clearCurrentCourse()); // Xóa currentCourse khi component mount

    useEffect(() => {
        if (courseId && !currentCourse) { // Chỉ gọi API nếu dữ liệu chưa có
            const fetchData = async () => {
                //dispatch(clearCurrentCourse());
                await dispatch(getCourseByID(courseId));
            };
            fetchData();
        }
    }, [courseId, currentCourse]); // Thêm currentCourse để ngăn lặp vô hạn


    // useEffect(() => {
    //     if (currentCourse) {
    //         setCourse(currentCourse);
    //         console.log('currentCourse', currentCourse);
    //     }
    // }, [currentCourse]);

    const handleClick = (path) => {
        let navigatePath = '';

        switch (path) {
            case 'home':
                navigatePath = role === 'student' ? '/homeuser' : '/instructor';
                break;
            case 'course':
                navigatePath = role === 'student'
                    ? `/learns/${courseId}`
                    : `/course-management/${courseId}`;
                break;
            case 'module':
                navigatePath = role === 'student'
                    ? `/learns/${courseId}/module/${moduleIndex}`
                    : `/course-management/${courseId}/module/${moduleIndex}`;
                break;
            case 'item':
                navigatePath = role === 'student'
                    ? `/learns/${courseId}/module/${moduleIndex}/${itemTitle}`
                    : `/course-management/${courseId}/module/${moduleIndex}/${itemTitle}`;
                break;
            case 'studentManager':
                navigatePath = '/instructor/student-management';
                break;
            default:
                navigatePath = path;
        }
        console.log('navigatePath', navigatePath)
        navigate(navigatePath);
    };

    return (
        <div role="presentation" className="pl-0 pr-0 ml-0 mx-auto sticky mt-3 px-4">
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    onClick={() => handleClick('home')}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} />

                </Link>

                {courseId && (
                    <Link
                        color="inherit"
                        onClick={() => handleClick('course')}
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        {currentCourse?.title}
                    </Link>
                )}

                {moduleIndex !== undefined && (
                    <Link
                        color="inherit"
                        onClick={() => handleClick('module')}
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        Module {moduleIndex}
                    </Link>
                )}

                {itemTitle && (
                    <Typography
                        color="textPrimary"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        {itemTitle}
                    </Typography>
                )}
                {
                    studentManager && (
                        <Link
                            color="inherit"
                            onClick={() => handleClick('studentManager')}
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                            Student Management
                        </Link>
                    )
                }
            </Breadcrumbs>
        </div>
    );
}