import Grid from '@mui/material/Grid';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Divider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Breadcrumb from '~/Components/Common/Breadcrumbs/Breadcrumb';
import { useState } from 'react';
import CustomScrollbar from '~/Components/Common/CustomScrollbar';

const GeneralLessons = () => {

    const [isExpanded, setIsExpanded] = useState(true);
    const handleSidebarButtonClick = () => {
        setIsExpanded(!isExpanded);
        //setSidebarWidth(isExpanded ? 55 : 255);
    };
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header className=' '>
                <HeaderCourse />
            </header>
            <div className="flex h-full ">
                <Grid container className=" justify-between ">
                    <Grid item xs={2} sm={3} md={4} lg={isExpanded ? 2.3 : 0.6} className="relative ">
                        <CustomScrollbar className=''>

                            <div className="flex flex-row overflow-y-scroll h-[calc(100vh-1px)]">
                                <div className=" mt-2 ">
                                    <SideBar handleSidebarButtonClick={handleSidebarButtonClick} isExpanded={isExpanded} />
                                </div>
                                <Divider orientation="vertical" flexItem />
                            </div>
                        </CustomScrollbar>
                    </Grid>

                    <Grid item xs={12} sm={9} md={8} lg={isExpanded ? 9.7 : 11.4} className=" relative ">
                        <section className='p-3 sticky top-0 z-10'>

                            <Breadcrumb />
                        </section>
                        <CustomScrollbar className=''>

                            <div className=" overflow-y-scroll  h-[calc(100vh-150px)] pt-3 pl-3 pr-3">
                                <Outlet />
                            </div>
                        </CustomScrollbar>
                    </Grid>
                </Grid>
            </div>

        </div >
    )

}

export default GeneralLessons
