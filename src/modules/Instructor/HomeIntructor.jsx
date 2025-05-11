import React from 'react'
import Grid from '@mui/material/Grid';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Button, Divider } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import CustomScrollbar from '~/Components/Common/CustomScrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Module from './../CourseDetail/MainSection/Modules/Module';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { clearCurrentCourse } from '~/store/slices/Course/courseSlice';
import Header from '~/Components/Header';

const HomeIntructor = () => {

    //const courseID = localStorage.getItem('courseId');
    //const moduleID = localStorage.getItem('moduleId');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);
    const handleSidebarButtonClick = () => {
        setIsExpanded(!isExpanded);
        //console.log('isExpanded', isExpanded);
        //setSidebarWidth(isExpanded ? 55 : 255);
    };

    const handleClickNewCourse = () => {
        dispatch(clearCurrentCourse());
        navigate(`/course-management/new-course`)
    }

    return (
        <div>
            <div className="h-screen flex flex-col overflow-hidden">
                <header className=' '>
                    <Header />
                    <Divider />
                </header>
                <div className="flex h-full pl-6 ">
                    <Grid container className=" justify-between ">
                        <Grid item xs={2} sm={3} md={4} lg={isExpanded ? 2.1 : 0.6}
                            // sx={{
                            //     width: isExpanded ? '19.5%' : '5%',
                            //     transition: 'width 0.3s ease'
                            // }}
                            className="relative ">
                            <CustomScrollbar className=''>

                                <div className="flex flex-row overflow-y-scroll h-[calc(100vh-1px)]">
                                    <div className=" mt-2 ">
                                        <SideBar handleSidebarButtonClick={handleSidebarButtonClick} isExpanded={isExpanded} />
                                    </div>
                                    <Divider orientation="vertical" flexItem />
                                </div>
                            </CustomScrollbar>
                        </Grid>                        <Grid item xs={12} sm={9} md={8} lg={isExpanded ? 9.9 : 11.4}
                            className="relative h-full">
                            
                            <div className="bg-white overflow-y-auto h-[calc(100vh-80px)] pt-4 px-4 pb-6 ">
                                <CustomScrollbar className="h-full">
                                    <Outlet />
                                </CustomScrollbar>
                            </div>
                        </Grid>
                    </Grid>
                </div>

            </div >
        </div>
    )
}

export default HomeIntructor
