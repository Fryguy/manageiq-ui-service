import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addNotification,
  removeNotification,
  clearNotifications,
  Notification,
} from '../store/uiSlice';

export interface NotificationOptions {
  title: string;
  message?: string;
  dismissible?: boolean;
}

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  const showNotification = useCallback(
    (kind: Notification['kind'], options: NotificationOptions) => {
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        kind,
        title: options.title,
        message: options.message,
        dismissible: options.dismissible ?? true,
      };
      dispatch(addNotification(notification));
      return notification.id;
    },
    [dispatch]
  );

  const showSuccess = useCallback(
    (options: NotificationOptions) => showNotification('success', options),
    [showNotification]
  );

  const showError = useCallback(
    (options: NotificationOptions) => showNotification('error', options),
    [showNotification]
  );

  const showWarning = useCallback(
    (options: NotificationOptions) => showNotification('warning', options),
    [showNotification]
  );

  const showInfo = useCallback(
    (options: NotificationOptions) => showNotification('info', options),
    [showNotification]
  );

  const dismiss = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const dismissAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
    dismissAll,
  };
};
