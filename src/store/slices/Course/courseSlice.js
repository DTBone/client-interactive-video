import { approveCourse, createCourse, getAllCourse, getAllCoursebyUser, getCertificateByCourseId, getCourseByID, getCourseByInstructor, getGradeByCourseId, rejectCourse, updateCourse, uploadCertificate } from "./action";
import { createSlice } from '@reduxjs/toolkit';
const courseSlice = createSlice({
    name: 'course',
    initialState: {
        courses: [],
        currentCourse: null,
        loading: false,
        error: null,
        certificate: null,
        courseGrade: [],
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
                state.courses = action.payload.data;
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
                state.currentCourse = action.payload.data;
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
            .addCase(approveCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course.id === action.payload.id);
                if (index !== -1) {
                    console.log('course', action.payload);
                    state.courses[index] = action.payload;
                }
            })
            .addCase(approveCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(rejectCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course._id === action.payload.data._id);
                if (index !== -1) {
                    state.courses[index] = action.payload.data;
                }
            })
            .addCase(rejectCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
            .addCase(getCertificateByCourseId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCertificateByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.certificate = action.payload;
            })
            .addCase(getCertificateByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllCoursebyUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCoursebyUser.fulfilled, (state, action) => {
                state.loading = false;
                if (JSON.stringify(state.courses) !== JSON.stringify(action.payload.data)) {
                    state.courses = action.payload.data;
                }
            })
            .addCase(getAllCoursebyUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getGradeByCourseId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGradeByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.courseGrade = action.payload.data;
            })
            .addCase(getGradeByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload Certificate
            .addCase(uploadCertificate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadCertificate.fulfilled, (state, action) => {
                state.loading = false;
                // Có thể cập nhật certificate state nếu cần
                if (action.payload) {
                    state.certificate = action.payload;
                }
                state.error = null;
            })
            .addCase(uploadCertificate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearCurrentCourse, clearError } = courseSlice.actions;

export default courseSlice.reducer;