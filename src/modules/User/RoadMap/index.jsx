/* eslint-disable react/prop-types */
import '~/index.css';
import RoadmapForm from "~/modules/User/RoadMap/RoadMapForm/index.jsx";
import RoadMapDisplay from "~/modules/User/RoadMap/RoadMapDisplay/index.jsx";
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch} from "react-redux";
import {createRoadMap, getRoadMap} from "~/store/slices/Roadmap/action.js";
import {
  Box, Typography, Paper, Chip, Grid, Card, CardContent,
  CardActionArea, Collapse, IconButton, Tooltip, Badge
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Close } from '@mui/icons-material';

const RoadMap = ({user = {}}) => {
    const dispatch = useDispatch();
    const [roadmap, setRoadmap] = useState(null);
    const [roadmapList, setRoadmapList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showRoadmapList, setShowRoadmapList] = useState(false);
    const [showNewRoadmapForm, setShowNewRoadmapForm] = useState(false);

    const callRoadMap = useCallback(async (userId) => {
        setIsLoading(true);
        try {
            const result = await dispatch(getRoadMap(userId));
            if(result.payload.success) {
                setRoadmapList(result.payload.data);
                setRoadmap(result.payload.data[0]);
            }
        } catch (error) {
            console.error("Error loading roadmap:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);
    const loadSpecificRoadmap = useCallback((roadmapId) => {
        setRoadmap(roadmapList.find(map => map._id === roadmapId));
        setShowRoadmapList(false);
    }, [roadmapList]);
    useEffect(() => {
        if(user?._id) {
            callRoadMap(user._id);
        }
    }, [user, callRoadMap]);

    const refreshRoadmap = () => {
        if(user?._id) {
            callRoadMap(user._id);
        }
    }

    const handleSubmit = useCallback(async (formData) => {
        setIsLoading(true);
        try {
            const result = await dispatch(createRoadMap(formData));
            if(result.payload.success) {
                setRoadmap(result.payload.data);
                setRoadmapList(prev => [...prev, result.payload.data]);
                setShowNewRoadmapForm(false);
            }
        } catch (error) {
            console.error("Error submitting roadmap:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);
    const countCompleted = useCallback((phases) => {
        if(!phases?.length) return 1;
        const count = phases.reduce((acc, phase) =>
            phase.status === 'completed' || phase.status === 'in-progress' ? acc + 1 : acc, 0);
        return count || 1;
    }, []);

    const getStatusCounts = useCallback((phases) => {
        if (!phases) return { completed: 0, inProgress: 0, pending: 0 };
        return phases.reduce((counts, phase) => {
            if (phase.status === 'completed') counts.completed++;
            else if (phase.status === 'in-progress') counts.inProgress++;
            else counts.pending++;
            return counts;
            counts[phase.status === 'completed' ? 'completed' :
                   phase.status === 'in-progress' ? 'inProgress' : 'pending']++;
            return counts;
        }, { completed: 0, inProgress: 0, pending: 0 });
    }, []);

    const toggleRoadmapList = useCallback(() => {
        setShowRoadmapList(prev => !prev);
        setShowNewRoadmapForm(false);
    }, []);

    const toggleNewRoadmapForm = useCallback(() => {
        setShowNewRoadmapForm(prev => !prev);
        setShowRoadmapList(false);
    }, []);

    const renderRoadmapCard = useCallback((map, index) => {
                            const statusCounts = getStatusCounts(map.phases);
                            const progress = map.progress || 0;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={map._id}>
                <Card sx={{
                                            height: '100%',
                                            borderRadius: 0,
                                            borderBottom: index < roadmapList.length - 1 ? '1px solid #eee' : 'none',
                                            boxShadow: 'none',
                                            transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#f5f9ff' }
                                            }}>
                    <CardActionArea
                        onClick={() => loadSpecificRoadmap(map._id)}
                                                    sx={{
                                                        height: '100%',
                            p: 2,
                        display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                    }}
                >
                        {/* Card Content */}
                <Box sx={{ width: '100%' }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FlagIcon color="primary" sx={{ mr: 1, opacity: roadmap?._id === map._id ? 1 : 0.6 }} />
                                <Typography variant="h6" noWrap sx={{
                                    fontWeight: roadmap?._id === map._id ? 'bold' : 'normal',
                                    color: roadmap?._id === map._id ? '#1976d2' : 'inherit',
                                    flexGrow: 1
                                }}>
                                    {map.title || `Roadmap ${index + 1}`}
                    </Typography>
                            </Box>
                            {/* Status Chips */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {Object.entries(statusCounts).map(([status, count]) => (
                                    <Badge key={status} badgeContent={count} color={
                                        status === 'completed' ? 'success' :
                                        status === 'inProgress' ? 'warning' : 'default'
                                    }>
                                        <Chip
                                            size="small"
                                            icon={status === 'completed' ? <CheckCircleIcon /> :
                                                  status === 'inProgress' ? <AccessTimeIcon /> : null}
                                            label={status === 'completed' ? 'Completed' :
                                                  status === 'inProgress' ? 'In Progress' : 'Not Started'}
                                            sx={{ opacity: count > 0 ? 1 : 0.6 }}
                                        />
                                    </Badge>
                                ))}
                            </Box>

                            {/* Progress Bar */}
                            <Box sx={{
                                height: 4,
                                bgcolor: '#eee',
                                width: '100%',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    bgcolor: progress >= 100 ? '#4caf50' : '#1976d2',
                                    transition: 'width 0.5s ease'
                                }} />
        </Box>

                            <Typography variant="caption" align="right" sx={{
                                display: 'block',
                                mt: 1,
                                fontWeight: 'medium'
                            }}>
                                {progress}% Complete
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
    );
    }, [loadSpecificRoadmap, getStatusCounts, roadmap]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
            p: 2
        }}>
            {/* Header */}
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {roadmap?.title || 'My Roadmaps'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {roadmapList.length > 0 && (
                        <Tooltip title={showRoadmapList ? "Hide roadmap list" : "Show all roadmaps"}>
                            <IconButton
                                color="primary"
                                onClick={toggleRoadmapList}
                                sx={{ border: '1px solid #e0e0e0' }}
                            >
                                {showRoadmapList ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Create new roadmap">
                        <IconButton
                            color="primary"
                            onClick={toggleNewRoadmapForm}
                            sx={{ border: '1px solid #e0e0e0' }}
                        >
                            {showNewRoadmapForm ? <Close /> : <AddIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Roadmap List */}
            <Collapse in={showRoadmapList} sx={{ width: '100%', mb: 3 }}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Grid container spacing={0}>
                        {roadmapList.map(renderRoadmapCard)}
                    </Grid>
                </Paper>
            </Collapse>

            {/* Form and Display */}
            <Collapse in={showNewRoadmapForm} sx={{ width: '100%', mb: 3 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2
                    ,display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%'
                 }}>
                    <RoadmapForm onGenerateRoadmap={handleSubmit} isLoading={isLoading}/>
                </Paper>
            </Collapse>

            {roadmap && !showNewRoadmapForm && (
                <Box sx={{ width: '100%' }}>
                    <RoadMapDisplay
                        data={roadmap}
                        setRoadmapOutSide={setRoadmap}
                        userProgress={countCompleted(roadmap.phases)}
                        refreshRoadmap={refreshRoadmap}
                    />
                </Box>
            )}

            {user?._id && !roadmap && !showNewRoadmapForm && (
                <Box sx={{
                    textAlign: 'center',
                    p: 5,
                    border: '2px dashed #e0e0e0',
                    borderRadius: 2,
                    width: '100%'
                }}>
                    <Typography variant="h6" gutterBottom>No Roadmaps Yet</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first roadmap to start planning your journey
                    </Typography>
                    <IconButton
                        color="primary"
                        onClick={toggleNewRoadmapForm}
                        sx={{ border: '1px solid #1976d2', p: 1.5 }}
                    >
                        <AddIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};
export default React.memo(RoadMap);