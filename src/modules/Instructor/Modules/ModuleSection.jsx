import { Grid } from '@mui/material'
import { useState } from 'react';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'

const ModuleSection = () => {
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

                    </Grid>

                    <Grid item xs={12} sm={9} md={8} lg={isExpanded ? 9.7 : 11.4} className=" relative ">

                    </Grid>
                </Grid>
            </div>

        </div >
    )
}

export default ModuleSection
