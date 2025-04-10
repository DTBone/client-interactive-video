import axiosInstance from '~/Config/axiosInstance';
import { createApi } from '@reduxjs/toolkit/query/react';
const axiosBaseQuery = () => async ({ url, method, data, params }) => {
    try {
        const result = await axiosInstance({
            url,
            method,
            data,
            params
        });
        return { data: result.data };

    } catch (axiosError) {
        const err = axiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        };
    }
};

export const searchCourseAPI = createApi({
    reducerPath: 'searchCourseAPI',
    baseQuery: axiosBaseQuery(),
    keepUnusedDataFor: 300, // Giữ dữ liệu trong 5 phút
    refetchOnMountOrArgChange: true, // Refetch khi component được mount lại
    tagTypes: ['Courses'], // Tags cho cache invalidation
    endpoints: (builder) => ({
        searchCourses: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (typeof params === 'string') {
                    queryParams.append('q', params);
                    queryParams.append('page', 1);
                    queryParams.append('limit', 9);
                    return {
                        url: `/search?${queryParams.toString()}`,
                        method: 'GET',
                    };
                }

                if (params && typeof params === 'object') {

                    if (params.query) {
                        queryParams.append('q', params.query);
                    }
                    if (params.tags && params.tags.length > 0) {
                        queryParams.append('tags', params.tags.join(','));
                    }

                    if (params.levels && params.levels.length > 0) {
                        queryParams.append('levels', params.levels.join(','));
                    }

                    if (params.priceRange) {
                        queryParams.append('minPrice', params.priceRange[0]);
                        queryParams.append('maxPrice', params.priceRange[1]);
                    }

                    if (params.rating) {
                        queryParams.append('rating', params.rating);
                    }

                    if (params.sortBy) {
                        queryParams.append('sort', params.sortBy);
                    }

                    queryParams.append('page', params.page || 1);
                    queryParams.append('limit', params.limit || 9);

                    return {
                        url: `/search?${queryParams.toString()}`,
                        method: 'GET'
                    };
                }

            },
            transformResponse: (response) => {
                if (Array.isArray(response)) {
                    return {
                        courses: response || [],
                        total: response.length,
                        totalPages: 1,
                        currentPage: 1

                    }
                } else {
                    return {
                        courses: response.courses || [],
                        total: response.total || 0,
                        totalPages: response.totalPages || 1,
                        currentPage: response.currentPage || 1
                    }
                }
            }
        }),
        getTags: builder.query({
            query: () => ({
                url: '/search/tags',
                method: 'GET'
            }),
            transformResponse: (response) => response.tags || []
        }),

        getLevels: builder.query({
            query: () => ({
                url: '/search/levels',
                method: 'GET'
            }),
            transformResponse: (response) => response.levels || []
        }),
    }),

});

export const { useSearchCoursesQuery, useGetTagsQuery, useGetLevelsQuery } = searchCourseAPI;

export const useLazySearchCoursesQuery = searchCourseAPI.endpoints.searchCourses.useLazyQuery;
export default searchCourseAPI;