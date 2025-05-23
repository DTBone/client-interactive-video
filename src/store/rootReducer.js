import { combineReducers } from '@reduxjs/toolkit';
import courseSlice from './slices/Course/courseSlice';
import authSlice from './slices/Auth/authSlice';
import paymentSlice from './slices/Payment/paymentSlice';
import accountSlice from './slices/Account/accountSlice';
import moduleSlice from './slices/Module/moduleSlice';
import progressSlice from './slices/Progress/progressSlice';
import moduleItemSlice from './slices/ModuleItem/moduleItemSlice';
import compileSlice from './slices/Compile/compileSlice';
import studentSlice from './slices/StudentEnrollCourse/StudentSlice';
import searchSlice from './slices/SearchCourseForUser/searchSlice';
import userSlice from "./slices/User/userSlice";
import searchCourseAPI from './slices/SearchCourseForUser/searchCourseAPI';
import quizSlice from './slices/Quiz/quizSlice';
const appReducer = combineReducers({
    course: courseSlice,
    auth: authSlice,
    payment: paymentSlice,
    account: accountSlice,
    module: moduleSlice,
    moduleItem: moduleItemSlice,
    progress: progressSlice,
    compile: compileSlice,
    student: studentSlice,
    search: searchSlice,
    user: userSlice,
    quiz: quizSlice,
    [searchCourseAPI.reducerPath]: searchCourseAPI.reducer

});

const rootReducer = (state, action) => {
    if (action.type === 'CLEAR_STORE') {
        const { auth } = state;
        state = { auth };
    }
    return appReducer(state, action);
};

export default rootReducer;