import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { courseReducer } from "./Course/Reducer";
import { thunk } from "redux-thunk";
const rootReducers = combineReducers({
    course: courseReducer
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk))