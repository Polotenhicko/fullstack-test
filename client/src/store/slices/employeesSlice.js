import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FetchService } from 'store/services/fetch.service';
import { addNotification } from './notifycationsSlice';

const initialState = {
  employees: [],
  hasMore: true,
  loading: false,
};

export const fetchEmployees = createAsyncThunk(
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

      const result = await fetchStore.sendRequest();

      return result;
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while fetching an employee!\n' + e.message,
          status: 'error',
        }),
      );

      return {
        employees: [],
        hasMore: false,
      };
    }
  },
);

export const createEmployee = createAsyncThunk('employees/createEmployee', async (employeeRow, thunkApi) => {
  thunkApi.dispatch(
    addNotification({
      message: 'Loading employee creation...',
      status: 'info',
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

    const result = await fetchStore.sendRequest(true);

    thunkApi.dispatch(
      addNotification({
        message: 'Employee has been successfully created!',
        status: 'success',
      }),
    );
  } catch (e) {
    console.error(e.message);
    thunkApi.dispatch(
      addNotification({
        message: 'An error occurred while creating an employee!\n' + e.message,
        status: 'error',
      }),
    );
  }
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (employeeIds, thunkApi) => {
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

    const result = await Promise.allSettled(fetchStores.map((store) => store.sendRequest()));

    thunkApi.dispatch(
      addNotification({
        message: 'Employee has been successfully deleted!',
        status: 'success',
      }),
    );

    return true;
  } catch (e) {
    console.error(e.message);
    thunkApi.dispatch(
      addNotification({
        message: 'An error occurred while deleting an employee!\n' + e.message,
        status: 'error',
      }),
    );
    return false;
  }
});

export const updateEmployee = createAsyncThunk(
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

      const result = await fetchStore.sendRequest();

      thunkApi.dispatch(
        addNotification({
          message: 'Employee has been successfully updated!',
          status: 'success',
        }),
      );

      return result;
    } catch (e) {
      console.error(e.message);

      thunkApi.dispatch(
        addNotification({
          message: 'An error occurred while updating an employee!\n' + e.message,
          status: 'error',
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
