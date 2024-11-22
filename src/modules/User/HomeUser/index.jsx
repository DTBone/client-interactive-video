/* eslint-disable react/prop-types */
import { Typography } from '@mui/material';
import { Box } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import '~/index.css';
import CourseList from './components/CourseList';
import { getAllCourse } from "~/store/slices/Course/action.js";
import { useDispatch, useSelector } from 'react-redux';

function HomeUser({user}) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const INITIAL_LIMIT = 4; // Load 4 courses initially
    const LOAD_MORE_LIMIT = 4; // Load 4 more courses each time

    const [recentCourses, setRecentCourses] = useState([]);
    const countAllCourses = useSelector(state => state.course?.count) || 0;
    if(!user) {
        user = {};
    }

    const fetchRecentCourses = useCallback(async ({ limit, page }) => {
        try {
            setLoading(true);
            const result = await dispatch(getAllCourse({ limit, page }));

            if (getAllCourse.fulfilled.match(result)) {
                const newCourses = result.payload.data;
                return newCourses;
            }
            return [];
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    // Initial load
    useEffect(() => {
        const initializeCourses = async () => {
            const initialCourses = await fetchRecentCourses({
                limit: INITIAL_LIMIT,
                page: 1
            });
            setRecentCourses(initialCourses);
            setHasMore(initialCourses.length >= INITIAL_LIMIT);
        };

        initializeCourses();
    }, [fetchRecentCourses]);

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        const moreCourses = await fetchRecentCourses({
            limit: LOAD_MORE_LIMIT,
            page: nextPage
        });

        if (moreCourses.length > 0) {
            setRecentCourses(prev => [...prev, ...moreCourses]);
            setPage(nextPage);

            // Check if we've loaded all courses
            const totalLoaded = recentCourses.length + moreCourses.length;
            setHasMore(totalLoaded < countAllCourses && moreCourses.length >= LOAD_MORE_LIMIT);
        } else {
            setHasMore(false);
        }
    };

    return (
        <div className='h-full w-full flex flex-col items-center pl-5 pr-5'>
            <Box size='100' />
            <Typography variant='h2'>
                Welcome {user.profile?.fullname || 'Guest'}
            </Typography>
            <Typography variant='h4'>
                Your email is {user.email || 'Not provided'}
            </Typography>

            <CourseList
                title='Available Course'
                initialCourses={recentCourses}
                handleClick={handleLoadMore}
                hasMore={hasMore}
                loading={loading}
            />
        </div>
    );
}

export default HomeUser;