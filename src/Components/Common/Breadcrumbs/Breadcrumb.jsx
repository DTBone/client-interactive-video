import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function Breadcrumb() {
    const navigate = useNavigate();
    return (
        <div role="presentation" onClick={handleClick} className="pl-0 pr-0 ml-0 mx-auto sticky">
            <Breadcrumbs aria-label="breadcrumb">

                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" className="text-black hover:bg-slate-200" onClick={() => navigate(`/home`)} />


                <Link
                    onClick={() => navigate(`/home`)}
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Browse
                </Link>
                <Link
                    onClick={() => navigate(`/home`)}
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Course
                </Link>
                <Typography
                    sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                >

                    Breadcrumb
                </Typography>
            </Breadcrumbs>
        </div>
    );
}