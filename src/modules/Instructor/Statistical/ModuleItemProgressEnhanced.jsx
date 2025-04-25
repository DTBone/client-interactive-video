import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Chip,
    Avatar,
    Box,
    Typography,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    Grid,
    Divider,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as NotStartedIcon,
    ExpandMore as ExpandMoreIcon,
    Quiz as QuizIcon,
    Code as CodeIcon,
    PlayCircleOutline as VideoIcon,
    MenuBook as ReadingIcon,
    AccessTime as TimeIcon,
    Timeline as TimelineIcon,
    Loop as AttemptsIcon,
    DateRange as DateIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';

const ModuleItemProgressEnhanced = ({ item }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getModuleItemById(item.moduleItemId));
            } catch (error) {
                console.error('Error fetching module item:', error);
            }
        };
        fetchData();
    }, [item, dispatch]);

    const { currentItem } = useSelector((state) => state.moduleItem);
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'not-started': return 'default';
            case 'in-progress': return 'warning';
            default: return 'default';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'completed': return 'rgba(46, 125, 50, 0.1)';
            case 'not-started': return 'rgba(97, 97, 97, 0.1)';
            case 'in-progress': return 'rgba(237, 108, 2, 0.1)';
            default: return 'rgba(97, 97, 97, 0.1)';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'code': return <CodeIcon fontSize="small" />;
            case 'quiz': return <QuizIcon fontSize="small" />;
            case 'video': return <VideoIcon fontSize="small" />;
            case 'reading': return <ReadingIcon fontSize="small" />;
            default: return <ReadingIcon fontSize="small" />;
        }
    };
    
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Not available';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };
    
    const calculateTimeSpent = (timeSpentMinutes) => {
        if (!timeSpentMinutes) return '0 minutes';
        if (timeSpentMinutes < 60) return `${timeSpentMinutes} minutes`;
        const hours = Math.floor(timeSpentMinutes / 60);
        const minutes = timeSpentMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const renderProgressMetrics = () => {
        return (
            <Box sx={{ mb: 2, mt: 1 }}>
                <Grid container spacing={3}>
                    {/* Time Spent Metric */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined" sx={{ 
                            bgcolor: 'rgba(25, 118, 210, 0.05)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TimeIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary">Time Spent</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                    {calculateTimeSpent(item.timeSpent)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Completion Status */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined" sx={{ 
                            bgcolor: getStatusBgColor(item.status),
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {item.status === 'completed' ? 
                                        <CompletedIcon color="success" sx={{ mr: 1 }} /> : 
                                        item.status === 'in-progress' ? 
                                            <TimelineIcon color="warning" sx={{ mr: 1 }} /> :
                                            <NotStartedIcon color="action" sx={{ mr: 1 }} />
                                    }
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
                                    {item.status.replace('-', ' ')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Attempts */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined" sx={{ 
                            bgcolor: 'rgba(156, 39, 176, 0.05)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AttemptsIcon color="secondary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary">Attempts</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                    {item.attempts || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Completion Percentage */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined" sx={{ 
                            bgcolor: 'rgba(46, 125, 50, 0.05)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box position="relative" display="inline-flex">
                                        <CircularProgress 
                                            variant="determinate" 
                                            value={item.completionPercentage || 0} 
                                            size={24} 
                                            thickness={5} 
                                            color="success" 
                                            sx={{ mr: 1 }}
                                        />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="caption" component="div" color="text.secondary">
                                                {`${Math.round(item.completionPercentage || 0)}%`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="subtitle2" color="text.secondary">Progress</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={item.completionPercentage || 0} 
                                            color="success"
                                            sx={{ height: 6, borderRadius: 3 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(item.completionPercentage || 0)}%`}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const renderQuizDetails = (quizData) => {
        if (!quizData || !quizData.answers) return null;
        
        const totalQuestions = quizData.answers.length;
        const correctAnswers = quizData.answers.filter(answer => answer.isCorrect).length;
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        return (
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <QuizIcon sx={{ mr: 1 }} color="primary" /> Quiz Results
                </Typography>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Score Summary
                                </Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={score}
                                        size={80}
                                        thickness={5}
                                        color={score >= 70 ? "success" : score >= 40 ? "warning" : "error"}
                                    />
                                    <Box
                                        sx={{
                                            top: 0, left: 0, bottom: 0, right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                            {`${score}%`}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Questions
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {totalQuestions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Correct Answers
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                            {correctAnswers}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Performance Metrics
                                </Typography>
                                
                                <Box sx={{ mb: 1.5 }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                                        Time Spent: {quizData.timeSpent || 0} minutes
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <AttemptsIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                                        Attempts: {item.attempts || 1}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DateIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                                        Submitted: {formatDateTime(item.updatedAt)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const renderProgrammingDetails = (programmingData) => {
        if (!programmingData) return null;
        
        const totalTestCases = programmingData.totalTestCases || 0;
        const passedTestCases = programmingData.testCasesPassed || 0;
        const score = programmingData.score || 0;
        
        return (
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CodeIcon sx={{ mr: 1 }} color="primary" /> Programming Assignment
                </Typography>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Test Results
                                </Typography>
                                
                                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={totalTestCases > 0 ? (passedTestCases / totalTestCases) * 100 : 0}
                                        size={80}
                                        thickness={5}
                                        color={passedTestCases === totalTestCases ? "success" : "warning"}
                                    />
                                    <Box
                                        sx={{
                                            top: 0, left: 0, bottom: 0, right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
                                            {passedTestCases}/{totalTestCases}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Score
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {score}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Language
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {programmingData.language || 'Not specified'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Memory Used
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {programmingData.memory || 'N/A'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={7}>
                        {programmingData.code && (
                            <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Submitted Code
                                    </Typography>
                                    <Box sx={{ 
                                        maxHeight: '240px', 
                                        overflow: 'auto', 
                                        bgcolor: 'rgba(0, 0, 0, 0.03)',
                                        borderRadius: 1,
                                        p: 1
                                    }}>
                                        <pre style={{ 
                                            margin: 0, 
                                            fontSize: '0.75rem', 
                                            fontFamily: 'monospace' 
                                        }}>
                                            {programmingData.code}
                                        </pre>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const renderVideoDetails = (videoData) => {
        if (!videoData) return null;
        
        const notesCount = videoData.notes?.length || 0;
        
        return (
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <VideoIcon sx={{ mr: 1 }} color="primary" /> Video Progress
                </Typography>
                
                <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Watch Time
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                                    {calculateTimeSpent(item.timeSpent)}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary">
                                    Completion
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={item.completionPercentage || 0} 
                                            sx={{ height: 8, borderRadius: 5 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.primary">
                                        {item.completionPercentage || 0}%
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Notes Taken
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                    {notesCount} notes
                                </Typography>
                                
                                {notesCount > 0 && (
                                    <Box sx={{ 
                                        maxHeight: '120px', 
                                        overflow: 'auto', 
                                        bgcolor: 'rgba(0, 0, 0, 0.03)',
                                        borderRadius: 1,
                                        p: 1
                                    }}>
                                        {videoData.notes.map((note, index) => (
                                            <Box key={index} sx={{ mb: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {note.timestamp ? `${Math.floor(note.timestamp / 60)}:${String(note.timestamp % 60).padStart(2, '0')}` : 'No timestamp'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {note.text}
                                                </Typography>
                                                <Divider sx={{ mt: 1 }} />
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        );
    };

    const renderReadingDetails = (readingData) => {
        if (!readingData) return null;
        
        return (
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ReadingIcon sx={{ mr: 1 }} color="primary" /> Reading Material
                </Typography>
                
                <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Reading Status
                                </Typography>
                                <Chip 
                                    label={readingData.status?.replace('-', ' ').toUpperCase() || 'Not Started'} 
                                    color={getStatusColor(readingData.status)}
                                    size="small"
                                    sx={{ mt: 1, textTransform: 'capitalize' }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Time Spent Reading
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>
                                    {calculateTimeSpent(item.timeSpent)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        );
    };

    const renderItemDetails = () => {
        if (item.result?.quiz) {
            return renderQuizDetails(item.result.quiz);
        }

        if (item.result?.programming) {
            return renderProgrammingDetails(item.result.programming);
        }

        if (item.result?.video) {
            return renderVideoDetails(item.result.video);
        }

        if (item.result?.reading) {
            return renderReadingDetails(item.result.reading);
        }

        // Default: basic progress info
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No detailed results available for this item.
                </Typography>
            </Box>
        );
    };

    return (
        <Accordion 
            sx={{ 
                mb: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                borderRadius: '8px !important',
                '&:before': { display: 'none' }, // Remove the default divider
                overflow: 'hidden'
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                    bgcolor: getStatusBgColor(item.status),
                    '&:hover': { bgcolor: getStatusBgColor(item.status) },
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                }}
            >
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={1}>
                        <Tooltip title={currentItem?.data?.type || 'Unknown Type'}>
                            <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: 'primary.main',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {getIcon(currentItem?.data?.type)}
                            </Avatar>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={9} sm={8}>
                        <Typography variant="body1" fontWeight={500}>
                            {currentItem?.data?.title || 'Unknown Item'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Last activity: {formatDateTime(item.updatedAt)}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip
                            label={item.status.replace('-', ' ')}
                            size="small"
                            color={getStatusColor(item.status)}
                            sx={{ textTransform: 'capitalize' }}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            
            <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper' }}>
                {renderProgressMetrics()}
                <Divider sx={{ my: 2 }} />
                {renderItemDetails()}
            </AccordionDetails>
        </Accordion>
    );
};

ModuleItemProgressEnhanced.propTypes = {
    item: PropTypes.shape({
        moduleItemId: PropTypes.string,
        status: PropTypes.string,
        completionPercentage: PropTypes.number,
        timeSpent: PropTypes.number,
        attempts: PropTypes.number,
        updatedAt: PropTypes.string,
        startedAt: PropTypes.string,
        completedAt: PropTypes.string,
        result: PropTypes.shape({
            quiz: PropTypes.object,
            programming: PropTypes.object,
            video: PropTypes.object,
            reading: PropTypes.object
        })
    }).isRequired
};

export default ModuleItemProgressEnhanced;
