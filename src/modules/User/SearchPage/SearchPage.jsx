
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    setSearchQuery,
    setTags,
    setLevels,
    setPriceRangeSlice,
    setRatingSlice,
    setSortBySlice,
    resetFilters,
    resetQeury
} from '~/store/slices/SearchCourseForUser/searchSlice';
import { useGetTagsQuery, useGetLevelsQuery, useLazySearchCoursesQuery } from '~/store/slices/SearchCourseForUser/searchCourseAPI';
import CourseCard from '../HomeUser/components/CourseCard/CourseCard';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import theme from '~/theme';
import { fetchCourses } from '~/store/slices/SearchCourseForUser/action';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, CircularProgress } from '@mui/material';

const SearchPage = () => {
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);
    const initialCourses = useSelector(state => state.search.courses);
    const page = useSelector(state => state.search.currentPage);
    const [hasMore, setHasMore] = useState(useSelector(state => state.search.hasMore));
    const loading = useSelector(state => state.search.loading);

    const [courses, setCourses] = useState([]);

    const { query, filters, currentPage, isFilterApplied, totalPages } = searchState;
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchCourses, { data, isLoading: searchLoading, error: searchError }] = useLazySearchCoursesQuery();

    const { data: tagData } = useGetTagsQuery();
    const { data: levelsData } = useGetLevelsQuery();

    // States cho các filter
    const [selectedtag, setSelectedtag] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [rating, setRating] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');
    console.log("data", data);
    console.log("totalPages", totalPages);
    console.log("page", page);



    const tag = [  // Ngôn ngữ lập trình
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
        // Framework & Libraries
        'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js',
        // Database
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
        // Development Tools
        'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
        // Mobile Development
        'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',
        // Web Development
        'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'TypeScript', 'WebPack', 'REST API', 'GraphQL',
        // Testing
        'Unit Testing', 'Integration Testing', 'Jest', 'Selenium', 'Cypress',
        // Development Concepts
        'OOP', 'Design Patterns', 'Data Structures', 'Algorithms', 'Clean Code', 'Microservices',
        'DevOps', 'Agile', 'TDD', 'CI/CD',
        // Security
        'Cybersecurity', 'Authentication', 'Authorization', 'OAuth', 'JWT',
        // Level
        'Beginner', 'Intermediate', 'Advanced',
        // Course Type
        'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning', 'AI',

        'Game Development', 'Mobile Development', 'Desktop Development'
    ];


    const [visibleCount, setVisibleCount] = useState(8);

    const showMore = () => {
        setVisibleCount(prev => Math.min(prev + 8, tag.length));
    };

    const showLess = () => {
        setVisibleCount(8);
    };

    const visibleTags = tag.slice(0, visibleCount);

    const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];


    // Kiểm tra xem có bất kỳ filter nào được áp dụng hay không
    const isAnyFilterApplied = () => {
        return (
            query ||
            selectedtag.length > 0 ||
            selectedLevels.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000 ||
            rating > 0 ||
            sortBy !== 'relevance'
        );
    };

    // Đồng bộ hóa URL params với state khi component mount
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn về đầu trang khi vào component

        // Đọc các tham số từ URL
        const queryFromUrl = searchParams.get('q');
        const tagParam = searchParams.get('tag');
        const levelsParam = searchParams.get('levels');
        const priceMinParam = searchParams.get('priceMin');
        const priceMaxParam = searchParams.get('priceMax');
        const ratingParam = searchParams.get('rating');
        const sortParam = searchParams.get('sort');

        // Áp dụng các tham số URL vào state
        if (queryFromUrl) {
            dispatch(setSearchQuery(queryFromUrl));
            setSearchParams(searchParams); // Giữ nguyên URL params
        }

        if (tagParam) {
            const tags = tagParam.split(',');
            setSelectedtag(tags);
            dispatch(setTags(tags));
        }

        if (levelsParam) {
            const levels = levelsParam.split(',');
            setSelectedLevels(levels);
            dispatch(setLevels(levels));
        }

        if (priceMinParam && priceMaxParam) {
            const min = parseInt(priceMinParam);
            const max = parseInt(priceMaxParam);
            setPriceRange([min, max]);
            dispatch(setPriceRangeSlice([min, max]));
        }

        if (ratingParam) {
            const ratingValue = parseInt(ratingParam);
            setRating(ratingValue);
            dispatch(setRatingSlice(ratingValue));
        }

        if (sortParam) {
            setSortBy(sortParam);
            dispatch(setSortBySlice(sortParam));
        }
    }, []);

    // Load dữ liệu ban đầu hoặc dữ liệu tìm kiếm dựa trên URL params
    useEffect(() => {
        const hasParams = Array.from(searchParams.entries()).length > 0;

        if (hasParams) {
            // Nếu có params trong URL, thực hiện tìm kiếm
            const searchObj = {
                query: searchParams.get('q') || '',
                tags: searchParams.get('tag') ? searchParams.get('tag').split(',') : [],
                levels: searchParams.get('levels') ? searchParams.get('levels').split(',') : [],
                priceRange: [
                    parseInt(searchParams.get('priceMin') || 0),
                    parseInt(searchParams.get('priceMax') || 1000)
                ],
                rating: parseInt(searchParams.get('rating') || 0),
                sortBy: searchParams.get('sort') || 'relevance',
                page: 1,
                limit: 9
            };

            searchCourses(searchObj);
        } else {
            // Nếu không có params, load tất cả khóa học
            dispatch(fetchCourses({ page: 1, limit: 9 }));
        }
    }, [dispatch, searchParams]);

    // Cập nhật courses khi có data mới từ API tìm kiếm
    useEffect(() => {
        if (data && data.courses) {
            setCourses(data.courses);
        }
    }, [data]);

    // Cập nhật courses khi có data mới từ redux store (fetchCourses)
    useEffect(() => {
        if (initialCourses && initialCourses.length > 0) {
            setCourses(initialCourses);
        }
    }, [initialCourses]);

    // Cập nhật URL khi filters thay đổi
    const updateFilters = () => {
        const params = new URLSearchParams();

        if (query) {
            params.set('q', query);
        }

        if (selectedtag.length > 0) {
            params.set('tag', selectedtag.join(','));
        }

        if (selectedLevels.length > 0) {
            params.set('levels', selectedLevels.join(','));
        }

        if (priceRange[0] > 0 || priceRange[1] < 1000) {
            params.set('priceMin', priceRange[0].toString());
            params.set('priceMax', priceRange[1].toString());
        }

        if (rating > 0) {
            params.set('rating', rating.toString());
        }

        if (sortBy !== 'relevance') {
            params.set('sort', sortBy);
        }

        setSearchParams(params);
    };

    // Handlers for filter
    const handleCategoryChange = (category) => {
        setSelectedtag(
            selectedtag.includes(category)
                ? selectedtag.filter(cat => cat !== category)
                : [...selectedtag, category]
        );
    };

    const handleLevelChange = (level) => {
        setSelectedLevels(
            selectedLevels.includes(level)
                ? selectedLevels.filter(lvl => lvl !== level)
                : [...selectedLevels, level]
        );
    };

    const handlePriceChange = (min, max) => {
        setPriceRange([min, max]);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleApplyFilters = () => {
        // Đồng bộ state vào Redux
        dispatch(setTags(selectedtag));
        dispatch(setLevels(selectedLevels));
        dispatch(setPriceRangeSlice(priceRange));
        dispatch(setRatingSlice(rating));
        dispatch(setSortBySlice(sortBy));

        // Cập nhật URL và thực hiện tìm kiếm
        updateFilters();

        // Tạo đối tượng params cho tìm kiếm
        const searchObj = {
            query: query || '',
            tags: selectedtag,
            levels: selectedLevels,
            priceRange: priceRange,
            rating: rating,
            sortBy: sortBy,
            page: 1,
            limit: 9
        };

        searchCourses(searchObj);
    };

    const handleResetFilters = () => {
        // Reset các state filter
        setSelectedtag([]);
        setSelectedLevels([]);
        setPriceRange([0, 1000]);
        setRating(0);
        setSortBy('relevance');
        setVisibleCount(8);

        // Reset redux state
        dispatch(resetFilters());

        // Giữ lại query nếu có
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        setSearchParams(params);

        // Tìm kiếm lại với chỉ query nếu có
        if (query) {
            searchCourses(query);
        } else {
            // Nếu không có query, load tất cả khóa học
            dispatch(fetchCourses({ page: 1, limit: 9 }));
        }
    };

    const handleClearSearch = () => {
        // Reset query và load tất cả khóa học
        dispatch(resetQeury());
        setSearchParams({});
        dispatch(fetchCourses({ page: 1, limit: 9 }));
        setHasMore(true);
    };

    // Hàm fetch thêm dữ liệu cho infinite scroll
    const fetchMoreData = () => {
        // Case 1: When filters are applied (search mode)
        if (isAnyFilterApplied()) {
            // Check if there are more pages to load
            if (page < data.totalPages) {
                const searchObj = {
                    query: query || '',
                    tags: selectedtag,
                    levels: selectedLevels,
                    priceRange: priceRange,
                    rating: rating,
                    sortBy: sortBy,
                    page: page + 1,
                    limit: 9
                };
                // Use the RTK Query search function
                searchCourses(searchObj);
                //setPage(prevPage => prevPage + 1);
            } else {
                // No more search results to load
                setHasMore(false);
            }
        }

        // Case 2: When showing all courses (no filters)
        else {

            // Check if there are more pages of all courses
            if (page < totalPages) {
                // Use the regular Redux action to fetch all courses
                dispatch(fetchCourses({ page: page + 1, limit: 9 }));
                //setPage(prevPage => prevPage + 1);

            } else {
                // No more courses to load
                setHasMore(false);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen px-8">
            {/* Filter */}
            <section className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm p-4 mb-4 lg:mb-0 lg:mr-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        Reset All
                    </button>
                </div>

                {/* tags */}
                <div className="mb-6 bg-white">
                    <h4 className="font-semibold mb-2">Categories</h4>
                    <div className="grid grid-cols-2 gap-y-2">
                        {visibleTags.map(category => (
                            <div key={category} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={selectedtag.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="mr-2 h-4 w-4 bg-white border border-black appearance-none checked:bg-white checked:border-black relative checked:text-black checked:before:content-['✔'] checked:before:absolute checked:before:top-0 checked:before:left-1 checked:before:text-black"
                                />
                                <label htmlFor={`category-${category}`} className="text-sm">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                    {tag.length > 8 && (
                        <button
                            onClick={visibleCount >= tag.length ? showLess : showMore}
                            className="mt-2 text-blue-600 text-sm"
                        >
                            {visibleCount >= tag.length ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>

                {/* Levels */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Level</h4>
                    <div className="space-y-2">
                        {levels.map(level => (
                            <div key={level} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`level-${level}`}
                                    checked={selectedLevels.includes(level)}
                                    onChange={() => handleLevelChange(level)}
                                    className="mr-2 h-4 w-4 bg-white border border-black appearance-none checked:bg-white checked:border-black relative checked:text-black checked:before:content-['✔'] checked:before:absolute checked:before:top-0 checked:before:left-1 checked:before:text-black"
                                />
                                <label htmlFor={`level-${level}`} className="text-sm">
                                    {level}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Price</h4>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange[1])}
                            className="w-1/2 p-2 border rounded-md text-sm mr-2 bg-white"
                            placeholder="Min"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || 1000)}
                            className="w-1/2 p-2 border rounded-md text-sm ml-2 bg-white"
                            placeholder="Max"
                        />
                    </div>
                </div>

                {/* Ratings */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Rating</h4>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`rating-${star}`}
                                    name="rating"
                                    checked={rating === star}
                                    onChange={() => handleRatingChange(star)}
                                    className="mr-2 h-4 w-4 bg-white border border-black appearance-none rounded-full checked:bg-black checked:border-black flex items-center justify-center"
                                />
                                <label htmlFor={`rating-${star}`} className="text-sm flex items-center">
                                    {star}+ <span className="ml-1 text-yellow-400">★</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Sort By</h4>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm bg-white"
                    >
                        <option value="relevance">Most Relevant</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {/* Apply Button */}
                <button
                    onClick={handleApplyFilters}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Apply Filters
                </button>
            </section>

            {/* Search results */}
            <section className="w-full lg:w-3/4 bg-white rounded-lg shadow-sm p-4">
                {query ? (
                    <div className='flex justify-start items-center gap-2 mb-4'>
                        <h3 className="text-xl font-bold mb-4">Results for "{query}"</h3>
                        <HighlightOffIcon
                            sx={{
                                marginBottom: '1.5rem',
                                fontSize: 30,
                                color: theme.palette.primary.main,
                                marginRight: '16px',
                                cursor: 'pointer'
                            }}
                            onClick={handleClearSearch}
                        />
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-bold mb-4">All Courses</h3>
                    </div>
                )}

                {/* Filters Applied Tags */}
                {isAnyFilterApplied() && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedtag.map(cat => (
                            <div key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                {cat}
                                <button
                                    onClick={() => handleCategoryChange(cat)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {selectedLevels.map(level => (
                            <div key={level} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                {level}
                                <button
                                    onClick={() => handleLevelChange(level)}
                                    className="ml-1 text-green-500 hover:text-green-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {rating > 0 && (
                            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                                {rating}+ Stars
                                <button
                                    onClick={() => handleRatingChange(0)}
                                    className="ml-1 text-yellow-500 hover:text-yellow-700"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                            <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                                ${priceRange[0]} - ${priceRange[1]}
                                <button
                                    onClick={() => handlePriceChange(0, 1000)}
                                    className="ml-1 text-purple-500 hover:text-purple-700"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading indicator */}
                {(loading || searchLoading) && courses.length === 0 && (
                    <div className="flex justify-center items-center h-64">
                        <CircularProgress color="primary" />
                    </div>
                )}

                {/* Error message */}
                {searchError && (
                    <div className="text-red-500 p-4 border border-red-300 rounded">
                        Error: {searchError.message || "An error occurred while loading data."}
                    </div>
                )}

                {/* Course display */}
                <div className="overflow-hidden">
                    {!loading && !searchLoading && courses.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-500 text-lg">
                                No suitable course found</p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={courses.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                                    <CircularProgress color="inherit" size={24} />
                                </Box>
                            }
                            endMessage={
                                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <b>You have viewed all courses</b>
                                </p>
                            }
                            scrollThreshold={0.8}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>
            </section>
        </div>
    )
}

export default SearchPage