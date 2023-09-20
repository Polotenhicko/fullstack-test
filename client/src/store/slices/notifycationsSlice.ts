import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ENotificationStatus {
  'success' = 'success',
  'error' = 'error',
  'info' = 'info',
  'warning' = 'warning',
}

export interface INotification {
  id: number;
  message: string;
  status: ENotificationStatus; // Используйте тип-перечисление здесь
}

const initialState: INotification[] = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addInfoNotification: (state, action: PayloadAction<INotification['message']>) => {
      state.push({
        id: new Date().getTime(),
        message: action.payload,
        status: ENotificationStatus['info'],
      });
    },
    addSuccessNotification: (state, action: PayloadAction<INotification['message']>) => {
      state.push({
        id: new Date().getTime(),
        message: action.payload,
        status: ENotificationStatus['success'],
      });
    },
    addErrorNotification: (state, action: PayloadAction<INotification['message']>) => {
      state.push({
        id: new Date().getTime(),
        message: action.payload,
        status: ENotificationStatus['error'],
      });
    },
    removeNotification: (state, action: PayloadAction<INotification['id']>) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addErrorNotification, addInfoNotification, addSuccessNotification, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
