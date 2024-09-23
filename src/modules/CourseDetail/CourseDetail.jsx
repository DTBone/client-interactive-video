import Grid from '@mui/material/Grid';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Divider } from '@mui/material';
import { Outlet } from 'react-router-dom';

const CourseDetail = () => {

    return (
        <div className="h-screen flex flex-col">
            <header className=' '>
                <HeaderCourse />
            </header>
            <div className="flex h-full ">
                <Grid container className="px-5 lg:px-36 justify-between ">
                    <Grid item xs={2} sm={3} md={4} lg={3} className="relative ">
                        <div className="flex flex-row  h-full">
                            <div className="ml-6 overflow-y-auto h-[calc(100vh-90px)] scrollbar-custom mt-2 ">
                                <SideBar />
                            </div>
                            <Divider orientation="vertical" flexItem />
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={9} md={8} lg={9} className="px-5 lg:px-9 relative ">
                        <div className="container mx-auto p-4">
                            <Outlet />
                            {/* {renderContent()} */}
                        </div>
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
