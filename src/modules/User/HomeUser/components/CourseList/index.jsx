/* eslint-disable react/prop-types */
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Course from '~/components/SliderCourses/components/Course';

const CourseList = ({ title, initialCourses, handleClick, hasMore, loading }) => {
    const [visibleCourses, setVisibleCourses] = useState([]);
    const COURSES_PER_PAGE = 4;
    console.log(initialCourses);

    // Reset visible courses when initialCourses changes
    useEffect(() => {
        if (initialCourses?.length > 0) {
            setVisibleCourses(initialCourses);
        }
    }, [initialCourses]);

    const handleShowLess = () => {
        setVisibleCourses(initialCourses.slice(0, COURSES_PER_PAGE));
    };

    const handleShowMore = () => {
        // If we're showing less than what we have in initialCourses
        if (visibleCourses.length < initialCourses.length) {
            setVisibleCourses(initialCourses);
        }
        // If we need to fetch more courses
        else if (hasMore) {
            handleClick();
        }
    };

    if (!initialCourses || initialCourses.length === 0) {
        return (
            <div className='h-full w-full mt-5 flex flex-col items-center'>
                <Typography variant='h3'>{title}</Typography>
                <Typography variant='body1' className='mt-4'>
                    No courses available at the moment.
                </Typography>
            </div>
        );
    }

    return (
        <div className='h-full w-full mt-5 flex flex-col'>
            <Typography variant='h3'>{title}</Typography>

            <div className='flex flex-row flex-wrap items-start' style={{ height: 'auto' }}>
                {visibleCourses.map((course) => (
                    <div
                        key={course.id}
                        className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2'
                        style={{ height: '450px' }}
                    >
                        <Course course={course} />
                    </div>
                ))}
            </div>

            {(visibleCourses.length >= COURSES_PER_PAGE) && (
                <div className='flex justify-center mt-4'>
                    <Button
                        variant='contained'
                        onClick={visibleCourses.length === COURSES_PER_PAGE ? handleShowMore : handleShowLess}
                        disabled={loading}
                        sx={{
                            width: '150px',
                            mt: '10px',
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                color: 'rgba(0, 0, 0, 0.26)'
                            }
                        }}
                    >
                        {loading ? 'Loading...' :
                            visibleCourses.length === COURSES_PER_PAGE ? 'Show more' : 'Show less'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CourseList;