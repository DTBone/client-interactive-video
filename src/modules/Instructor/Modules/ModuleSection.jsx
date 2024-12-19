import { Divider, Grid } from '@mui/material'
import { useState } from 'react';
import CustomScrollbar from '~/Components/Common/CustomScrollbar';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';

const ModuleSection = () => {
    const { currentCourse } = useSelector(state => state.course);
    console.log('curentcourse', currentCourse);
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header className=' '>
                <HeaderCourse />

            </header>
            <div className="flex h-full ">
                <Grid container className=" justify-between ">
                    <Grid item xs={2} sm={3} md={4} lg={3} className="relative  ">
                        <div className="flex flex-row  h-full">
                            <CustomScrollbar>
                                <div className="ml-6  mt-2  h-[calc(100vh-80px)] overflow-y-scroll">
                                    <Sidebar />
                                </div>
                                <Divider orientation="vertical" flexItem />
                            </CustomScrollbar>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={9} md={8} lg={9} className="p-5 relative  w-full">

                        <section className="pb-1">
                            <Breadcrumb
                                courseId={currentCourse?.data?._id}
                            />
                        </section>
                        <CustomScrollbar className=''>

                            <div className="container mx-auto  overflow-y-scroll  h-[calc(100vh-150px)] pt-3 pl-3 pr-3 w-full">
                                <Outlet />
                            </div>
                        </CustomScrollbar>
                    </Grid>
                </Grid>
            </div>

        </div >
    )
}

export default ModuleSection
