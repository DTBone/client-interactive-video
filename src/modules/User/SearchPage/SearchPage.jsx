import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    setSearchQuery,
    setCategories,
    setLevels,
    setPriceRangeSlice,
    setRatingSlice,
    setSortBySlice,
    setCurrentPage,
    resetFilters,
    setAllFilters
} from '~/store/slices/SearchCourseForUser/searchSlice';
import { useGetCategoriesQuery, useGetLevelsQuery, useLazySearchCoursesQuery, useSearchCoursesQuery } from '~/store/slices/SearchCourseForUser/searchCourseAPI';
import CourseCard from '../HomeUser/components/CourseCard/CourseCard';
const SearchPage = () => {
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);
    const { query, filters, currentPage, isFilterApplied } = searchState;
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchCourses, { data, isLoading, error }] = useLazySearchCoursesQuery();

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: levelsData, isLoading: levelsLoading } = useGetLevelsQuery();


    // States cho các filter
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [rating, setRating] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');


    const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

    const {
        data: searchResults,
        isLoading: searchLoading,
        error: searchError,
        isFetching: searchFetching
    } = useSearchCoursesQuery({
        query: query,
        categories: filters.categories,
        levels: filters.levels,
        priceRange: filters.priceRange,
        rating: filters.rating,
        sortBy: filters.sortBy,
        page: currentPage,
        limit: 12
    }, {

        skip: !query &&
            selectedCategories.length === 0 &&
            selectedLevels.length === 0 &&
            priceRange[0] === 0 &&
            priceRange[1] === 1000 &&
            rating === 0 &&
            sortBy === 'relevance'
    });


    useEffect(() => {

        if (query) {
            searchCourses(query);
        }
    }, [query, searchCourses]);


    useEffect(() => {
        // Đồng bộ URL query với state
        const queryFromUrl = searchParams.get('q');
        if (queryFromUrl && queryFromUrl !== query) {
            dispatch(setSearchQuery(queryFromUrl));
        }

        // Đọc các tham số lọc từ URL (nếu có)
        const categoriesParam = searchParams.get('categories');
        const levelsParam = searchParams.get('levels');
        const priceMinParam = searchParams.get('priceMin');
        const priceMaxParam = searchParams.get('priceMax');
        const ratingParam = searchParams.get('rating');
        const sortParam = searchParams.get('sort');

        if (categoriesParam) {
            const categories = categoriesParam.split(',');
            if (categories.length > 0) {
                dispatch(setCategories(categories));
            }
        }

        if (levelsParam) {
            const levels = levelsParam.split(',');
            if (levels.length > 0) {
                dispatch(setLevels(levels));
            }
        }

        if (priceMinParam && priceMaxParam) {
            const minPrice = parseInt(priceMinParam);
            const maxPrice = parseInt(priceMaxParam);
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                dispatch(setPriceRangeSlice([minPrice, maxPrice]));
            }
        }

        if (ratingParam) {
            const rating = parseInt(ratingParam);
            if (!isNaN(rating)) {
                dispatch(setRatingSlice(rating));
            }
        }

        if (sortParam && typeof sortParam === 'string') {
            dispatch(setSortBySlice(sortParam));
        }

    }, [searchParams, dispatch, query]);


    // Cập nhật URL khi filters thay đổi
    const updateFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        } else {
            params.delete('categories');
        }

        if (selectedLevels.length > 0) {
            params.set('levels', selectedLevels.join(','));
        } else {
            params.delete('levels');
        }

        params.set('priceMin', priceRange[0].toString());
        params.set('priceMax', priceRange[1].toString());
        params.set('rating', rating.toString());
        params.set('sort', sortBy);

        setSearchParams(params);
    };

    // Handlers for filter
    const handleCategoryChange = (category) => {
        setSelectedCategories(
            selectedCategories.includes(category)
                ? selectedCategories.filter(cat => cat !== category)
                : [...selectedCategories, category]
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
        updateFilters();
        searchCourses(query);
    };

    const handleResetFilters = () => {
        resetFilters();
        // dispatch(resetFilters());
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        setSearchParams(params);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedLevels([]);
        setPriceRange([0, 1000]);
        setRating(0);
        setSortBy('relevance');
        dispatch(resetFilters());
    }

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen ">
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

                {/* Categories */}
                <div className="mb-6 bg-white">
                    <h4 className="font-semibold mb-2">Categories</h4>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <div key={category} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="mr-2 h-4 w-4 bg-white border border-black appearance-none checked:bg-white checked:border-black relative checked:text-black checked:before:content-['✔'] checked:before:absolute checked:before:top-0 checked:before:left-1 checked:before:text-black"
                                />
                                <label htmlFor={`category-${category}`} className="text-sm">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
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
                            onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                            className="w-1/2 p-2 border rounded-md text-sm mr-2 bg-white"
                            placeholder="Min"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
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
                {query && <h3 className="text-xl font-bold mb-4">Results for "{query}"</h3>}

                {/* Filters Applied Tags */}
                {(selectedCategories.length > 0 || selectedLevels.length > 0 || rating > 0 ||
                    priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedCategories.map(cat => (
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

                {/* Placeholder for course results - replace with actual course cards */}
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {/* {data && data.courses === 0 && <p>No courses found {data}</p>} */}
                {data &&
                    <div>
                        {data.courses.length === 0 ?
                            (
                                <p>No courses found</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    {data.courses.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                        // <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        //     <div className="w-full h-30 bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                                        //         {course.photo ? (
                                        //             <img
                                        //                 src={course.photo}
                                        //                 alt={course.title}
                                        //                 className="w-full h-full object-cover rounded-md"
                                        //             />
                                        //         ) : (
                                        //             <div className="text-gray-400 text-2xl font-bold">{course.title.charAt(0)}</div>
                                        //         )}
                                        //     </div>
                                        //     <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.title}</h3>
                                        //     <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                                        //     <div className="flex items-center mb-2">
                                        //         <div className="flex text-yellow-400">
                                        //             {[1, 2, 3, 4, 5].map((star) => (
                                        //                 <span key={star}>
                                        //                     {course.rating && star <= Math.floor(course.rating) ? "★" : "☆"}
                                        //                 </span>
                                        //             ))}
                                        //         </div>
                                        //         <span className="text-sm text-gray-500 ml-2">
                                        //             {course.rating ? `${course.rating.toFixed(1)} (${course.reviews || 0})` : 'No ratings'}
                                        //         </span>
                                        //     </div>
                                        //     <div className="flex justify-between items-center">
                                        //         <span className="font-bold text-indigo-600">
                                        //             {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                                        //         </span>
                                        //         <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                        //             {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                        //         </span>
                                        //     </div>
                                        // </div>
                                    ))}
                                </div>
                            )}
                    </div>}
            </section>
        </div>
    )
}

export default SearchPage
