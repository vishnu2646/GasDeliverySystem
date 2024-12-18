import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './reducers/stocks';

const store = configureStore({
    reducer: {
        stocks: stocksReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store

export default store;
