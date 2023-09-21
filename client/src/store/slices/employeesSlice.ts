import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmployee } from './../../../../shared/types';
import { FetchService } from 'store/services/fetch.service';
import { addNotification, ENotificationStatus } from './notifycationsSlice';
import notificationService from 'store/services/notifications.service';

export interface IEmployeesState {
  employees: IEmployee[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
}

export interface IFetchEmployeesResult {
  employees: IEmployee[];
  hasMore: boolean;
}

export interface IAddEmployeesResult {
  employee: IEmployee;
}

export interface IDeleteEmployeeResult {
  employeeId: IEmployee['employeeId'];
  isDeleted: boolean;
  error?: string;
}

export interface IUpdateEmployee {
  employeeId: IEmployee['employeeId'];
  fields: {
    [T in keyof IEmployee]?: IEmployee[T];
  };
}

interface IUpdateEmployeesSuccessResult {
  employee: IEmployee;
}

interface IUpdateEmployeesErrorResult {
  error: string;
}

type TUpdateEmployeesResult = IUpdateEmployeesErrorResult | IUpdateEmployeesSuccessResult;

const initialState: IEmployeesState = {
  employees: [],
  hasMore: true,
  loading: false,
};

export const fetchEmployees = createAsyncThunk<IFetchEmployeesResult, { startRow: number; endRow: number }>(
  'employees/fetchEmployees',
  async ({ startRow, endRow }, thunkApi) => {
    try {
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

      const result = await fetchStore.sendRequest<IFetchEmployeesResult>();

      return result;
    } catch (e: any) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while fetching an employee!',
          status: ENotificationStatus['error'],
        }),
      );

      return {
        employees: [],
        hasMore: false,
      };
    }
  },
);

export const createEmployee = createAsyncThunk<void, Record<string, string>>(
  'employees/createEmployee',
  async (employeeRow, thunkApi) => {
    thunkApi.dispatch(
      addNotification({
        message: 'Loading employee creation...',
        status: ENotificationStatus['info'],
      }),
    );

    try {
      const fetchStore = new FetchService({
        method: 'POST',
        routeInfo: {
          route: '/employees',
        },
        body: employeeRow,
      });

      const result = await fetchStore.sendRequest<IAddEmployeesResult>(true);

      thunkApi.dispatch(
        addNotification({
          message: 'Employee has been successfully created!',
          status: ENotificationStatus['success'],
        }),
      );
    } catch (e: any) {
      console.error(e.message);
      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while creating an employee!',
          status: ENotificationStatus['error'],
        }),
      );
    }
  },
);

export const deleteEmployee = createAsyncThunk<boolean, IEmployee['employeeId'][]>(
  'employees/deleteEmployee',
  async (employeeIds, thunkApi) => {
    try {
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

      thunkApi.dispatch(
        addNotification({
          message: 'Employee has been successfully deleted!',
          status: ENotificationStatus['success'],
        }),
      );

      return true;
    } catch (e: any) {
      console.error(e.message);
      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while deleting an employee!',
          status: ENotificationStatus['error'],
        }),
      );
      return false;
    }
  },
);

export const updateEmployee = createAsyncThunk<TUpdateEmployeesResult, IUpdateEmployee>(
  'employees/updateEmployee',
  async ({ employeeId, fields }, thunkApi) => {
    try {
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

      thunkApi.dispatch(
        addNotification({
          message: 'Employee has been successfully updated!',
          status: ENotificationStatus['success'],
        }),
      );

      return result;
    } catch (e: any) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while updating an employee!',
          status: ENotificationStatus['error'],
        }),
      );

      return { error: e.message };
    }
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
