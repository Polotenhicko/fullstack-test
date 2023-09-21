import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FetchService } from 'store/services/fetch.service';
import { addNotification } from './notifycationsSlice';

export const fetchDepartments = createAsyncThunk(
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

      const result = await fetchStore.sendRequest();

      return result;
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while fetching a department!\n' + e.message,
          status: 'error',
        }),
      );

      return {
        departments: [],
        hasMore: false,
      };
    }
  },
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentRow, thunkApi) => {
    thunkApi.dispatch(
      addNotification({
        message: 'Loading department creation...',
        status: 'info',
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

      const result = await fetchStore.sendRequest();

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully created!',
          status: 'success',
        }),
      );
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while creating a department!\n' + e.message,
          status: 'error',
        }),
      );
    }
  },
);

export const deleteDepartments = createAsyncThunk(
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

      const result = await Promise.all(fetchStores.map((store) => store.sendRequest()));

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully deleted!',
          status: 'success',
        }),
      );

      return true;
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while deleting a department!\n' + e.message,
          status: 'error',
        }),
      );

      return false;
    }
  },
);

export const updateDepartment = createAsyncThunk(
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

      const result = await fetchStore.sendRequest();

      thunkApi.dispatch(
        addNotification({
          message: 'Department has been successfully updated!',
          status: 'success',
        }),
      );

      return result;
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while updating a department!\n' + e.message,
          status: 'error',
        }),
      );

      return e.message;
    }
  },
);

const initialState = {
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
