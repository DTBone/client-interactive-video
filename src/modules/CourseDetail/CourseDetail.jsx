import Grid from '@mui/material/Grid';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Button, Divider } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import CustomScrollbar from '~/Components/Common/CustomScrollbar';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCourseByID } from '~/store/slices/Course/action';

const CourseDetail = () => {
    const courseID = localStorage.getItem('courseId');
    const { courseId } = useParams();
    const dispatch = useDispatch();
    console.log("courseID ", courseId);
    useEffect(() => {
        if (courseId) {
            const fetchData = async () => {
                await dispatch(getCourseByID(courseId));

            };
            fetchData();
        }
    }, [courseId, dispatch]);


    return (

        <div className="h-screen flex flex-col overflow-hidden">
            <header className=' '>
                <HeaderCourse />

            </header>
            <div className="flex h-full overflow-hidden">
                <Grid container className="  justify-between ">
                    <Grid item xs={2} sm={3} md={4} lg={3} className="relative  ">
                        <div className="flex flex-row  h-full">
                            <CustomScrollbar>
                                <div className="ml-6  mt-2  h-[calc(100vh-80px)] overflow-y-scroll">
                                    <SideBar />
                                </div>
                                <Divider orientation="vertical" flexItem />
                            </CustomScrollbar>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={9} md={8} lg={9} className="p-5 relative  w-full">
                        <section className=' sticky top-0 z-10 '>
                            <Breadcrumb courseId={courseID} />

                        </section>


                        <CustomScrollbar className=''>

                            <div className="container mx-auto  overflow-y-scroll  h-[calc(100vh-100px)] pt-3 pl-3 pr-3 w-full">
                                <Outlet />
                            </div>
                        </CustomScrollbar>
                    </Grid>

                    {/* <Grid item xs={0} sm={3} md={4} lg={3} className="relative">
                        <RightPart />
                    </Grid> */}

                </Grid>
            </div>

        </div >
    )
}

export default CourseDetail
