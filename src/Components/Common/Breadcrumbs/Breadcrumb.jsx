import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCourseByID } from '~/store/slices/Course/action';


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
    //const [loadCourse, setLoadCourse] = useState(false);
    // useEffect(() => {
    //     if (courseId) {
    //         const fetchData = async () => {
    //             await dispatch(getCourseByID(courseId));
    //             if (currentCourse) {
    //                 console.log('currentCourse', currentCourse);
    //                 setCourse(currentCourse);
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [courseId, dispatch, getCourseByID]);

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
                        {currentCourse?.data?.title}
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