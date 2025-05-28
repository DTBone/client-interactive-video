import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
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
import { Box, CircularProgress, Chip, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';

const SearchPage = () => {
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);

    const page = useSelector(state => state.search.currentPage);
    const [hasMore, setHasMore] = useState(useSelector(state => state.search.hasMore));
    const loading = useSelector(state => state.search.loading);

    const [recentFilters, setRecentFilters] = useState([]);

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
    const [filterHistory, setFilterHistory] = useState(() => {
        const saved = localStorage.getItem('recentFilters');
        return saved ? JSON.parse(saved) : [];
    });

    // Thêm trạng thái cho trạng thái hiện tại của filter và kết quả
    const [activeFilters, setActiveFilters] = useState({});
    const [isFilterChanged, setIsFilterChanged] = useState(false);
    console.log("data", data);
    console.log("totalPages", totalPages);
    console.log("page", page);



    // const tag = [  // Ngôn ngữ lập trình
    //     'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
    //     // Framework & Libraries
    //     'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js',
    //     // Database
    //     'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    //     // Development Tools
    //     'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
    //     // Mobile Development
    //     'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',
    //     // Web Development
    //     'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'TypeScript', 'WebPack', 'REST API', 'GraphQL',
    //     // Testing
    //     'Unit Testing', 'Integration Testing', 'Jest', 'Selenium', 'Cypress',
    //     // Development Concepts
    //     'OOP', 'Design Patterns', 'Data Structures', 'Algorithms', 'Clean Code', 'Microservices',
    //     'DevOps', 'Agile', 'TDD', 'CI/CD',
    //     // Security
    //     'Cybersecurity', 'Authentication', 'Authorization', 'OAuth', 'JWT',
    //     // Level
    //     'Beginner', 'Intermediate', 'Advanced',
    //     // Course Type
    //     'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning', 'AI',

    //     'Game Development', 'Mobile Development', 'Desktop Development'
    // ];

    const tag = [
        // Ngôn ngữ lập trình phổ biến nhất
        'JavaScript', 'Python', 'Java', 'TypeScript', 'PHP', 'C#', 'C++', 'Go', 'Swift', 'Kotlin', 'Ruby', 'Rust',

        // Web Development (phổ biến hàng đầu)
        'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Bootstrap', 'Tailwind CSS', 'SASS', 'WebPack', 'REST API', 'GraphQL',

        // Backend Frameworks
        'Express.js', 'Django', 'Spring Boot', 'Laravel', 'Flask',

        // Database
        'MySQL', 'MongoDB', 'PostgreSQL', 'SQL Server', 'Redis', 'SQLite', 'Oracle',

        // Development Tools
        'Git', 'Docker', 'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Jenkins',

        // Mobile Development
        'React Native', 'Flutter', 'Android', 'iOS', 'Xamarin',

        // Level (phổ biến trong tìm kiếm khoá học)
        'Beginner', 'Intermediate', 'Advanced',

        // Course Type
        'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'Machine Learning', 'AI',

        // Development Concepts
        'OOP', 'Data Structures', 'Algorithms', 'Microservices', 'Design Patterns', 'Clean Code',
        'Agile', 'CI/CD', 'TDD',

        // Testing
        'Unit Testing', 'Integration Testing', 'Jest', 'Cypress', 'Selenium',

        // Security
        'Cybersecurity', 'Authentication', 'Authorization', 'JWT', 'OAuth',

        // Other Development Fields
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

    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    const courses = useSelector(state => state.search.courses);


    // Kiểm tra xem có bất kỳ filter nào được áp dụng hay không
    const isAnyFilterApplied = () => {
        return (
            (typeof query === 'string' && query.trim() !== '') ||
            selectedtag.length > 0 ||
            selectedLevels.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000 ||
            rating > 0 ||
            sortBy !== 'relevance'
        );
    };

    const [error, setError] = useState("");



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
                limit: 12
            };

            searchCourses(searchObj);
        } else {
            // Nếu không có params, load tất cả khóa học
            dispatch(fetchCourses({ page: 1, limit: 12 }));
        }
    }, [dispatch, searchParams]);
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
        const newSelectedTags = selectedtag.includes(category)
            ? selectedtag.filter(cat => cat !== category)
            : [...selectedtag, category];

        setSelectedtag(newSelectedTags);

        // Tự động áp dụng bộ lọc khi thay đổi
        setTimeout(() => {
            applyFiltersAutomatic(newSelectedTags, selectedLevels, priceRange, rating, sortBy);
        }, 0);
    };

    const handleLevelChange = (level) => {
        const newSelectedLevels = selectedLevels.includes(level)
            ? selectedLevels.filter(lvl => lvl !== level)
            : [...selectedLevels, level];

        setSelectedLevels(newSelectedLevels);

        // Tự động áp dụng bộ lọc khi thay đổi
        setTimeout(() => {
            applyFiltersAutomatic(selectedtag, newSelectedLevels, priceRange, rating, sortBy);
        }, 0);
    };

    // Sử dụng debounce cho thay đổi giá
    const debouncedPriceChange = useCallback(
        debounce((min, max) => {
            applyFiltersAutomatic(selectedtag, selectedLevels, [min, max], rating, sortBy);
        }, 800),
        [selectedtag, selectedLevels, rating, sortBy]
    );

    const handlePriceChange = (min, max) => {
        setPriceRange([min, max]);
        debouncedPriceChange(min, max);

        if (min < 0 || max < 0) {
            setError("The value must be greater than 0.");
        } else if (min >= max) {
            setError("The minimum value must be less than the maximum value.");
        } else {
            setError("");
            setPriceRange([min, max]);
        }
    };

    const handleRatingChange = (value) => {
        setRating(value);

        // Tự động áp dụng bộ lọc khi thay đổi
        setTimeout(() => {
            applyFiltersAutomatic(selectedtag, selectedLevels, priceRange, value, sortBy);
        }, 0);
    };

    const handleSortChange = (value) => {
        setSortBy(value);

        // Tự động áp dụng bộ lọc khi thay đổi
        setTimeout(() => {
            applyFiltersAutomatic(selectedtag, selectedLevels, priceRange, rating, value);
        }, 0);
    };

    // Hàm tự động áp dụng bộ lọc mà không cần nhấn nút
    const applyFiltersAutomatic = useCallback((tags, levels, price, ratingValue, sort) => {
        // Đồng bộ state vào Redux
        dispatch(setTags(tags));
        dispatch(setLevels(levels));
        dispatch(setPriceRangeSlice(price));
        dispatch(setRatingSlice(ratingValue));
        dispatch(setSortBySlice(sort));

        // Lưu bộ lọc vào lịch sử nếu đáng lưu
        saveRecentFilter(tags, levels, price, ratingValue, sort);

        // Cập nhật URL và thực hiện tìm kiếm
        const params = new URLSearchParams();

        if (query) {
            params.set('q', query);
        }

        if (tags.length > 0) {
            params.set('tag', tags.join(','));
        }

        if (levels.length > 0) {
            params.set('levels', levels.join(','));
        }

        if (price[0] > 0 || price[1] < 1000) {
            params.set('priceMin', price[0].toString());
            params.set('priceMax', price[1].toString());
        }

        if (ratingValue > 0) {
            params.set('rating', ratingValue.toString());
        }

        if (sort !== 'relevance') {
            params.set('sort', sort);
        }

        setSearchParams(params);

        // Tạo đối tượng params cho tìm kiếm
        const searchObj = {
            query: query || '',
            tags: tags,
            levels: levels,
            priceRange: price,
            rating: ratingValue,
            sortBy: sort,
            page: 1,
            limit: 12  // Tăng số lượng kết quả mỗi trang
        };

        searchCourses(searchObj);
    }, [query, dispatch, searchCourses, setSearchParams]);

    // Lưu bộ lọc gần đây
    const saveRecentFilter = (tags, levels, price, ratingValue, sort) => {
        // Chỉ lưu khi có bộ lọc đáng kể
        if (tags.length > 0 || levels.length > 0 || ratingValue > 0 ||
            price[0] > 0 || price[1] < 1000 || sort !== 'relevance') {

            const currentFilter = {
                tags,
                levels,
                price,
                rating: ratingValue,
                sortBy: sort,
                timestamp: new Date().toISOString()
            };

            // Lấy bộ lọc từ localStorage
            const savedFilters = localStorage.getItem('recentFilters');
            let recentFilters = savedFilters ? JSON.parse(savedFilters) : [];

            // Kiểm tra xem bộ lọc có tồn tại chưa (bỏ qua timestamp)
            const exists = recentFilters.some(filter =>
                JSON.stringify({ ...filter, timestamp: undefined }) ===
                JSON.stringify({ ...currentFilter, timestamp: undefined })
            );

            if (!exists) {
                // Thêm bộ lọc mới vào đầu và giới hạn 5 bộ lọc
                recentFilters = [currentFilter, ...recentFilters].slice(0, 5);
                localStorage.setItem('recentFilters', JSON.stringify(recentFilters));
                setRecentFilters(recentFilters);
            }
        }
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
            dispatch(fetchCourses({ page: 1, limit: 12 }));
        }
    };

    const handleClearSearch = () => {
        // Reset query và load tất cả khóa học
        dispatch(resetQeury());
        setSearchParams({});
        dispatch(fetchCourses({ page: 1, limit: 12 }));
        setHasMore(true);


    };    // Hàm fetch thêm dữ liệu cho infinite scroll
    const fetchMoreData = () => {
        // Nếu đang loading hoặc không còn dữ liệu thì dừng lại
        if (loading || searchLoading || !hasMore) {
            console.log('Đang loading hoặc không còn dữ liệu để tải thêm');
            return;
        }

        try {
            // Case 1: When filters are applied (search mode)
            if (isAnyFilterApplied()) {
                // Lấy thông tin phân trang từ cấu trúc phản hồi mới
                const pagination = data?.data?.pagination;
                const currentPage = pagination?.currentPage || page;
                const totalPagesFromResponse = pagination?.totalPages || 0;
                const hasNextPage = pagination?.hasNextPage || false;

                console.log(`Debug pagination - Current page: ${currentPage}, Total pages: ${totalPagesFromResponse}, Has next page: ${hasNextPage}`);

                // Sử dụng hasNextPage trực tiếp từ API nếu có, nếu không thì dùng kiểm tra dự phòng
                const canLoadMore = hasNextPage || (totalPagesFromResponse > 0 && currentPage < totalPagesFromResponse)
                    || (data?.data?.courses && data.data.courses.length === 12); // Dự phòng cuối cùng

                if (canLoadMore) {
                    const nextPage = pagination?.nextPage || currentPage + 1;
                    const searchObj = {
                        query: query || '',
                        tags: selectedtag,
                        levels: selectedLevels,
                        priceRange: priceRange,
                        rating: rating,
                        sortBy: sortBy,
                        page: nextPage,
                        limit: 12
                    };
                    console.log(`Đang tải thêm dữ liệu trang ${nextPage}/${totalPagesFromResponse || 'unknown'}`);
                    searchCourses(searchObj);
                } else {
                    console.log('Đã tải hết khóa học với bộ lọc hiện tại');
                    setHasMore(false);
                }
            }        // Case 2: When showing all courses (no filters)
            else {
                // Kiểm tra phân trang sử dụng dữ liệu từ Redux store
                console.log(`Debug No Filter - Current page: ${page}, Total pages: ${totalPages}`);

                // Kiểm tra nếu có totalPages trả về và còn trang để tải
                if (totalPages > 0 && page < totalPages) {
                    console.log(`Đang tải thêm tất cả khóa học: trang ${page + 1}/${totalPages}`);
                    dispatch(fetchCourses({ page: page + 1, limit: 12 }));
                }
                // Nếu không có thông tin totalPages rõ ràng, dùng kiểm tra dựa trên số lượng kết quả
                else {
                    const pageLimit = 12;
                    const hasMoreByCount = courses && courses.length > 0 && courses.length % pageLimit === 0;

                    if (hasMoreByCount) {
                        console.log(`Đang tải thêm tất cả khóa học (dựa trên số lượng): trang ${page + 1}`);
                        dispatch(fetchCourses({ page: page + 1, limit: pageLimit }));
                    } else {
                        console.log('Đã tải hết tất cả khóa học (dựa trên số lượng kết quả)');
                        setHasMore(false);
                    }
                }
            }
        } catch (error) {
            console.error('Lỗi khi tải thêm dữ liệu:', error);
            setHasMore(false);
        }
    };

    // Thêm useEffect để xử lý pagination và hasMore đúng cách
    useEffect(() => {
        if (data && data.data) {
            // Trích xuất thông tin từ dữ liệu API mới
            const pagination = data.data.pagination || {};
            const coursesFromAPI = data.data.courses || [];

            console.log('API Pagination Data:', {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalCount: pagination.totalCount,
                hasNextPage: pagination.hasNextPage,
                hasPrevPage: pagination.hasPrevPage,
                coursesCount: coursesFromAPI.length
            });

            // Xác định có thể tải thêm không - ưu tiên sử dụng hasNextPage trực tiếp từ API
            if (pagination.hasNextPage !== undefined) {
                // Nếu API trả về hasNextPage rõ ràng
                setHasMore(pagination.hasNextPage);
                console.log(`Có thể tải thêm (dựa vào hasNextPage): ${pagination.hasNextPage}`);
            } else if (pagination.totalPages && pagination.currentPage) {
                // Nếu API trả về currentPage và totalPages
                const canLoadMore = pagination.currentPage < pagination.totalPages;
                setHasMore(canLoadMore);
                console.log(`Có thể tải thêm (dựa vào totalPages): ${canLoadMore}`);
            } else {
                // Nếu không có thông tin phân trang rõ ràng, dựa vào số lượng kết quả trả về
                const canLoadMore = coursesFromAPI.length === 12; // Nếu trả về đủ limit
                setHasMore(canLoadMore);
                console.log(`Có thể tải thêm (dựa vào độ dài): ${canLoadMore}`);
            }
        }
    }, [data]);

    const [displayedCourses, setDisplayedCourses] = useState([]);

    useEffect(() => {
        console.log('Courses from Redux:', courses);
        console.log('Courses from API:', data?.courses);
        setDisplayedCourses(courses);

    }, [courses]);

    useEffect(() => {
        console.log('Courses from Redux:', courses);
        console.log('Courses from API:', data?.courses);
        // Nếu có kết quả tìm kiếm (data.data.courses) thì cập nhật vào displayedCourses

        setDisplayedCourses(data?.courses);

    }, [data]);

    // Hàm lưu bộ lọc vào lịch sử
    const saveFilterToHistory = () => {
        const currentFilter = {
            tags: selectedtag,
            levels: selectedLevels,
            price: priceRange,
            rating: rating,
            sortBy: sortBy,
            timestamp: new Date().getTime()
        };

        // Chỉ lưu khi có ít nhất một bộ lọc được áp dụng
        if (selectedtag.length > 0 || selectedLevels.length > 0 ||
            rating > 0 || priceRange[0] > 0 || priceRange[1] < 1000) {

            // Kiểm tra nếu bộ lọc này đã tồn tại
            const filterExists = filterHistory.some(filter =>
                JSON.stringify({ ...filter, timestamp: undefined }) ===
                JSON.stringify({ ...currentFilter, timestamp: undefined })
            );

            if (!filterExists) {
                // Giữ tối đa 5 bộ lọc gần nhất
                const newHistory = [currentFilter, ...filterHistory].slice(0, 5);
                setFilterHistory(newHistory);
                localStorage.setItem('recentFilters', JSON.stringify(newHistory));
            }
        }
    };

    // Hàm áp dụng một bộ lọc từ lịch sử
    const applyFilterFromHistory = (filter) => {
        setSelectedtag(filter.tags || []);
        setSelectedLevels(filter.levels || []);
        setPriceRange(filter.price || [0, 1000]);
        setRating(filter.rating || 0);
        setSortBy(filter.sortBy || 'relevance');

        // Cập nhật Redux và tìm kiếm
        dispatch(setTags(filter.tags || []));
        dispatch(setLevels(filter.levels || []));
        dispatch(setPriceRangeSlice(filter.price || [0, 1000]));
        dispatch(setRatingSlice(filter.rating || 0));
        dispatch(setSortBySlice(filter.sortBy || 'relevance'));

        // Cập nhật URL và thực hiện tìm kiếm
        updateFiltersAndSearch();
    };

    // Thêm hàm handleApplyFilters để áp dụng filter khi nhấn nút
    const handleApplyFilters = () => {
        // Sử dụng hàm applyFiltersAutomatic đã có với các giá trị hiện tại
        applyFiltersAutomatic(selectedtag, selectedLevels, priceRange, rating, sortBy);
    };

    // Thêm hàm updateFiltersAndSearch để hỗ trợ applyFilterFromHistory
    const updateFiltersAndSearch = () => {
        // Cập nhật URL và thực hiện tìm kiếm
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

        // Tạo đối tượng params cho tìm kiếm
        const searchObj = {
            query: query || '',
            tags: selectedtag,
            levels: selectedLevels,
            priceRange: priceRange,
            rating: rating,
            sortBy: sortBy,
            page: 1,
            limit: 12
        };

        searchCourses(searchObj);
    };

    // Lấy danh sách khóa học từ Redux (luôn đồng bộ với state.search.courses)

    // Biến trung gian xác định danh sách khóa học hiển thị
    const hasSearchResult = data && data.data && Array.isArray(data.data.courses) && data.data.courses.length > 0;
    const isFilterActive = isAnyFilterApplied();
    //   displayedCourses = (isFilterActive && hasSearchResult) ? data.data.courses : courses;


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
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                        <h3 className="text-xl font-bold mb-4"></h3>
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
                {(loading || searchLoading) && courses?.length === 0 && (
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
                    {!loading && !searchLoading && displayedCourses?.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-500 text-lg">
                                No suitable course found</p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={(displayedCourses || []).length}
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
                                {displayedCourses?.map(course => (
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