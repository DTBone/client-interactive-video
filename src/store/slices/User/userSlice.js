import { createSlice } from '@reduxjs/toolkit';
import { getAllCourseByUser, getAllUsers } from './action';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        refresh: false,
        users: [],

    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        toggleRefresh: (state) => {
            state.refresh = !state.refresh;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllCourseByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCourseByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllCourseByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;