import { createCourse, getAllCourse, getCourseByID, getCourseByInstructor, updateCourse } from "./action";
import { createSlice } from '@reduxjs/toolkit';
const courseSlice = createSlice({
    name: 'course',
    initialState: {
        courses: [],
        currentCourse: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getAllCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCourseByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCourseByID.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
                state.error = null;
            })
            .addCase(getCourseByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.push(action.payload);
                state.error = null;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get course by instructor
            .addCase(getCourseByInstructor.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCourseByInstructor.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.data;
            })
            .addCase(getCourseByInstructor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});
export const { clearCurrentCourse, clearError } = courseSlice.actions;

export default courseSlice.reducer;