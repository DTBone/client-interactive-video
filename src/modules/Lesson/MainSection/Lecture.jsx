import * as React from 'react';
import {
    Box,
    Tab,
    Paper,
    Typography,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    PlayArrow,
    Pause,
    VolumeUp,
    VolumeOff,
    Fullscreen,
    Description,
    AccessTime,
    CalendarToday
} from '@mui/icons-material';
import Video from "~/modules/Lesson/MainSection/Video.jsx";


const Lecture = ({ lecture }) => {
    const [value, setValue] = React.useState('1');

    if (!lecture) {
        lecture = {
            "_id": "672d841965a846d4ef454f86",
            "moduleId": "67387230192f25da8f49c968",
            "title": "Introduction to React",
            "videoUrl": "http://localhost:9000/codechef/Video_Example.mp4",
            "description": "This video covers the basics of React.js.",
            "createdAt": "2024-11-08T03:23:05.097Z",
            "updatedAt": "2024-11-08T03:23:05.097Z",
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Convert seconds to HH:MM:SS format
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Paper elevation={3} sx={{ m: 2,
            borderRadius: 5, }}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
                    {lecture.title}
                </Typography>

                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange}>
                            <Tab label="Video" value="1" />
                            <Tab label="Thông tin" value="2" />
                        </TabList>
                    </Box>

                    <TabPanel value="1" sx={{ p: 0 }}>
                        <Video src={lecture.videoUrl} />
                    </TabPanel>

                    <TabPanel value="2">
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Description /> Mô tả
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {lecture.description}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime /> Thời lượng: {formatDuration(lecture.duration)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday /> Ngày tạo: {formatDate(lecture.createdAt)}
                                </Typography>
                            </Box>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Box>
        </Paper>
    );
};

export default Lecture;