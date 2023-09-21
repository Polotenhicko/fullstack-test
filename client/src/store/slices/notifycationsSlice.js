import { createSlice } from '@reduxjs/toolkit';
import notificationService from 'store/services/notifications.service';

const initialState = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.push({
        id: action.payload.id ?? notificationService.maxId,
        message: action.payload.message,
        status: action.payload.status,
      });
    },
    removeNotification: (state, action) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
