import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';
import paymentSlice from './slices/Payment/paymentSlice';
import accountSlice from './slices/Account/accountSlice';
import moduleSlice from './slices/Module/moduleSlice';

import moduleItemSlice from './slices/ModuleItem/moduleItemSlice';



const rootReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
    payment: paymentSlice,
    account: accountSlice,
    module: moduleSlice,
    moduleItem: moduleItemSlice,
});

export default rootReducer;