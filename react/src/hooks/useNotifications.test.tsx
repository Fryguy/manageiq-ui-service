import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useNotifications } from './useNotifications';
import uiReducer from '../store/uiSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createMockStore()}>{children}</Provider>
);

describe('useNotifications', () => {
  it('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    expect(result.current.notifications).toEqual([]);
  });

  it('should show success notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showSuccess({
        title: 'Success',
        message: 'Operation completed',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].kind).toBe('success');
    expect(result.current.notifications[0].title).toBe('Success');
    expect(result.current.notifications[0].message).toBe('Operation completed');
  });

  it('should show error notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showError({
        title: 'Error',
        message: 'Operation failed',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].kind).toBe('error');
    expect(result.current.notifications[0].title).toBe('Error');
  });

  it('should show warning notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showWarning({
        title: 'Warning',
        message: 'Be careful',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].kind).toBe('warning');
  });

  it('should show info notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showInfo({
        title: 'Info',
        message: 'FYI',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].kind).toBe('info');
  });

  it('should dismiss notification by id', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    let notificationId: string;
    act(() => {
      notificationId = result.current.showSuccess({
        title: 'Success',
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.dismiss(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should dismiss all notifications', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showSuccess({ title: 'Success 1' });
      result.current.showSuccess({ title: 'Success 2' });
      result.current.showError({ title: 'Error 1' });
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.dismissAll();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should set dismissible flag', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showSuccess({
        title: 'Success',
        dismissible: false,
      });
    });

    expect(result.current.notifications[0].dismissible).toBe(false);
  });

  it('should default dismissible to true', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.showSuccess({
        title: 'Success',
      });
    });

    expect(result.current.notifications[0].dismissible).toBe(true);
  });

  it('should generate unique ids for notifications', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    let id1: string = '';
    let id2: string = '';

    act(() => {
      id1 = result.current.showSuccess({ title: 'Success 1' });
      id2 = result.current.showSuccess({ title: 'Success 2' });
    });

    expect(id1).not.toBe(id2);
    expect(result.current.notifications).toHaveLength(2);
  });
});
