import React from 'react'
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import defaultImage from '~/assets/DefaultImage/course.jpg';
import LinearProgress from '@mui/material/LinearProgress';

const StyledCardMedia = styled(CardMedia)({
    height: 160,  // Fixed height for image
    width: 240, // Full width of card

    borderRadius: 4,
    objectFit: 'cover',
});


const Course = (props) => {
    console.log("course card:", props.props);
    const course = props.props
    const handleBtnClick = (event) => {
        const id = event.target.id;
        if (id === "go-to-course") {
            console.log("Go to course");
        } else if (id === "view-certificate") {
            console.log("View certificate");
        } else if (id === "rate-course") {
            console.log("Rate course");
        }
    };

    return (
        <div className="flex  p-2 shadow-md rounded-md w-9/12 h-3/6">
            <section className="flex items-center w-4/5">
                <div style={{ position: 'relative', padding: '1rem' }}
                >
                    <StyledCardMedia
                        component="img"
                        image={course.photo || defaultImage}
                        alt={course.title}
                        sx={{ backgroundColor: '#8B0000', }}
                    />

                </div>

                <div className="ml-4 flex flex-col items-start w-full">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.level}</p>

                    <div className="w-3/5 mt-2">
                        <LinearProgress
                            variant="determinate"
                            value={course.progress.overallPercentage}
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                    </div>
                    <p className="text-gray-600 mt-2">{course.progress.overallPercentage}% Completed</p>
                </div>
            </section >
            <div className="w-[2px] bg-gray-300"></div>
            <section className="w-1/5 flex flex-col justify-center items-center">
                {course.progress.status === "in-progress" ? (
                    <button
                        id="go-to-course"
                        onClick={handleBtnClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Go to course
                    </button>
                ) : (
                    <div className="flex flex-col items-center">
                        <button
                            id="view-certificate"
                            onClick={handleBtnClick}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            View Certificate
                        </button>
                        <div
                            id="rate-course"
                            onClick={handleBtnClick}
                            className="mt-2 text-gray-600">⭐ Rate</div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Course
