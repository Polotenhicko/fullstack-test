import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepartment } from '../../../shared/types';

// Определение начального состояния
const initialState: IDepartment[] = [];

// Создание среза (slice) для employees
const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    receivedDepartments: (state, action: PayloadAction<IDepartment[]>) => {
      return action.payload;
    },
  },
});

export const { receivedDepartments } = departmentsSlice.actions;
export default departmentsSlice.reducer;
