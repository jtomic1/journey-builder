import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { GraphSlice } from './graph-slice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

const rootReducer = combineReducers({
  graph: GraphSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
