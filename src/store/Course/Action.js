import { api } from "~/services/api/api"
import {
    GET_ALL_COURSE_FAILURE,
    GET_ALL_COURSE_REQUEST,
    GET_ALL_COURSE_SUCCESS,
    GET_COURSE_BY_ID_REQUEST,
    GET_COURSE_BY_ID_SUCCESS,
    GET_COURSE_BY_ID_FAILURE,
    GET_COURSE_BY_STATUS_REQUEST,
    GET_COURSE_BY_STATUS_SUCCESS,
    GET_COURSE_BY_STATUS_FAILURE,
    GET_COURSE_BY_INSTRUCTOR_REQUEST,
    GET_COURSE_BY_INSTRUCTOR_SUCCESS,
    GET_COURSE_BY_INSTRUCTOR_FAILURE,
    CREATE_COURSE_REQUEST,
    CREATE_COURSE_SUCCESS,
    CREATE_COURSE_FAILURE,
    UPDATE_COURSE_BY_ID_REQUEST,
    UPDATE_COURSE_BY_ID_SUCCESS,
    UPDATE_COURSE_BY_ID_FAILURE,
    DALETE_COURSE_BY_ID_REQUEST,
    DALETE_COURSE_BY_ID_SUCCESS,
    DALETE_COURSE_BY_ID_FAILURE,
    GET_ALL_COURSEREIVEW_REQUEST,
    GET_ALL_COURSEREIVEW_SUCCESS,
    GET_ALL_COURSEREIVEW_FAILURE,
    CREATE_COURSEREVIEW_REQUEST,
    CREATE_COURSEREVIEW_SUCCESS,
    CREATE_COURSEREVIEW_FAILURE,
    DELETE_COURSERV_BY_RVID_REQUEST,
    DELETE_COURSERV_BY_RVID_SUCCESS,
    DELETE_COURSERV_BY_RVID_FAILURE,
    CREATE_APPROVE_COURSE_REQUEST,
    CREATE_APPROVE_COURSE_SUCCESS,
    CREATE_APPROVE_COURSE_FAILURE
} from "./ActionType";
export const getAllCourse = () => async (dispatch) => {
    try {
        const { data } = await api.get("/learns")
        console.log("get all course", data);
        dispatch({ type: GET_ALL_COURSE_SUCCESS, payload: data });
    }
    catch (error) {
        console.log("error get all course", error);
        dispatch({ type: GET_ALL_COURSE_FAILURE, payload: error.message });
    }
}

export const getCourseByID = (courseId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/learns/${courseId}`)
        console.log("get course by Id ", data);
        console.log("courseId:", courseId);

        dispatch({ type: GET_COURSE_BY_ID_SUCCESS, payload: data });
        console.log("Action dispatched: GET_COURSE_BY_ID_SUCCESS");
    }
    catch (error) {
        console.log("error get course by id", error);
        dispatch({ type: GET_COURSE_BY_ID_FAILURE, payload: error.message });
    }
}

export const createCourse = () => async (dispatch) => {
    try {
        const { data } = await api.post("/learns")
        console.log("create course", data);
        dispatch({ type: CREATE_COURSE_SUCCESS, payload: data });
    }
    catch (error) {
        console.log("error create course", error);
        dispatch({ type: CREATE_COURSE_FAILURE, payload: error.message });
    }
}
export const updateCourse = (courseId) => async (dispatch) => {
    try {
        const { data } = await api.put(`/learns/${courseId}`)
        console.log("update course", data);
        dispatch({ type: UPDATE_COURSE_BY_ID_SUCCESS, payload: data });
    }
    catch (error) {
        console.log("error update course", error);
        dispatch({ type: UPDATE_COURSE_BY_ID_FAILURE, payload: error.message });
    }
}