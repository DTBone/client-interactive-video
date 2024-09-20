import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState } from 'react'
import About from './about';
import Modules from './modules';
import Testimonials from './Testimonials';
import Reviews from './reviews';
import { TabContext, TabList, TabPanel } from "@mui/lab";


const Tabcourse = () => {
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
                        <Tab label="Testimonials" value="testimonials" />
                        <Tab label="Reviews" value="reviews" />
                    </TabList>
                </Box>
                <TabPanel value="about"><About /></TabPanel>
                <TabPanel value="modules"><Modules /></TabPanel>
                <TabPanel value="testimonials"><Testimonials /></TabPanel>
                <TabPanel value="reviews"><Reviews /></TabPanel>
            </TabContext>
        </Box>
    );
}

export default Tabcourse
