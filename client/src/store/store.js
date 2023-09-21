import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import departmentReducer from './slices/departmentSlice';
import notificationsReducer from './slices/notifycationsSlice';
import thunk from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
