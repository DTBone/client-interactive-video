/* eslint-disable react/prop-types */
import { Box, Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import '~/index.css';
import CourseList from './components/CourseList';
import { getAllCourse } from "~/store/slices/Course/action.js";
import { useDispatch, useSelector } from 'react-redux';
import banner from '~/assets/Banner.png';
import Banner from './components/Banner';
import Categories from './components/Categories';
import imageAbout from '~/assets/banner_about.webp';
import roadmap from '~/assets/roadmap.png';
import { Map } from '@mui/icons-material';
import you from '~/assets/you.png';
function HomeUser({ user }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const INITIAL_LIMIT = 6; // Load 4 courses initially
    const LOAD_MORE_LIMIT = 3; // Load 4 more courses each time

    const [recentCourses, setRecentCourses] = useState([]);
    const [machineLearningCourses, setMachineLearningCourses] = useState([]);
    const [javaCourses, setJavaCourses] = useState([]);
    const [pythonCourses, setPythonCourses] = useState([]);
    const [webDevelopmentCourses, setWebDevelopmentCourses] = useState([]);
    const [newCourses, setNewCourses] = useState([]);
    const countAllCourses = useSelector(state => state.course?.count) || 0;
    if (!user) {
        user = {};
    }

    const fetchRecentCourses = useCallback(async ({ limit, page }) => {
        try {
            setLoading(true);
            const param = {
                limit,
                page,
            }
            const result = await dispatch(getAllCourse(param));

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

    useEffect(() => {
        const initializeMachineLearningCourses = async () => {
            const machineLearningCourses = await getCoursesBySearch('AI'); // Replace 'Machine Learning' with the actual search term for machine learning courses
            setMachineLearningCourses(machineLearningCourses);
        }
        const initializeJavaCourses = async () => {
            const javaCourses = await getCoursesBySearch('Java '); // Replace 'Java' with the actual search term for Java courses
            setJavaCourses(javaCourses);
        }
        const initializePythonCourses = async () => {
            const pythonCourses = await getCoursesBySearch('Python'); // Replace 'Python' with the actual search term for Python courses
            setPythonCourses(pythonCourses);
        }
        const initializeWebDevelopmentCourses = async () => {
            const webDevelopmentCourses = await getCoursesBySearch('Web Development'); // Replace 'Web Development' with the actual search term for Web Development courses
            setWebDevelopmentCourses(webDevelopmentCourses);
        }
        const initializeNewCourses = async () => {
            const newCourse = await getCoursesBySearch( '', 'newest'); // Replace 'Web Development' with the actual search term for Web Development courses
            setNewCourses(newCourse);
        }
        initializeNewCourses();
        initializeJavaCourses();
        initializePythonCourses();
        initializeWebDevelopmentCourses();
        initializeMachineLearningCourses();
    }, []);

    const getCoursesBySearch = async (search, orderBy) => {
        try {
            setLoading(true);
            const param = {
                limit: 6,
                page: 1,
                search: search,
                orderBy: orderBy,
            }
            const result = await dispatch(getAllCourse(param));

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
    }

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
        <>
            <Banner image={banner} />
        <div className='h-full w-full flex flex-col items-center'>
            {/* Categories */}
            <Categories />
            <section className='w-full flex flex-col items-center'>
                <CourseList
                    title={'Recent Courses'}
                    initialCourses={recentCourses}
                    handleClick={handleLoadMore}
                    hasMore={hasMore}
                    loading={loading}
                />
            </section>
            <section className='w-full flex flex-col items-center bg-green-100'>
            <CourseList
                title={'Newest Courses'}
                initialCourses={newCourses}
            />
            </section>
            {/* About me */}
            <section className='w-full flex flex-col items-center'>
                <Paper elevation={0} sx={{ width: '100%', backgroundColor: 'transparent' }}
                className='px-12 py-6'>
                    <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg">
                    </div>
                    <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    
                        <img src={imageAbout} alt='About us' className='w-1/2 h-full object-cover' />
                        <Box sx={{ marginLeft: '1rem' }}>
                            <Typography variant="h4" style={{ marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Why CodeChef</Typography>
                            <Divider style={{ marginBottom: '1rem' }} />
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                CodeChef is a platform which supports over 50 programming languages and has a large community.
                            </Typography>
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                CodeChef was created as a platform to help programmers make it big in the world of algorithms, computer programming, and programming contests. It hosts three featured contests every month (Long Challenge, Cook-Off, Lunchtime) and gives away prizes and goodies to the winners as encouragement.
                            </Typography>
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                CodeChef for Schools aims to provide a fun and interactive platform for students to learn programming. It is a non-commercial initiative and is open to students from all schools across the globe.
                            </Typography>
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                CodeChef was created as a platform to help programmers make it big in the world of algorithms, computer programming, and programming contests. It hosts three featured contests every month (Long Challenge, Cook-Off, Lunchtime) and gives away prizes and goodies to the winners as encouragement.
                            </Typography>
                        </Box>
                        
                    </Box>

                </Paper>
            </section>
            {/* Aim to your goals */}
            <section className='w-full flex flex-col items-center bg-green-100'>
                <Paper elevation={0} sx={{ width: '100%', backgroundColor: 'transparent' }}
                className='px-12 py-6'>
                    <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg"></div>
                    <Typography variant="h4" style={{ marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Follow your goals</Typography>
                    <Divider style={{ marginBottom: '1rem' }} />
                    <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    
                        <Box sx={{ marginLeft: '1rem' }}>
                            <img src={you} alt='Goals' className='w-1/2 object-cover' />
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                CodeChef provides a roadmap to help you achieve your goals. 
                            </Typography>
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                The roadmap is a step-by-step guide to help you learn programming and algorithms.
                            </Typography>
                            <Typography variant='body1' style={{ marginBottom: '1rem' }}>
                                The roadmap is divided into levels, each level containing a list of topics to learn.
                            </Typography>
                        </Box>
                        <img src={roadmap} alt='Goals' className='w-1/2 h-full object-cover' />
                        
                    </Box>

                </Paper>
            </section>
        </div>
        </>
    );
}

export default HomeUser;