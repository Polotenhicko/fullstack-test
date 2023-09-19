import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmployee } from 'shared/types';
import { DEFAULT_LIMIT } from '../../constants/tables';
import { FetchService } from 'store/services/fetch.service';

export interface IEmployeesState {
  employees: IEmployee[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
}

export type TFetchEmployeesResult = {
  employees: IEmployee[];
  hasMore: boolean;
};

export type TAddEmployeesResult = {
  employee: IEmployee;
};

export type IDeleteEmployeeResult = {
  employeeId: IEmployee['employeeId'];
  isDeleted: boolean;
  error?: string;
};

interface IUpdateEmployee {
  employeeId: IEmployee['employeeId'];
  fields: {
    [T in keyof IEmployee]?: IEmployee[T];
  };
}

export type TUpdateEmployeesResult = {
  employee: IEmployee;
  error?: string;
};

const initialState: IEmployeesState = {
  employees: [],
  hasMore: true,
  loading: false,
};

export const fetchEmployees = createAsyncThunk<TFetchEmployeesResult, { startRow: number; endRow: number }>(
  'employees/fetchEmployees',
  async ({ startRow, endRow }, thunkApi) => {
    const fetchStore = new FetchService({
      method: 'GET',
      routeInfo: {
        route: '/employees',
        searchParams: {
          limit: String(endRow - startRow),
          offset: String(startRow),
        },
      },
    });

    const result = await fetchStore.sendRequest<TFetchEmployeesResult>();

    return result;
  },
);

export const createEmployee = createAsyncThunk<TAddEmployeesResult, Record<string, string>>(
  'employees/createEmployee',
  async (employeeRow, thunkApi) => {
    const fetchStore = new FetchService({
      method: 'POST',
      routeInfo: {
        route: '/employees',
      },
      body: employeeRow,
    });

    const result = await fetchStore.sendRequest<TAddEmployeesResult>();
    return result;
  },
);

export const deleteEmployee = createAsyncThunk<boolean, IEmployee['employeeId'][]>(
  'employees/deleteEmployee',
  async (employeeIds, thunkApi) => {
    const fetchStores = employeeIds.map(
      (id) =>
        new FetchService({
          method: 'DELETE',
          routeInfo: {
            route: '/employees',
            params: {
              employeeId: String(id),
            },
          },
        }),
    );

    const result = await Promise.allSettled(
      fetchStores.map((store) => store.sendRequest<IDeleteEmployeeResult>()),
    );

    return true;
  },
);

export const updateEmployee = createAsyncThunk<TUpdateEmployeesResult, IUpdateEmployee>(
  'employees/updateEmployee',
  async ({ employeeId, fields }, thunkApi) => {
    const fetchStore = new FetchService({
      method: 'PATCH',
      routeInfo: {
        route: '/employees',
        params: {
          employeeId: String(employeeId),
        },
      },
      body: fields,
    });

    const result = await fetchStore.sendRequest<TUpdateEmployeesResult>();
    return result;
  },
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployees: (state) => {
      return { ...state, employees: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.hasMore = action.payload.hasMore;

        const newEmployees = action.payload.employees.map((employee) => ({ ...employee }));
        state.employees = [...state.employees, ...newEmployees];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
