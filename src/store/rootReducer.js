import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';
import paymentSlice from './slices/Payment/paymentSlice';
import accountSlice from './slices/Account/accountSlice';
import moduleSlice from './slices/Module/moduleSlice';
import progressSlice from './slices/Progress/progressSlice';
import moduleItemSlice from './slices/ModuleItem/moduleItemSlice';
import compileSlice from './slices/Compile/compileSlice';


const rootReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
    payment: paymentSlice,
    account: accountSlice,
    module: moduleSlice,
    moduleItem: moduleItemSlice,
    progress: progressSlice,
    compile: compileSlice,
});

export default rootReducer;