import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchService } from '../../services/fetch.service';
import { IEmployee } from '../../../shared/types';

export interface IEmployeesState {
  employees: IEmployee[];
  loading: boolean;
  error?: string;
}

// Определение начального состояния
const initialState: IEmployeesState = {
  employees: [],
  loading: false,
};

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  // Здесь может быть ваш код для выполнения асинхронного запроса
  const fetchStore = new FetchService({ method: 'GET', routeInfo: { route: '/employees' } });
  const result = await fetchStore.sendRequest<IEmployee[]>();
  return result;
});

// Создание среза (slice) для employees
const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    receivedEmployees: (state, action: PayloadAction<IEmployee[]>) => {
      return { ...state, employees: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { receivedEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
