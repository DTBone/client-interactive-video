import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import RightPart from "./RightPart"
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Button, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import Overview from './MainSection/Overview';
import Grades from './MainSection/Grades';
import CourseInfo from './MainSection/CourseInfo';
import Messages from './MainSection/Messages';
import Module from './MainSection/Modules/Module';



const CourseDetail = () => {
    const [selectedContent, setSelectedContent] = useState('Overview');
    const renderContent = () => {
        switch (selectedContent) {
            case 'Overview': return <Overview />;
            case 'Grades': return <Grades />;
            case 'CourseInfo': return <CourseInfo />;
            case 'Messages': return <Messages />;
            case 'Modules': return <Module />;
            default: return <Overview />;
        }
    };
    return (
        <div className="h-screen flex flex-col">
            <header className=' '>
                <HeaderCourse />
                <Divider />

            </header>
            <div className="flex-1 mt-2">
                <Grid container className="px-5 lg:px-36 justify-between">
                    <Grid item xs={2} sm={3} md={4} lg={3} className="relative ">
                        <div className="ml-6 overflow-y-auto h-[calc(100vh-90px)] scrollbar-custom">

                            <div className="w-full bg-transparent h-[200px] flex justify-start items-center ">
                                <Typography variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>Course Name</Typography>

                            </div>
                            <div >

                                <SideBar onSelectContent={setSelectedContent} />

                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={9} md={8} lg={6} className="px-5 lg:px-9 relative">
                        {renderContent()}
                    </Grid>

                    <Grid item xs={0} sm={3} md={4} lg={3} className="relative">
                        <RightPart />
                    </Grid>

                </Grid>
            </div>

        </div >
    )
}

export default CourseDetail
