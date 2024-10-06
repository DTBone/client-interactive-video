import * as React from 'react';
import VideoPlayer from "../Components/VideoPlayer"
import YoutubePlayer from "../Components/YoutubePlayer"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Lecture = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            {/* <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" /> */}
            {/* https://youtu.be/eGZZ1kNWlQo */}

            <YoutubePlayer videoId="eGZZ1kNWlQo" />
            <h1 className="text-3xl font-bold text-start mb-4 mt-2 text-gray-800">Video name lesson</h1>
            <div>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Item One" value="1" />
                                <Tab label="Item Two" value="2" />
                                <Tab label="Item Three" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">Item One</TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Box>
            </div>

        </div>
    )
}

export default Lecture
