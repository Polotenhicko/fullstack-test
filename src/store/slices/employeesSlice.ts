import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchService } from '../../services/fetch.service';
import { IEmployee } from '../../../shared/types';
import { DEFAULT_LIMIT } from '../../constants/tables';

export interface IEmployeesState {
  employees: IEmployee[];
  loading: boolean;
  offset: number;
  limit: number;
  hasMore: boolean;
  error?: string;
}

type TFetchEmployees = {
  data: IEmployee[];
  hasMore: boolean;
};

export type TFetchEmployeesResult = {
  employees: IEmployee[];
  hasMore: boolean;
};

// Определение начального состояния
const initialState: IEmployeesState = {
  employees: [],
  offset: 0,
  hasMore: true,
  loading: false,
  limit: DEFAULT_LIMIT,
};

export const fetchEmployees = createAsyncThunk<TFetchEmployeesResult, { startRow: number; endRow: number }>(
  'employees/fetchEmployees',
  async ({ startRow, endRow }, thunkApi) => {
    const currentState = thunkApi.getState() as { employees: IEmployeesState }; // Получаем offset и limit из состояния Redux
    const { offset, limit } = currentState.employees;
    // Здесь может быть ваш код для выполнения асинхронного запроса

    const fetchStore = new FetchService({
      method: 'GET',
      routeInfo: {
        route: '/employees',
        searchParams: {
          limit: startRow && endRow ? String(endRow - startRow) : String(limit),
          offset: startRow && endRow ? String(startRow) : String(offset),
        },
      },
    });
    await new Promise<void>((r) => setTimeout(() => r(), 1e3));
    const { data, hasMore } = await fetchStore.sendRequest<TFetchEmployees>();
    return { employees: data, hasMore };
  },
);

// Создание среза (slice) для employees
const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    receivedEmployees: (state, action: PayloadAction<IEmployee[]>) => {
      return { ...state, employees: [...state.employees, ...action.payload] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.offset += DEFAULT_LIMIT;
        state.hasMore = action.payload.hasMore;
        state.employees = [...state.employees, ...action.payload.employees];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { receivedEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
