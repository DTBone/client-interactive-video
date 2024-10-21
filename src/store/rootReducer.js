import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';

const rootReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
});

export default rootReducer;