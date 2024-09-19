import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import RightPart from "./RightPart"
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import SideBar from './SideBar/SideBar';
import { Button, Divider, Typography } from '@mui/material';

const CustomButton = styled(Button)(() => ({

    width: '100%',
    height: '64px',
    background: "transparent",
    justifyContent: 'flex-start',
    paddingLeft: '48px',
    borderRadius: "0 4px 4px 0",
    fontWeight: 'bold',
    textTransform: "none",
    color: "#000000",
    fontSize: "20px",
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: 'transparent',
        transition: 'background-color 0.3s',
    },
    '&:hover': {
        background: "#f0f6ff",

    },
    '&:active': {
        background: "#f2f5fa",
        borderLeftColor: "#0056d2",
        borderLeftWidth: "4px",
        borderRadius: "0 4px 4px 0",
        borderLeftStyle: 'solid',
    }

}));


const CourseDetail = () => {
    return (
        <div className="h-screen flex flex-col">
            <header className=' '>
                <HeaderCourse />
                <Divider />

            </header>
            <div className="flex-1 mt-2">
                <Grid container className="px-5 lg:px-36 justify-between">
                    <Grid item xs={2} sm={3} md={4} lg={3} className="relative ">
                        <div className="ml-6 overflow-y-auto h-[calc(100vh-90px)] relative">

                            <div className="w-full bg-blue-500 h-[200px] flex justify-center items-center ">
                                <Typography variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>Course Name</Typography>

                            </div>
                            <div >

                                <SideBar />
                                <CustomButton  >Grades</CustomButton>

                                <CustomButton>Messages</CustomButton>
                                <CustomButton >Course Info</CustomButton>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={9} md={8} lg={6} className="px-5 lg:px-9 relative">

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
