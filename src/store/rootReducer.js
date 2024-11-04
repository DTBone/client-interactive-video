import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';
import paymentSlice from './slices/Payment/paymentSlice';
import accountSlice from './slices/Account/accountSlice';
import moduleSlice from './slices/Module/moduleSlice';

const rootReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
    payment: paymentSlice,
    account: accountSlice,
    module: moduleSlice,
});

export default rootReducer;