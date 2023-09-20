import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmployee } from './../../../../shared/types';
import { FetchService } from 'store/services/fetch.service';
import { addErrorNotification, addInfoNotification, addSuccessNotification } from './notifycationsSlice';

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

export interface IUpdateEmployee {
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

export const createEmployee = createAsyncThunk<void, Record<string, string>>(
  'employees/createEmployee',
  async (employeeRow, thunkApi) => {
    thunkApi.dispatch(addInfoNotification('Loading employee creation...'));

    try {
      const fetchStore = new FetchService({
        method: 'POST',
        routeInfo: {
          route: '/employees',
        },
        body: employeeRow,
      });

      const result = await fetchStore.sendRequest<TAddEmployeesResult>();
      thunkApi.dispatch(addSuccessNotification('Employee has been successfully created!'));
    } catch (e: any) {
      console.error(e.message);
      thunkApi.dispatch(addErrorNotification('An error occurred while creating an employee!'));
    }
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
});

export const { clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
