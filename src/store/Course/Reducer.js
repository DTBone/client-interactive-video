import { GET_ALL_COURSE_FAILURE, GET_ALL_COURSE_REQUEST, GET_ALL_COURSE_SUCCESS } from "./ActionType";

const initialState = {
    loading: false,
    data: null,
    error: null,
    courses: [],
    course: null,
}

export const courseReducer = (state = initialState, action) => {
    console.log("courseReducer called", state, action);
    switch (action.type) {
        case GET_ALL_COURSE_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ALL_COURSE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case GET_ALL_COURSE_SUCCESS:
            return { ...state, loading: false, error: null, courses: action.payload };
        default:
            return state;
    }

}