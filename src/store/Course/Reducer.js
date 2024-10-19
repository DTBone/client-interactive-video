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
const initialState = {
    loading: false,
    error: null,
    courses: [],
    course: null,
    findcourse: null,
    courseReviews: [],
    coursesByStatus: [],
    coursesByInstructor: [],
    message: null
}

const courseReducer = (state = initialState, action) => {
    console.log("courseReducer called", state, action);
    console.log("Reducer received action:", action.type);
    switch (action.type) {
        // Get All Courses
        case GET_ALL_COURSE_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ALL_COURSE_SUCCESS:
            return { ...state, loading: false, courses: action.payload, error: null };
        case GET_ALL_COURSE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Get Course by ID
        case GET_COURSE_BY_ID_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_COURSE_BY_ID_SUCCESS:
            console.log("Reducer received data:", action.payload);
            return { ...state, loading: false, findCourse: action.payload, error: null };
        case GET_COURSE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Get Course by Status
        case GET_COURSE_BY_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_COURSE_BY_STATUS_SUCCESS:
            return { ...state, loading: false, coursesByStatus: action.payload, error: null };
        case GET_COURSE_BY_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Get Courses by Instructor
        case GET_COURSE_BY_INSTRUCTOR_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_COURSE_BY_INSTRUCTOR_SUCCESS:
            return { ...state, loading: false, coursesByInstructor: action.payload, error: null };
        case GET_COURSE_BY_INSTRUCTOR_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Create Course
        case CREATE_COURSE_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                courses: [...state.courses, action.payload],
                message: "Course created successfully",
                error: null
            };
        case CREATE_COURSE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Update Course
        case UPDATE_COURSE_BY_ID_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_COURSE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                courses: state.courses.map(course =>
                    course.id === action.payload.id ? action.payload : course
                ),
                message: "Course updated successfully",
                error: null
            };
        case UPDATE_COURSE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Delete Course
        case DALETE_COURSE_BY_ID_REQUEST:
            return { ...state, loading: true, error: null };
        case DALETE_COURSE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                courses: state.courses.filter(course => course.id !== action.payload),
                message: "Course deleted successfully",
                error: null
            };
        case DALETE_COURSE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Course Reviews
        case GET_ALL_COURSEREIVEW_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ALL_COURSEREIVEW_SUCCESS:
            return { ...state, loading: false, courseReviews: action.payload, error: null };
        case GET_ALL_COURSEREIVEW_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Create Course Review
        case CREATE_COURSEREVIEW_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_COURSEREVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                courseReviews: [...state.courseReviews, action.payload],
                message: "Review added successfully",
                error: null
            };
        case CREATE_COURSEREVIEW_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Delete Course Review
        case DELETE_COURSERV_BY_RVID_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_COURSERV_BY_RVID_SUCCESS:
            return {
                ...state,
                loading: false,
                courseReviews: state.courseReviews.filter(review => review.id !== action.payload),
                message: "Review deleted successfully",
                error: null
            };
        case DELETE_COURSERV_BY_RVID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Approve Course
        case CREATE_APPROVE_COURSE_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_APPROVE_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                message: "Course approved successfully",
                error: null
            };
        case CREATE_APPROVE_COURSE_FAILURE:
            return { ...state, loading: false, error: action.payload };

    }

}
export default courseReducer;