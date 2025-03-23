import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    filters: {
        categories: [],
        levels: [],
        priceRange: [0, Number.MAX_VALUE],
        rating: 0,
        sortBy: '',
    },
    currentPage: 1,
    isFilterApplied: false
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        setCategories: (state, action) => {
            state.filters.categories = action.payload;
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
        }
    }
});

export const { setSearchQuery,
    setCategories,
    setLevels,
    setPriceRangeSlice,
    setRatingSlice,
    setSortBySlice,
    setCurrentPage,
    resetFilters,
    setAllFilters
} = searchSlice.actions;
export default searchSlice.reducer;