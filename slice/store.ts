import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
const store = configureStore({
  reducer: {
    slice:appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
