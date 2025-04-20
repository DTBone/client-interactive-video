import { createSlice } from '@reduxjs/toolkit';
import { fetchCourses } from './action';

const initialState = {
    query: '',
    filters: {
        tags: [],
        levels: [],
        priceRange: [0, Number.MAX_VALUE],
        rating: 0,
        sortBy: '',
    },
    currentPage: 1,
    isFilterApplied: false,
    courses: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalCount: 0,
    hasMore: true,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;

        },
        setTags: (state, action) => {
            state.filters.tags = action.payload;
            state.isFilterApplied = true;
            state.currentPage = 1;
        },
        setLevels: (state, action) => {
            state.filters.levels = action.payload;
            state.isFilterApplied = true;
            state.currentPage = 1;
        },
        setPriceRangeSlice: (state, action) => {
            if (Array.isArray(action.payload) && action.payload.length === 2 &&
                !isNaN(action.payload[0]) && !isNaN(action.payload[1])) {
                state.filters.priceRange = action.payload;
            } else {
                console.warn('Invalid price range format:', action.payload);
                // Giữ nguyên giá trị cũ nếu dữ liệu không hợp lệ
            }
            state.isFilterApplied = true;
            state.currentPage = 1;
        },
        setRatingSlice: (state, action) => {
            state.filters.rating = action.payload;
            state.isFilterApplied = true;
            state.currentPage = 1;
        },
        setSortBySlice: (state, action) => {
            state.filters.sortBy = action.payload;
            state.isFilterApplied = true;
        },
        setCurrentPageSlice: (state, action) => {
            state.currentPage = action.payload;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.isFilterApplied = false;
            state.currentPage = 1;
        },
        setAllFilters: (state, action) => {
            state.filters = action.payload;
            state.isFilterApplied = true;
            state.currentPage = 1;
        },
        resetQeury: (state) => {
            state.query = '';
        },
        // Trong searchSlice reducers
        resetSearch: (state) => {
            state.courses = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.totalPages = 0;
            state.totalCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                // Truy cập dữ liệu theo cấu trúc mới
                let newCourses = Array.isArray(action.payload?.data?.courses)
                    ? action.payload.data.courses
                    : [];
                // Nếu API trả về 1 object thay vì array (trường hợp chỉ có 1 khóa học)
                if (!Array.isArray(newCourses) && newCourses && typeof newCourses === 'object') {
                    newCourses = [newCourses];
                }
                // Truy cập thông tin phân trang từ đối tượng pagination
                const pagination = action.payload?.data?.pagination || {};
                const currentRequestPage = pagination.currentPage || 1;
                // Cập nhật danh sách khóa học
                if (currentRequestPage === 1) {
                    state.courses = newCourses;
                } else {
                    if (!Array.isArray(state.courses)) {
                        state.courses = [];
                    }
                    state.courses = [...state.courses, ...newCourses];
                }
                // Cập nhật thông tin phân trang từ object pagination mới
                state.currentPage = pagination.currentPage || 1;
                state.totalPages = pagination.totalPages || 0;
                state.totalCount = pagination.totalCount || 0;
                // Sử dụng hasNextPage trực tiếp nếu có, nếu không thì tính toán từ currentPage và totalPages
                state.hasMore = pagination.hasNextPage !== undefined 
                    ? pagination.hasNextPage 
                    : (pagination.currentPage || 0) < (pagination.totalPages || 0);
                // Log để debug
                console.log('hasMore updated:', state.hasMore);
                console.log('pagination info:', pagination);
                console.log('courses updated:', state.courses);
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { setSearchQuery,
    setTags,
    setLevels,
    setPriceRangeSlice,
    setRatingSlice,
    setSortBySlice,
    setCurrentPage,
    resetFilters,
    setAllFilters,
    resetQeury
} = searchSlice.actions;
export default searchSlice.reducer;