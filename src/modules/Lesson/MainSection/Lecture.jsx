import * as React from 'react';
import {
    Box,
    Tab,
    Paper,
    Typography,
    IconButton,
    Stack,
    Divider,
    Snackbar,
    Alert
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
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLectureById, updateLectureProgress } from '~/store/slices/Quiz/action';
import { useOutletContext } from 'react-router-dom';
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid';
import EditNoteIcon from '@mui/icons-material/EditNote';

const Lecture = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const progress = useSelector((state) => state.progress.progress);
    const lectureId = location.state.item.video;
    console.log('location', lectureId);

    const { onQuizSubmit } = useOutletContext();
    const [value, setValue] = React.useState('1');
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [lecture, setLecture] = React.useState({})
    const [alert, setAlert] = React.useState('');

    console.log('progress', progress)

    const getLecture = async () => {
        const result = await dispatch(getLectureById(lectureId))
        if (result.payload.success) {
            setLecture({ ...result.payload.data, title: location.state.item.title });
            setIsCompleted(progress.status == 'completed');
        }
        else {
            console.log("Failed to get lecture")
        }
    }
    React.useEffect(() => {
        console.log("lecture", lecture)
    }, [lecture])

    const onCompleteVideo = async (progressVideo) => {
        const rep = await dispatch(updateLectureProgress({ progressId: progress._id, progressVideo: { ...progressVideo, videoId: lectureId } }))
        if (rep.payload.success) {
            setAlert('Completed video');
            if (onQuizSubmit) {
                onQuizSubmit(true);
            }
        }
        else {
            console.log('update progress failed')
        }
    }

    React.useEffect(() => {
        getLecture()
    }, [location])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Convert seconds to HH:MM:SS format
    const formatDuration = (seconds) => {
        console.log('seconds', seconds)
        seconds = Math.floor(seconds);
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
        <Paper elevation={3} sx={{
            m: 2, width: '100%',
            borderRadius: 5,
        }}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <div className="felx flex-row justify-between items-center">

                    <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
                        {lecture?.title || 'Video'}
                    </Typography>

                    <EditNoteIcon sx={{ fontSize: 30, color: '#1976d2', marginRight: '16px' }} />
                </div>

                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange}>
                            <Tab label="Video" value="1" />
                            <Tab label="Infomation" value="2" />
                        </TabList>
                    </Box>

                    <TabPanel value="1" sx={{ p: 0 }}>
                        <Video src={lecture.file} questions={lecture?.questions} isComplete={isCompleted} setIsComplete={setIsCompleted} onCompleteVideo={onCompleteVideo} moduleItemId={location.state.item._id} />

                    </TabPanel>

                    <TabPanel value="2">
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Description /> Description
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {lecture.description}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime /> Time: {formatDuration(lecture.duration)} minutes
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday /> Created day: {formatDate(lecture.createdAt)}
                                </Typography>
                            </Box>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Box>
            <Snackbar
                open={Boolean(alert)}
                autoHideDuration={5000}
                onClose={() => setAlert('')}
            >
                <Alert
                    onClose={() => setAlert('')}
                    severity={'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default Lecture;