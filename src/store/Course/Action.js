import { api } from "~/services/api/api"
import { GET_ALL_COURSE_FAILURE, GET_ALL_COURSE_SUCCESS } from "./ActionType";

export const getAllCourse = () => async (dispatch) => {
    try {
        const { data } = await api.get("/learns")
        console.log("gett allcourse", data);
        dispatch({ type: GET_ALL_COURSE_SUCCESS, payload: data });
    }
    catch (error) {
        console.log("error get all course", error);
        dispatch({ tpe: GET_ALL_COURSE_FAILURE, payload: error.message });
    }
}