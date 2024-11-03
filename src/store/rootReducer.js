import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';
import moduleSlice from './slices/Module/moduleSlice';
const rootReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
    module: moduleSlice,
});

export default rootReducer;