import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepartment } from './../../../../shared/types';
import { FetchService } from 'store/services/fetch.service';

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

export interface IUpdateDepartmentResult {
  department: IDepartment;
  error?: string;
}

export const fetchDepartments = createAsyncThunk<IFetchDepartmentsResult, { startRow: number; endRow: number }>(
  'departments/fetchDepartments',
  async ({ startRow, endRow }, thunkApi) => {
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
  },
);

export const createDepartment = createAsyncThunk<IAddDepartmentResult, Record<string, string>>(
  'departments/createDepartment',
  async (departmentRow, thunkApi) => {
    const fetchStore = new FetchService({
      method: 'POST',
      routeInfo: {
        route: '/departments',
      },
      body: departmentRow,
    });

    const result = await fetchStore.sendRequest<IAddDepartmentResult>();
    return result;
  },
);

export const deleteDepartments = createAsyncThunk<boolean, IDepartment['departmentId'][]>(
  'departments/deleteDepartments',
  async (departmentIds, thunkApi) => {
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

    const result = await Promise.allSettled(
      fetchStores.map((store) => store.sendRequest<IDeleteDepartmentResult>()),
    );

    return true;
  },
);

export const updateDepartment = createAsyncThunk<IUpdateDepartmentResult, IUpdateDepartment>(
  'departments/updateDepartment',
  async ({ departmentId, fields }, thunkApi) => {
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
    return result;
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
    clearDepartments: (state, action: PayloadAction<IDepartment[]>) => {
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
