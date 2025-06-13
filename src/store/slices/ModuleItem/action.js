import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';

export const createModuleItemSupplement = createAsyncThunk(
    'module/moduleItem/addNewSupplement',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {

            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post(
                `/learns/${courseId}/modules/${moduleId}/supplement`,
                formData,
                config
            );
            //console.log('Response data:', data);
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemLecture = createAsyncThunk(
    'module/moduleItem/addNewLecture',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {
            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post(
                `/learns/${courseId}/modules/${moduleId}/lecture`,
                formData,
                config
            );
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemQuiz = createAsyncThunk(
    'module/moduleItem/addNewQuiz',
    async ({ courseId, moduleId, quizData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/learns/${courseId}/modules/${moduleId}/quiz`, quizData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const createModuleItemProgramming = createAsyncThunk(
    'module/moduleItem/addNewProgramming',
    async ({ courseId, moduleId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/learns/${courseId}/modules/${moduleId}/programming`, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getModuleItemById = createAsyncThunk(
    'module/moduleItem/getModuleItemById',
    async ({ moduleItemId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/learns/moduleitem/${moduleItemId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const editSupplementByItemId = createAsyncThunk(
    'module/moduleItem/editSupplement',
    async ({ itemId, formData }, { rejectWithValue }) => {
        try {

            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.put(
                `/moduleitem/supplement/${itemId}`,
                formData,
                config
            );
            //console.log('Response data:', data);
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)
export const editLectureByItemId = createAsyncThunk(
    'module/moduleItem/editLecture',
    async ({ itemId, formData }, { rejectWithValue }) => {
        try {
            if (!(formData instanceof FormData)) {
                throw new Error('Invalid form data');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.put(
                `/moduleitem/lecture/${itemId}`,
                formData,
                config
            );
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
)

export const editQuizByItemId = createAsyncThunk(
    'module/moduleItem/editQuiz',
    async ({ itemId, quizData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/moduleitem/quiz/${itemId}`, quizData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
export const editProgrammingByItemId = createAsyncThunk(
    'module/moduleItem/editProgramming',
    async ({ itemId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/moduleitem/programming/${itemId}`, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const preloadInteractiveQuestion = createAsyncThunk(
    'module/moduleItem/preloadInteractiveQuestion',
    async ({ moduleItemId, videoId }, { rejectWithValue }) => {

        console.log('videoId', videoId)
        console.log('moduleItemId', moduleItemId)

        try {
            const { data } = await api.post(`/moduleitem/lecture/${videoId}/interactive`,
                
                {
                    params: { videoId }
                });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateInteractiveQuestion = createAsyncThunk(
    'progress/updateInteractiveQuestion',
    async ({ moduleItemId, currentQuestion, selectedAnswer, status, videoId }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/moduleitem/lecture/${moduleItemId}/interactive/${currentQuestion._id}`, {
                currentQuestion,
                selectedAnswer,
                status,
                videoId
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Update interactive question failed');
        }
    }
);