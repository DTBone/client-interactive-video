/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState } from 'react'
import About from './About';
import Modules from './Modules';
import Progress from './Progress';
import Reviews from './Reviews';
import { TabContext, TabList, TabPanel } from "@mui/lab";


const Tabcourse = ({course, isEnrolled = false}) => {
    const [value, setValue] = useState('about');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="About" value="about" />
                        <Tab label="Modules" value="modules" />
                        {isEnrolled && <Tab label="Progress" value="progress" />}
                        <Tab label="Reviews" value="reviews" />
                    </TabList>
                </Box>
                <TabPanel value="about"><About course={course}/></TabPanel>
                <TabPanel value="modules"><Modules course={course}/></TabPanel>
                {isEnrolled && <TabPanel value="progress"><Progress course={course}/></TabPanel>}
                <TabPanel value="reviews"><Reviews course={course}/></TabPanel>
            </TabContext>
        </Box>
    );
}

export default Tabcourse
