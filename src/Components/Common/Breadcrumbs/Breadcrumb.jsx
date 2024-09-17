import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { useNavigate } from 'react-router-dom'
import { backgroundSize } from './../../../../node_modules/tailwindcss/src/util/validateFormalSyntax';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function Breadcrumb() {
    const navigate = useNavigate();
    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">

                <HomeIcon sx={{ mr: 0.5, }} fontSize="inherit" className="text-black hover:bg-slate-200" onClick={() => navigate(`/home`)} />


                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Browse
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