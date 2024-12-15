import { createSlice } from '@reduxjs/toolkit';
import { getStudentEnrollCourse } from './action';

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        students: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearStudent: (state) => {
            state.students = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudentEnrollCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentEnrollCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(getStudentEnrollCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearStudent, clearError } = studentSlice.actions;
export default studentSlice.reducer;