import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  LinearProgress,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tab,
  Tabs
} from '@mui/material';
import {
  PlayCircleOutline as VideoIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  BarChart as AnalyticsIcon,
  PersonOutline as UserIcon,
  GroupOutline as UsersIcon,
} from '@mui/icons-material';

// This component is used in instructor's statistical dashboard to display enhanced video analytics
const VideoAnalytics = ({ videoData, studentData }) => {
  const [tabValue, setTabValue] = useState(0);
  const [aggregatedData, setAggregatedData] = useState({
    segmentWatches: {
      "0-25": 0,
      "25-50": 0,
      "50-75": 0,
      "75-100": 0
    },
    averagePlaybackRate: 1,
    totalSessions: 0,
    totalInteractions: 0,
    deviceTypes: {},
    completionRate: 0,
    averageWatchTime: 0,
    engagementMetrics: {
      plays: 0,
      pauses: 0,
      seeks: 0
    }
  });

  useEffect(() => {
    if (Array.isArray(studentData) && studentData.length > 0) {
      // Aggregate data from multiple students
      const processed = studentData.reduce((acc, student) => {
        const analytics = student.progress?.progressVideo?.analytics || {};
        
        // Segment watch percentages
        if (analytics.segments) {
          Object.keys(analytics.segments).forEach(key => {
            acc.segmentWatches[key] = (acc.segmentWatches[key] || 0) + analytics.segments[key];
          });
        }
        
        // Playback rate
        if (analytics.averagePlaybackRate) {
          acc.playbackRates.push(analytics.averagePlaybackRate);
        }
        
        // Sessions
        if (analytics.sessions?.count) {
          acc.totalSessions += analytics.sessions.count;
        }
        
        // Interactions
        if (analytics.interactions?.total) {
          acc.totalInteractions += analytics.interactions.total;
        }
        
        // Device types
        if (analytics.device?.userAgent) {
          const deviceType = getDeviceType(analytics.device.userAgent);
          acc.deviceTypes[deviceType] = (acc.deviceTypes[deviceType] || 0) + 1;
        }
        
        // Completion
        if (student.progress?.progressVideo?.completionPercentage) {
          acc.totalCompletionPercentage += student.progress.progressVideo.completionPercentage;
          if (student.progress.progressVideo.completionPercentage >= 90) {
            acc.completedCount++;
          }
        }
        
        // Watch time
        if (student.progress?.progressVideo?.watchedDuration) {
          acc.totalWatchTime += student.progress.progressVideo.watchedDuration;
        }
        
        // Engagement metrics
        if (analytics.playbackEvents) {
          acc.engagementMetrics.plays += analytics.playbackEvents.plays || 0;
          acc.engagementMetrics.pauses += analytics.playbackEvents.pauses || 0;
          acc.engagementMetrics.seeks += analytics.playbackEvents.seeks || 0;
        }
        
        return acc;
      }, {
        segmentWatches: { "0-25": 0, "25-50": 0, "50-75": 0, "75-100": 0 },
        playbackRates: [],
        totalSessions: 0,
        totalInteractions: 0,
        deviceTypes: {},
        totalCompletionPercentage: 0,
        completedCount: 0,
        totalWatchTime: 0,
        engagementMetrics: { plays: 0, pauses: 0, seeks: 0 }
      });
      
      // Calculate averages
      const studentCount = studentData.length;
      
      // Average segment watches
      Object.keys(processed.segmentWatches).forEach(key => {
        processed.segmentWatches[key] = Math.round(processed.segmentWatches[key] / studentCount);
      });
      
      // Average playback rate
      const avgPlaybackRate = processed.playbackRates.length > 0
        ? processed.playbackRates.reduce((a, b) => a + b, 0) / processed.playbackRates.length
        : 1;
      
      // Completion rate
      const completionRate = (processed.completedCount / studentCount) * 100;
      
      // Average watch time
      const avgWatchTime = processed.totalWatchTime / studentCount;
      
      setAggregatedData({
        segmentWatches: processed.segmentWatches,
        averagePlaybackRate: avgPlaybackRate,
        totalSessions: processed.totalSessions,
        totalInteractions: processed.totalInteractions,
        deviceTypes: processed.deviceTypes,
        completionRate,
        averageWatchTime: avgWatchTime,
        engagementMetrics: processed.engagementMetrics
      });
    }
  }, [studentData]);

  const getDeviceType = (userAgent) => {
    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      return 'Mobile';
    } else if (userAgent.match(/tablet|iPad/i)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  };

  const formatTimeFromSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else {
      return `${mins}m ${secs}s`;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <VideoIcon sx={{ mr: 1 }} color="primary" /> 
        Enhanced Video Analytics
      </Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 1, borderRadius: 1 }}
      >
        <Tab label="Overview" icon={<AnalyticsIcon />} iconPosition="start" />
        <Tab label="Engagement" icon={<UsersIcon />} iconPosition="start" />
        <Tab label="Technical" icon={<DevicesIcon />} iconPosition="start" />
      </Tabs>
      
      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Completion Rate Card */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Completion Rate
                </Typography>
                <Typography variant="h4" color="primary">
                  {Math.round(aggregatedData.completionRate)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={aggregatedData.completionRate} 
                  sx={{ mt: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Percentage of students who completed at least 90% of the video
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Video Segment Watch Rates */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Segment Watch Rates
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {Object.entries(aggregatedData.segmentWatches).map(([key, value]) => (
                      <Grid item xs={12} key={key}>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{key}% of video</span>
                          <span>{value}% watched</span>
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={value} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 5,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: key === '0-25' ? '#42a5f5' :
                                      key === '25-50' ? '#26c6da' :
                                      key === '50-75' ? '#66bb6a' :
                                      '#ab47bc'
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Watch Time Card */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Average Watch Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" color="primary">
                    {formatTimeFromSeconds(aggregatedData.averageWatchTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    per student
                  </Typography>
                </Box>
                
                {videoData?.duration && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Video length: {formatTimeFromSeconds(videoData.duration)}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${Math.round((aggregatedData.averageWatchTime / videoData.duration) * 100)}%`}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Playback Speed Card */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Average Playback Speed
                </Typography>
                <Typography variant="h4" color="primary">
                  {aggregatedData.averagePlaybackRate.toFixed(2)}x
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {aggregatedData.averagePlaybackRate > 1 
                    ? "Students watch faster than normal speed"
                    : aggregatedData.averagePlaybackRate < 1 
                      ? "Students watch slower than normal speed"
                      : "Students watch at normal speed"
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Engagement Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Engagement Metrics Card */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Engagement Metrics
                </Typography>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Avg per Student</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Play Events</TableCell>
                        <TableCell align="right">{aggregatedData.engagementMetrics.plays}</TableCell>
                        <TableCell align="right">
                          {studentData?.length ? (aggregatedData.engagementMetrics.plays / studentData.length).toFixed(1) : '0'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pause Events</TableCell>
                        <TableCell align="right">{aggregatedData.engagementMetrics.pauses}</TableCell>
                        <TableCell align="right">
                          {studentData?.length ? (aggregatedData.engagementMetrics.pauses / studentData.length).toFixed(1) : '0'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Seek Events</TableCell>
                        <TableCell align="right">{aggregatedData.engagementMetrics.seeks}</TableCell>
                        <TableCell align="right">
                          {studentData?.length ? (aggregatedData.engagementMetrics.seeks / studentData.length).toFixed(1) : '0'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Higher pause and seek counts may indicate confusing content that requires review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* View Sessions Card */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Viewing Sessions
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" color="primary">
                    {aggregatedData.totalSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    total sessions
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Average sessions per student:
                  <Chip 
                    size="small" 
                    label={studentData?.length ? (aggregatedData.totalSessions / studentData.length).toFixed(1) : '0'}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {aggregatedData.totalSessions > studentData?.length 
                    ? "Students typically watch this video in multiple sessions"
                    : "Most students watch this video in a single session"
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Interaction Events Card */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Interaction Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color="primary">
                        {aggregatedData.totalInteractions}
                      </Typography>
                      <Typography variant="body2">Total Interactions</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color="primary">
                        {studentData?.length ? (aggregatedData.totalInteractions / studentData.length).toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="body2">Avg Interactions per Student</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color="primary">
                        {videoData?.duration ? (aggregatedData.totalInteractions / (videoData.duration / 60)).toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="body2">Interactions per Minute of Video</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Interactions include: play/pause, seeking, volume changes, playback speed changes, and fullscreen toggles
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Technical Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Device Distribution */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DevicesIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Device Distribution
                </Typography>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Device Type</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(aggregatedData.deviceTypes).map(([type, count]) => (
                        <TableRow key={type}>
                          <TableCell>{type}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                          <TableCell align="right">
                            {studentData?.length ? Math.round((count / studentData.length) * 100) : 0}%
                          </TableCell>
                        </TableRow>
                      ))}
                      {Object.keys(aggregatedData.deviceTypes).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">No device data available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Technical Info */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Video Technical Information
                </Typography>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Duration</TableCell>
                        <TableCell>{videoData?.duration ? formatTimeFromSeconds(videoData.duration) : 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>File Format</TableCell>
                        <TableCell>{videoData?.file ? videoData.file.split('.').pop().toUpperCase() : 'MP4'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interactive Questions</TableCell>
                        <TableCell>{videoData?.questions?.length || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Student Data Points</TableCell>
                        <TableCell>{studentData?.length || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recommendations */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                  Recommendations Based on Analytics
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {aggregatedData.segmentWatches['75-100'] < 70 && (
                    <Typography component="li" variant="body2">
                      The final quarter of the video has lower engagement. Consider shortening the video or adding more interactive elements toward the end.
                    </Typography>
                  )}
                  
                  {aggregatedData.engagementMetrics.seeks > (studentData?.length * 3) && (
                    <Typography component="li" variant="body2">
                      High number of seek events suggests students may be searching for specific information. Consider adding timestamps or breaking content into shorter videos.
                    </Typography>
                  )}
                  
                  {aggregatedData.averagePlaybackRate > 1.5 && (
                    <Typography component="li" variant="body2">
                      Students are watching at high playback speeds. Consider making your delivery more concise or increasing the pace.
                    </Typography>
                  )}
                  
                  {(Object.entries(aggregatedData.deviceTypes).find(([type]) => type === 'Mobile')?.[1] || 0) > 
                    (studentData?.length * 0.3) && (
                    <Typography component="li" variant="body2">
                      Significant mobile viewership detected. Ensure your video content is optimized for smaller screens.
                    </Typography>
                  )}
                  
                  {aggregatedData.completionRate < 60 && (
                    <Typography component="li" variant="body2">
                      Low completion rate. Consider reviewing the content for clarity and engagement, especially around points where students stop watching.
                    </Typography>
                  )}
                  
                  {/* Default recommendation if no specific issues */}
                  {(aggregatedData.segmentWatches['75-100'] >= 70 && 
                    aggregatedData.engagementMetrics.seeks <= (studentData?.length * 3) &&
                    aggregatedData.averagePlaybackRate <= 1.5 &&
                    aggregatedData.completionRate >= 60) && (
                    <Typography component="li" variant="body2">
                      Video performance metrics look good. Continue creating similar content that engages students effectively.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

VideoAnalytics.propTypes = {
  videoData: PropTypes.object,
  studentData: PropTypes.array
};

export default VideoAnalytics;
