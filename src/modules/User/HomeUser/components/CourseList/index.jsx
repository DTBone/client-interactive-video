/* eslint-disable react/prop-types */
import { Button, Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Course from '~/components/SliderCourses/components/Course';

const CourseList = ({ title, initialCourses, handleClick, hasMore = false, loading }) => {
    const [visibleCourses, setVisibleCourses] = useState([]);
    const COURSES_PER_PAGE = 6;
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
        <Paper elevation={0} sx={{ width: '100%', backgroundColor: 'transparent' }}
        className='px-12 py-6'
        >
            <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg"></div>
            <Typography variant="h4" style={{ marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{title}</Typography>
            <Divider style={{ marginBottom: '1rem' }} />
            <div className='flex flex-row flex-wrap items-start' style={{ height: 'auto' }}>
                {visibleCourses.map((course) => (
                    <div
                        key={course.id}
                        className='w-full sm:w-full md:w-1/2 lg:w-1/3 p-2'
                        style={{ height: '500px' }}
                    >
                        <Course course={course} />
                    </div>
                ))}
            </div>

            {(visibleCourses.length >= COURSES_PER_PAGE && hasMore) && (
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
        </Paper>
    );
};

export default CourseList;