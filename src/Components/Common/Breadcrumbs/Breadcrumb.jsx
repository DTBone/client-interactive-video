import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';


function handleClick(event) {

    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function Breadcrumb() {
    const user = useSelector(state => state.auth.user)
    const role = user?.role || 'student';
    const navigate = useNavigate();
    const pathLabels = {
        admin: {
            dashboard: 'Dashboard',
            courses: 'Courses Management',
            users: 'Users Management',
            settings: 'Settings',
            create: 'Create',
            edit: 'Edit',
            detail: 'Detail'
        },
        instructor: {
            dashboard: 'course-management',
            courses: 'My Courses',
            students: 'Students',
            analytics: 'Analytics',
            create: 'Create',
            edit: 'Edit',
            detail: 'Detail'
        },
        student: {
            dashboard: 'Dashboard',
            courses: 'Courses',
            learning: 'My Learning',
            progress: 'Progress',
            certificates: 'Certificates',
            detail: 'Detail'
        }
    };

    const getPathnames = () => {
        // Lọc bỏ các phần tử rỗng và query params
        return location.pathname
            .split('/')
            .filter(x => x)
            .map(path => ({
                path,
                label: pathLabels[role][path.toLowerCase()] || path
            }));
    };

    const pathnames = getPathnames();

    const getAccumulatedPath = (index, pathnames) => {
        return '/' + pathnames.slice(0, index + 1).map(item => item.path).join('/');
    };


    return (
        <div role="presentation" className="pl-0 pr-0 ml-0 mx-auto sticky mt-3 px-4">
            <Breadcrumbs aria-label="breadcrumb">

                <Link
                    color="inherit"

                    onClick={() => navigate(`/home`)}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon />

                </Link>
                {/* <Link
                    color="inherit"

                    onClick={() => navigate(`/${pathLabels[role].dashboard}`)}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    Dashboard
                </Link> */}
                {pathnames.map((breadcrumb, index) => {
                    const accumulatedPath = getAccumulatedPath(index, pathnames);
                    return (
                        <Link
                            key={breadcrumb.path}
                            color={index === pathnames.length - 1 ? 'textPrimary' : 'inherit'}
                            onClick={() => navigate(accumulatedPath)}
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                            {breadcrumb.label}
                        </Link>
                    );
                })}


            </Breadcrumbs>
        </div>
    );
}