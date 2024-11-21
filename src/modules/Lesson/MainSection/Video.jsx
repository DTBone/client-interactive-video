import React, { useRef, useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Slider,
    Stack,
    Typography,
    Tooltip,
    Fade,
    Paper,
    Popover,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    RadioGroup,
    FormControlLabel,
    DialogActions, Button, Radio, Snackbar, Alert
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    VolumeUp,
    VolumeDown,
    VolumeMute,
    Fullscreen,
    FullscreenExit,
    Settings,
    Speed, QuestionAnswer
} from '@mui/icons-material';

const Video = ({ src }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [buffered, setBuffered] = useState([]); // Mảng chứa các phần đã buffer
    const [isBuffering, setIsBuffering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState('');
    const speedOptions = [0.75, 1, 1.25];
    const questions = [
        {
            time: 10, // seconds
            question: "What was just discussed?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
        }
        // Add more questions as needed
    ]
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());// Set chứa các câu hỏi đã trả lời
    const [lastAllowedTime, setLastAllowedTime] = useState(0);
    // Kiểm tra xem có câu hỏi nào cần hiển thị không
    const checkForQuestions = (currentTime) => {
        const question = questions.find(q => {
            const timeDiff = Math.abs(q.time - currentTime);
            return timeDiff < 0.5 && !answeredQuestions.has(q.time);
        });

        if (question) {
            videoRef.current.pause();
            setIsPlaying(false);
            setCurrentQuestion(question);
            setOpenQuestionDialog(true);
        }
    };
    // Đảm bảo thời gian hiện tại không vượt quá thời gian của câu hỏi tiếp theo
    const enforceQuestionBoundary = (currentTime) => {
        const nextUnansweredQuestion = questions
            .filter(q => !answeredQuestions.has(q.time))
            .sort((a, b) => a.time - b.time)
            .find(q => q.time < currentTime);

        if (nextUnansweredQuestion) {
            videoRef.current.currentTime = nextUnansweredQuestion.time;
            setCurrentTime(nextUnansweredQuestion.time);
            setAlert('You cannot skip unanswered questions.');
        }
    };

    const handleAnswerSubmit = () => {
        if (currentQuestion && selectedAnswer !== null) {
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
            if(isCorrect) {
                setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.time]));
                setSelectedAnswer(null);
                setOpenQuestionDialog(false);
                setAlert('Congratulations! Your answer is correct.');
            }
            else {
                setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.time]));
                setSelectedAnswer(null);
                setAlert('Please try again.');
            }

            // Update the last allowed time to the next question or the end of the video
            const nextQuestion = questions
                .filter(q => q.time > currentQuestion.time)
                .sort((a, b) => a.time - b.time)[0];
            setLastAllowedTime(nextQuestion ? nextQuestion.time : duration);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            checkForQuestions(video.currentTime);
            enforceQuestionBoundary(video.currentTime);
            updateBufferProgress();
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        const handleWaiting = () => {
            setIsBuffering(true);
        };

        const handlePlaying = () => {
            setIsBuffering(false);
        };

        const handleProgress = () => {
            updateBufferProgress();
        };

        const updateBufferProgress = () => {
            const timeRanges = [];
            for (let i = 0; i < video.buffered.length; i++) {
                timeRanges.push({
                    start: video.buffered.start(i),
                    end: video.buffered.end(i)
                });
            }
            setBuffered(timeRanges);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('progress', handleProgress);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('progress', handleProgress);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [questions, answeredQuestions]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleVolumeChange = (event, newValue) => {
        const newVolume = newValue / 100;
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        if (newVolume === 0) {
            setPreviousVolume(volume);
        }
    };

    const handleMuteToggle = () => {
        if (volume === 0) {
            setVolume(previousVolume);
            videoRef.current.volume = previousVolume;
        } else {
            setPreviousVolume(volume);
            setVolume(0);
            videoRef.current.volume = 0;
        }
    };

    const handleTimeSeek = (event, newValue) => {
        const newTime = (newValue / 100) * duration;
        console.log(newTime);
        // Check if seeking past an unanswered question
        const nextUnansweredQuestion = questions
            .filter(q => !answeredQuestions.has(q.time))
            .sort((a, b) => a.time - b.time)
            .find(q => q.time < newTime);

        if (nextUnansweredQuestion) {
            videoRef.current.currentTime = nextUnansweredQuestion.time;
            setCurrentTime(nextUnansweredQuestion.time);
        } else {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleSpeedMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSpeedMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSpeedChange = (speed) => {
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
        handleSpeedMenuClose();
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeMute />;
        if (volume < 0.5) return <VolumeDown />;
        return <VolumeUp />;
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                bgcolor: 'black',
                overflow: 'hidden',
                '&:hover .controls': { opacity: 1 },
                borderRadius: '0 0 20px 20px',
            }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                onClick={handlePlayPause}
                style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                    cursor: 'pointer',
                }}
            />
            {/* Loading Overlay */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Buffering Indicator */}
            {isBuffering && !isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <CircularProgress size={40} />
                </Box>
            )}

            <Fade in={showControls}>
                <Paper
                    className="controls"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor:'transparent',
                        backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        p: 1,
                        transition: 'opacity 0.3s',
                    }}
                >
                    {/* Progress Bar Container */}
                    <Box sx={{ position: 'relative', height: 4, mb: 2 }}>
                        {/* Buffered Progress */}
                        {buffered.map((range, index) => (
                            <Box
                                key={index}
                                sx={{
                                    position: 'absolute',
                                    left: `${(range.start / duration) * 100}%`,
                                    top: 13,
                                    width: `${((range.end - range.start) / duration) * 100}%`,
                                    height: '90%',
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                    zIndex: 1
                                }}
                            />
                        ))}

                        {/*Interactive Question*/}
                        {questions.map((q, index) => (
                            <Tooltip
                                key={index}
                                title="Interactive Question"
                                placement="top"
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: `${(q.time / duration) * 100}%`,
                                        top: 13,
                                        width: 4,
                                        height: 4,
                                        bgcolor: answeredQuestions.has(q.time) ? 'success.main' : 'warning.main',
                                        zIndex: 3,
                                        transform: 'translateX(-50%)',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Tooltip>
                        ))}
                        {/* Playback Progress */}
                        <Slider
                            size="small"
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleTimeSeek}
                            sx={{
                                position: 'absolute',
                                color: 'primary.main',
                                height: 4,
                                width: '100%',
                                zIndex: 2,
                                '& .MuiSlider-thumb': {
                                    width: 8,
                                    height: 8,
                                    transition: '0.3s',
                                    '&:hover, &.Mui-focusVisible': {
                                        boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)'
                                    },
                                    '&:before': {
                                        display: 'none',
                                    },
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.28,
                                },
                            }}
                        />
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ px: 1, color: 'white' }}
                    >
                        {/* Play/Pause Button */}
                        <IconButton onClick={handlePlayPause} sx={{ color: 'inherit' }}>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>

                        {/* Volume Control */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
                            <IconButton onClick={handleMuteToggle} sx={{ color: 'inherit' }}>
                                {getVolumeIcon()}
                            </IconButton>
                            <Slider
                                size="small"
                                value={volume * 100}
                                onChange={handleVolumeChange}
                                sx={{
                                    width: 100,
                                    ml: 1,
                                    color: 'white',
                                    '& .MuiSlider-rail': { opacity: 0.28 },
                                }}
                            />
                        </Box>

                        {/* Time Display */}
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Typography>

                        {/* Playback Speed */}
                        <Tooltip title="Playback Speed">
                            <IconButton
                                onClick={handleSpeedMenuOpen}
                                sx={{ color: 'inherit' }}
                            >
                                <Speed />
                            </IconButton>
                        </Tooltip>

                        {/* Settings */}
                        <IconButton sx={{ color: 'inherit' }}>
                            <Settings />
                        </IconButton>

                        {/* Fullscreen Button */}
                        <IconButton
                            onClick={handleFullscreenToggle}
                            sx={{ color: 'inherit' }}
                        >
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                    </Stack>
                </Paper>
            </Fade>

            {/* Playback Speed Menu */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleSpeedMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Paper sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>
                    <Stack spacing={1}>
                        {speedOptions.map((speed) => (
                            <Box
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    cursor: 'pointer',
                                    bgcolor: playbackSpeed === speed ? 'primary.main' : 'transparent',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                            >
                                <Typography variant="body2">
                                    {speed}x
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Popover>
            {/* Interactive Question Dialog */}
            <Dialog
                open={openQuestionDialog}
                onClose={() => {}}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <QuestionAnswer /> Interactive Question
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {currentQuestion && (
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {currentQuestion.question}
                            </Typography>
                            <RadioGroup
                                value={selectedAnswer}
                                onChange={(e) => setSelectedAnswer(Number(e.target.value))}
                            >
                                {currentQuestion.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={index}
                                        control={<Radio />}
                                        label={option}
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            borderRadius: 1,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            }
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        startIcon={<QuestionAnswer />}
                    >
                        Submit Answer
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={Boolean(alert)}
                autoHideDuration={5000}
                onClose={() => setAlert('')}
            >
                <Alert
                    onClose={() => setAlert('')}
                    severity= {alert.includes('correct') ? 'success' : 'error'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Video;