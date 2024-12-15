import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
import axiosInstance from '~/Config/axiosInstance';

export const getStudentEnrollCourse = createAsyncThunk(
    'studentEnrollCourse/getStudentEnrollCourse',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            console.log('courseId', courseId);
            const { data } = await axiosInstance.get("/student/enroll-courses", { params: { courseId } });
            return data.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)