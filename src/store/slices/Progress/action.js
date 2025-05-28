import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../Config/api';
import axiosInstance from '~/Config/axiosInstance';


export const updateLectureProgress = createAsyncThunk(
    'progress/updateLectureProgress',
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
            const analyticsPayload = analyticsSummary ? analyticsSummary : (viewingSessions ? {
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
                device: deviceInfo || {},
                averagePlaybackRate: averagePlaybackRate || 1,
                engagementScore: engagementScore || 0,
                watchedSegmentCount: watchedSegments?.length || 0,
                attention: attentionMetrics ? {
                    tabSwitches: attentionMetrics.tabSwitches || 0,
                    focusLosses: attentionMetrics.focusLosses || 0
                } : undefined,
                engagement: engagementHotspots ? {
                    hotspots: Object.entries(engagementHotspots)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5) // Top 5 hotspots
                        .map(([time, count]) => ({
                            time: time.replace('t_', ''),
                            count
                        }))
                } : undefined
            } : undefined);

            // Include device and browser information to help debug playback issues
            const deviceAnalytics = deviceInfo ? {
                screenSize: deviceInfo.screenSize,
                deviceType: deviceInfo.deviceType,
                browser: deviceInfo.browserInfo?.name,
                browserVersion: deviceInfo.browserInfo?.version,
                connectionType: deviceInfo.connectionType,
                timeZone: deviceInfo.timeZone
            } : undefined;

            // Core progress data or full data object if not enhanced
            const progressPayload = viewingSessions ? {
                watchedDuration,
                totalDuration,
                lastPosition,
                completionPercentage,
                notes,
                videoId: data.progressVideo.videoId,
                analytics: analyticsPayload,
                device: deviceAnalytics,
                sentAt: Date.now()
            } : data.progressVideo;

            const res = await api.put(`/progress/${data.progressId}/video`, {
                progressVideo: progressPayload
            });
            
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);

export const updateSupplementProgress = createAsyncThunk(
    'progress/updateSupplementProgress',
    async (data, { rejectWithValue }) => {
        try {
            console.log('data', data);
            const res = await api.put(`/progress/${data.progressId}/supplement`, {
                progressSupplement: data.progressSupplement

            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update supplement progress failed');
        }
    }
);


export const updateProgrammingProgress = createAsyncThunk(
    'programming/updateProgrammingProgress',
    async ({ moduleItemId, moduleId, data }, { rejectWithValue }) => {
        try {
            //console.log('data programming', data, moduleItemId, moduleId);
            const res = await axiosInstance.put(`/progress/${moduleItemId}/programming`, {
                progressProgramming: data,
                moduleId: moduleId,
                moduleItemId: moduleItemId
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update lecture progress failed');
        }
    }
);


export const getProgrammingProgressByProblemId = createAsyncThunk(
    'programming/getProgrammingProgressByProblemId',
    async ({ problemId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/progress/${problemId}/programming`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get programming progress failed');
        }
    }
)

// export const getProgress = createAsyncThunk(
//     'progress/getProgress',
//     async (courseId, { rejectWithValue }) => {
//         try {
//             console.log('courseId action', courseId);
//             if(!courseId) {
//                 return rejectWithValue('Course ID is required');
//             }
//             //console.log('courseId', courseId);
//             const res = await api.get(`/progress`, {
//                 params: {
//                     courseId: String(courseId)
//                 }
//             });
//             return res.data;
//         } catch (error) {
//             return rejectWithValue(error || 'Get progress failed');
//         }
//     }
// );
export const getProgress = createAsyncThunk(
    'progress/getProgress',
    async (courseInput, { rejectWithValue }) => {
        try {
            // Chuẩn hóa courseId
            const courseId =
                typeof courseInput === 'object' && courseInput !== null
                    ? courseInput.courseId
                    : courseInput;

            console.log('Normalized courseId:', courseId);

            if (!courseId) {
                return rejectWithValue('Course ID is required');
            }

            const res = await api.get(`/progress`, {
                params: {
                    courseId: String(courseId)
                }
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Get progress failed');
        }
    }
);

export const getGradeProgress = createAsyncThunk(
    'progress/getGradeProgress',
    async ({ courseId, ids = [] }, { rejectWithValue }) => {
        try {
            console.log('ids', ids);
            const res = await axiosInstance.get(`/progress/${courseId}/grade`, {
                params: {
                    ids
                }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

// export const getCheckProgress = createAsyncThunk(
//     'progress/getCheckProgress',
//     async ({ courseId }, { rejectWithValue }) => {
//         try {
//             const res = await axiosInstance.get(`/progress/${courseId}`);
//             return res.data;
//         } catch (error) {
//             return rejectWithValue(error || 'Get progress failed');
//         }
//     }
// )


export const sendProgressToServer = createAsyncThunk(
    'progress/sendProgressToServer',
    async (moduleItemId, progressData ,{ rejectWithValue }) => {
        
        console.log('progressData', progressData);
        try {
            const res = await axiosInstance.post(`/progress/moduleItem/${moduleItemId}`, {
                params:{
                    progressData: progressData,
                    moduleItemId: moduleItemId
                }
            });
            return res.data;            
        } catch (error) {
            return rejectWithValue(error.response.data || 'Send progress failed');
        }
    }
);

export const getModuleItemProgress = createAsyncThunk(
    'progress/getModuleItemProgress',
    async ({ moduleItemId }, { rejectWithValue }) => {
        console.log('moduleItemId', moduleItemId);
        try {
            const res = await api.get(`/progress/moduleItem/${moduleItemId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

export const getModuleProgress = createAsyncThunk(
    'progress/getModuleProgress',
    async ({ moduleId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/progress/module/${moduleId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get progress failed');
        }
    }
);

