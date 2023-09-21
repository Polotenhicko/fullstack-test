import { useAppDispatch, useAppSelector } from 'store/store';
import { useEffect } from 'react';
import { removeNotification } from 'store/slices/notifycationsSlice';
import { Alert, Snackbar } from '@mui/material';

export function Alerts() {
  const notifications = useAppSelector((state) => state.notifications); // Замените на ваш срез уведомлений
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeouts = notifications.map((notify) => setTimeout(() => dispatch(removeNotification(notify.id)), 5e3));

    return () => {
      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [dispatch, notifications]);

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <Snackbar open={true}>
      <div>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            onClose={() => handleClose(notification.id)}
            severity={notification.status}
            style={{ marginBottom: '10px', whiteSpace: 'pre-line' }}
          >
            {notification.message}
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
}
