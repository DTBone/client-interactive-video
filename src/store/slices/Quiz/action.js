import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getQuizById = createAsyncThunk(
    'quiz/getQuizById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await api.get(`/quizzes/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);
export const getLectureById = createAsyncThunk(
    'quiz/getLectureById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await api.get(`/videos/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);

export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(`/quizzes/${data.quizId}/answer`, {
                answers: data.answers,
                timeSpent: parseInt(data.timeSpent)
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Submit quiz failed');
        }
    }
);

export const updateLectureProgress = createAsyncThunk(
    'quiz/updateLectureProgress',
    async (data, { rejectWithValue }) => {
        try {
            // Extract enhanced analytics data for API
            const { 
                progressVideo: {
                    watchedDuration,
                    totalDuration,
                    lastPosition,
                    completionPercentage,
                    notes,
                    viewingSessions,
                    playbackEvents,
                    interactionPoints,
                    deviceInfo,
                    watchPercent,
                    averagePlaybackRate,
                    engagementScore,
                    watchedSegments,
                    attentionMetrics,
                    engagementHotspots,
                    analyticsSummary
                } = {}
            } = data;

            // If using pre-processed analytics summary, use it directly
            // Otherwise create one from detailed data
            const analyticsPayload = analyticsSummary ? analyticsSummary : {
                sessions: {
                    count: viewingSessions?.length || 0,
                    totalDuration: viewingSessions?.reduce((acc, session) => acc + session.duration, 0) || 0,
                    lastSessionStart: viewingSessions?.length > 0 ? viewingSessions[viewingSessions.length - 1].startTime : null
                },
                interactions: {
                    total: interactionPoints?.length || 0,
                    byType: interactionPoints?.reduce((acc, point) => {
                        acc[point.type] = (acc[point.type] || 0) + 1;
                        return acc;
                    }, {}) || {}
                },
                playbackEvents: {
                    plays: playbackEvents?.filter(e => e.type === 'play').length || 0,
                    pauses: playbackEvents?.filter(e => e.type === 'pause').length || 0,
                    seeks: playbackEvents?.filter(e => e.type === 'seek').length || 0,
                    lastEvent: playbackEvents?.length > 0 ? 
                        playbackEvents[playbackEvents.length - 1].type : null
                },
                segments: watchPercent || {},
                engagementScore: engagementScore || 0,
                watchedSegmentCount: watchedSegments?.length || 0,
                attention: attentionMetrics ? {
                    tabSwitches: attentionMetrics.tabSwitches || 0,
                    focusLosses: attentionMetrics.focusLosses || 0
                } : undefined,
                engagement: engagementHotspots ? {
                    hotspots: Object.entries(engagementHotspots || {})
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5) // Top 5 hotspots
                        .map(([time, count]) => ({
                            time: time.replace('t_', ''),
                            count
                        }))
                } : undefined
            };

            // Include device and browser information to help debug playback issues
            const deviceAnalytics = deviceInfo ? {
                screenSize: deviceInfo.screenSize,
                deviceType: deviceInfo.deviceType,
                browser: deviceInfo.browserInfo?.name,
                browserVersion: deviceInfo.browserInfo?.version,
                connectionType: deviceInfo.connectionType,
                timeZone: deviceInfo.timeZone
            } : undefined;

            // Core progress data (what we originally had)
            const coreProgressData = {
                watchedDuration,
                totalDuration,
                lastPosition,
                completionPercentage,
                notes,
                videoId: data.progressVideo.videoId
            };

            // Send the optimized payload with analytics
            const progressPayload = {
                ...coreProgressData,
                analytics: analyticsPayload,
                device: deviceAnalytics,
                sentAt: Date.now()
            };

            const res = await api.put(`/progress/${data.progressId}/video`, {
                progressVideo: progressPayload
            });
            
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);


