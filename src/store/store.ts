import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import departmentReducer from './slices/departmentSlice';
import thunk from 'redux-thunk';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
