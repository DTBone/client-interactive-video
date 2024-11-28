import { useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import CourseItem from './Courses/CourseItem';

const CoursePage = ({ courses }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(6);

    // Calculate the index of the first and last course items for the current page
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Handle page change
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };
    const checkFreeCourse = (price) => {
        if (price === 0) {
            return true
        }
        return false
    }

    return (
        <div>
            <Grid container className=" justify-start gap-5 pl-6 pb-4 pt-4 overflow-hidden">
                {currentCourses.map((course, index) => (
                    <CourseItem
                        key={index}
                        isFree={checkFreeCourse(course.price)}
                        courseImg={course.photo}
                        courseName={course.title}
                        courseId={course._id}
                        course={course}
                        status={course.status}
                        approveBy={course.isApproved}
                    />
                ))}
            </Grid>
            <div className="flex justify-center mt-4">
                <Pagination
                    count={Math.ceil(courses.length / coursesPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                        overflowX: 'hidden',
                        '& .MuiPagination-root': { display: "none" }
                    }}
                />
            </div>
        </div>
    );
};

export default CoursePage;