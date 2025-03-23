import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import logger from 'redux-logger';
import searchCourseAPI from './slices/SearchCourseForUser/searchCourseAPI';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    //     logger,
    //     searchCourseAPI.middleware
    // ),
    //devTools: process.env.NODE_ENV !== 'production',

    //note
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', ...Object.values(searchCourseAPI.endpoints)
                    .flatMap(endpoint => [endpoint.matchPending, endpoint.matchFulfilled, endpoint.matchRejected]
                        .filter(Boolean)
                        .map(matcher => matcher.type))],
            }
        })
            .concat(logger, searchCourseAPI.middleware)
            .concat(logger)

});
setupListeners(store.dispatch);
export default store;