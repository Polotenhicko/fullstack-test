import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import notificationService from 'store/services/notifications.service';

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

interface IAddNotification {
  id?: INotification['id'];
  message: INotification['message'];
  status: ENotificationStatus;
}

const initialState: INotification[] = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<IAddNotification>) => {
      state.push({
        id: action.payload.id ?? notificationService.maxId,
        message: action.payload.message,
        status: action.payload.status,
      });
    },
    removeNotification: (state, action: PayloadAction<INotification['id']>) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
