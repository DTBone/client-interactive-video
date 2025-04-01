import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '~/Config/axiosInstance';

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

            const { data } = await axiosInstance.post(
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
            const { data } = await axiosInstance.post(
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
            const { data } = await axiosInstance.post(`/learns/${courseId}/modules/${moduleId}/quiz`, quizData);
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
            const { data } = await axiosInstance.post(`/learns/${courseId}/modules/${moduleId}/programming`, formData);
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
            const { data } = await axiosInstance.get(`/learns/moduleitem/${moduleItemId}`);
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

            const { data } = await axiosInstance.put(
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
            const { data } = await axiosInstance.put(
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
            const { data } = await axiosInstance.put(`/moduleitem/quiz/${itemId}`, quizData);
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
            const { data } = await axiosInstance.put(`/moduleitem/programming/${itemId}`, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const createNewInteractiveQuestion = createAsyncThunk(
    'module/moduleItem/createNewQuestionInteractive',
    async ({ moduleItemId, currentQuestion, videoId, selectedAnswer }, { rejectWithValue }) => {
        console.log('questionData', currentQuestion)
        console.log('videoId', videoId)
        console.log('moduleItemId', moduleItemId)
        console.log('selectedAnswer', selectedAnswer)
        try {
            const { data } = await axiosInstance.post(`/moduleitem/lecture/${moduleItemId}/interactive`,
                currentQuestion,
                {
                    params: { videoId, selectedAnswer }
                });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
