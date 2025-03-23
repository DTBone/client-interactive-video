import { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Course from "./Course";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursebyUser } from "~/store/slices/Course/action";

const MyLearning = () => {
    const [btnProgress, setBtnProgress] = useState(true);
    const [btnCompleted, setBtnCompleted] = useState(false);
    const { courses, loading, error } = useSelector((state) => state.course);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCoursebyUser());
        console.log('courses', courses);
    }, [courses])
    const handleClick = (e) => {
        if (e.target.id === "progress") {
            setBtnProgress(true);
            setBtnCompleted(false);
        }
        if (e.target.id === "completed") {
            setBtnProgress(false);
            setBtnCompleted(true);
        }
    };

    const filteredCourses = courses.filter((course) =>
        btnProgress ? course.status === "in-progress" : course.status === "complete"
    );
    console.log("Filtered courses:", filteredCourses);

    return (
        <div className="">

            <div style={{ padding: "20px", textAlign: "left" }}>
                <Button
                    id="progress"
                    onClick={handleClick}
                    sx={{
                        backgroundColor: btnProgress ? "black" : "white",
                        color: btnProgress ? "white" : "black",
                        border: "1px solid black",
                        borderRadius: "10px",
                        padding: "5px 10px",
                        margin: "0 10px",
                    }}
                >
                    In Progress
                </Button>
                <Button
                    id="completed"
                    onClick={handleClick}
                    sx={{
                        backgroundColor: btnCompleted ? "black" : "white",
                        color: btnCompleted ? "white" : "black",
                        border: "1px solid black",
                        borderRadius: "10px",
                        padding: "5px 10px",
                        margin: "0 10px",
                    }}
                >
                    Completed
                </Button>
            </div>
            <div className="mt-3 ml-3">
                {courses?.filter((course) => btnProgress ? course.progress?.status === "in-progress" : course.progress?.status === "complete")
                    .map((course) => (
                        <Course key={course._id} props={course} />
                    )
                    )}
            </div>
        </div>
    );
};

export default MyLearning;
