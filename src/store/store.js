import { createLogger } from 'redux-logger';
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import courseReducer from "./Course/Reducer";

const logger = createLogger({
    collapsed: true, // Ẩn chi tiết log ban đầu, chỉ mở ra khi nhấn vào
    diff: true,      // Hiển thị sự khác biệt giữa các state
});

const rootReducers = combineReducers({
    course: courseReducer
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk, logger));