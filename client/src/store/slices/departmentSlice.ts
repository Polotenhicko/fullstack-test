import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepartment } from './../../../../shared/types';
import { FetchService } from 'store/services/fetch.service';
import { addNotification, ENotificationStatus } from './notifycationsSlice';

export interface IDepartmentsState {
  departments: IDepartment[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
}

export interface IFetchDepartmentsResult {
  departments: IDepartment[];
  hasMore: boolean;
}

export interface IAddDepartmentResult {
  department: IDepartment;
}

export interface IDeleteDepartmentResult {
  departmentId: IDepartment['departmentId'];
  isDeleted: boolean;
  error?: string;
}

export interface IUpdateDepartment {
  departmentId: IDepartment['departmentId'];
  fields: {
    [T in keyof IDepartment]?: IDepartment[T];
  };
}

export interface IUpdateDepartmentSuccessResult {
  department: IDepartment;
}

export interface IUpdateDepartmentErrorResult {
  error: string;
}

export type IUpdateDepartmentResult = IUpdateDepartmentSuccessResult | IUpdateDepartmentErrorResult;

export const fetchDepartments = createAsyncThunk<IFetchDepartmentsResult, { startRow: number; endRow: number }>(
  'departments/fetchDepartments',
  async ({ startRow, endRow }, thunkApi) => {
    try {
      const fetchStore = new FetchService({
        method: 'GET',
        routeInfo: {
          route: '/departments',
          searchParams: {
            limit: String(endRow - startRow),
            offset: String(startRow),
          },
        },
      });

      const result = await fetchStore.sendRequest<IFetchDepartmentsResult>();

      return result;
    } catch (e: any) {
      console.error(e.message);
      return {
        departments: [],
        hasMore: false,
      };
    }
  },
);

export const createDepartment = createAsyncThunk<void, Record<string, string>>(
  'departments/createDepartment',
  async (departmentRow, thunkApi) => {
    thunkApi.dispatch(
      addNotification({
        message: 'Loading department creation...',
        status: ENotificationStatus['info'],
      }),
    );

    try {
      const fetchStore = new FetchService({
        method: 'POST',
        routeInfo: {
          route: '/departments',
        },
        body: departmentRow,
      });

      const result = await fetchStore.sendRequest<IAddDepartmentResult>();

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully created!',
          status: ENotificationStatus['success'],
        }),
      );
    } catch (e: any) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while creating an department!',
          status: ENotificationStatus['error'],
        }),
      );
    }
  },
);

export const deleteDepartments = createAsyncThunk<boolean, IDepartment['departmentId'][]>(
  'departments/deleteDepartments',
  async (departmentIds, thunkApi) => {
    try {
      const fetchStores = departmentIds.map(
        (id) =>
          new FetchService({
            method: 'DELETE',
            routeInfo: {
              route: '/departments',
              params: {
                departmentId: String(id),
              },
            },
          }),
      );

      const result = await Promise.all(fetchStores.map((store) => store.sendRequest<IDeleteDepartmentResult>()));

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully deleted!',
          status: ENotificationStatus['success'],
        }),
      );

      return true;
    } catch (e: any) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while deleting an department!',
          status: ENotificationStatus['error'],
        }),
      );

      return false;
    }
  },
);

export const updateDepartment = createAsyncThunk<IUpdateDepartmentResult, IUpdateDepartment>(
  'departments/updateDepartment',
  async ({ departmentId, fields }, thunkApi) => {
    try {
      const fetchStore = new FetchService({
        method: 'PATCH',
        routeInfo: {
          route: '/departments',
          params: {
            departmentId: String(departmentId),
          },
        },
        body: fields,
      });

      const result = await fetchStore.sendRequest<IUpdateDepartmentResult>();

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully updated!',
          status: ENotificationStatus['success'],
        }),
      );

      return result;
    } catch (e: any) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while updating an department!',
          status: ENotificationStatus['error'],
        }),
      );

      return e.message;
    }
  },
);

const initialState: IDepartmentsState = {
  departments: [],
  hasMore: true,
  loading: false,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearDepartments: (state) => {
      return { ...state, departments: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.hasMore = action.payload.hasMore;

        const newDepartments = action.payload.departments.map((departments) => ({ ...departments }));
        state.departments = [...state.departments, ...newDepartments];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDepartments } = departmentsSlice.actions;
export default departmentsSlice.reducer;
