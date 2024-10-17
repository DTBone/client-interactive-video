/* eslint-disable react/prop-types */
import { Typography } from '@mui/material';
import { Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import '~/index.css';
import CourseList from './components/CourseList';
function HomeUser({user}) {
    
    if(!user) {
        user = {}
    }
    const [recentCourses, setRecentCourses] = useState([]);
    useEffect(() => {
        const fetchRecentCourses = async () => {
            setRecentCourses([
                {
                    id: 1,
                    name: 'ReactJS',
                    description: 'ReactJS is a JavaScript library for building user interfaces.',
                    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
                    instructor: 'Facebook'
                },
                {
                    id: 2,
                    name: 'VueJS',
                    description: 'Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications.',
                    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vue.js_Logo.svg/1200px-Vue.js_Logo.svg.png',
                    instructor: 'Evan You'
                },
                {
                    id: 3,
                    name: 'Angular',
                    description: 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript.',
                    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png',
                    instructor: 'Google'
                },
                {
                    id: 4,
                    name: 'NodeJS',
                    description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
                    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
                    instructor: 'Ryan Dahl'
                }
            ])
        }
        if(recentCourses.length === 0) {
            fetchRecentCourses();
        }
    }, [recentCourses])

    const handleClickRecentCourses = () => {
        setRecentCourses(prev => [...prev, {
            id: 5,
            name: 'ExpressJS',
            description: 'Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under the MIT License.',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png',
            instructor: 'TJ Holowaychuk'
        },
        {
            id: 6,
            name: 'Svelte',
            description: 'Svelte is a free and open-source front end compiler created by Rich Harris. Svelte applications do not include framework references.',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg',
            instructor: 'Rich Harris'
        },
        {
            id: 7,
            name: 'NextJS',
            description: 'Next.js is an open-source React front-end development web framework that enables functionality such as server-side rendering and generating static websites for React based web applications.',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',
            instructor: 'Vercel'
        },
        {
            id: 8,
            name: 'NestJS',
            description: 'NestJS is a free and open-source web application framework for Node.js, which is progressive in nature. It uses TypeScript and is built with and fully supports Express.',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',
            instructor: 'Kamil Myśliwiec'
        }])
    }

    return ( 
        <div className='h-full w-full flex flex-col items-center pl-5 pr-5'>
            <Box size='100' />
            <Typography variant='h2'>Welcome {user.profile.fullname}</Typography>
            <Typography variant='h4'>Your email is {user.email}</Typography>

            {/* Khóa học gần đây */}
            <CourseList title='Recent Courses' initialCourses={recentCourses} handleClick={handleClickRecentCourses}/>
        </div>
     );
}

export default HomeUser;