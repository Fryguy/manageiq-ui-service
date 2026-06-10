import { renderHook, act, waitFor } from '@testing-library/react';
import { usePolling, usePollingUntil } from './usePolling';

jest.useFakeTimers();

describe('usePolling', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should call callback at specified interval when enabled', async () => {
    const callback = jest.fn();
    const interval = 1000;

    renderHook(() => usePolling(callback, { interval, enabled: true }));

    // Initial call
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    // After first interval
    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

    // After second interval
    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(3));
  });

  it('should not call callback when disabled', () => {
    const callback = jest.fn();
    const interval = 1000;

    renderHook(() => usePolling(callback, { interval, enabled: false }));

    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should stop polling when enabled changes to false', async () => {
    const callback = jest.fn();
    const interval = 1000;

    const { rerender } = renderHook(
      ({ enabled }) => usePolling(callback, { interval, enabled }),
      { initialProps: { enabled: true } }
    );

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    // Disable polling
    rerender({ enabled: false });

    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });

    // Should not have been called again
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should start polling when enabled changes to true', async () => {
    const callback = jest.fn();
    const interval = 1000;

    const { rerender } = renderHook(
      ({ enabled }) => usePolling(callback, { interval, enabled }),
      { initialProps: { enabled: false } }
    );

    act(() => {
      jest.advanceTimersByTime(interval * 2);
    });

    expect(callback).not.toHaveBeenCalled();

    // Enable polling
    rerender({ enabled: true });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));
  });

  it('should handle async callbacks', async () => {
    const callback = jest.fn().mockResolvedValue(undefined);
    const interval = 1000;

    renderHook(() => usePolling(callback, { interval, enabled: true }));

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));
  });

  it('should call onError when callback throws', async () => {
    const error = new Error('Test error');
    const callback = jest.fn().mockRejectedValue(error);
    const onError = jest.fn();
    const interval = 1000;

    renderHook(() => usePolling(callback, { interval, enabled: true, onError }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith(error));
  });

  it('should continue polling after error', async () => {
    const error = new Error('Test error');
    const callback = jest.fn().mockRejectedValue(error);
    const onError = jest.fn();
    const interval = 1000;

    renderHook(() => usePolling(callback, { interval, enabled: true, onError }));

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));
  });

  it('should cleanup on unmount', async () => {
    const callback = jest.fn();
    const interval = 1000;

    const { unmount } = renderHook(() => usePolling(callback, { interval, enabled: true }));

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    unmount();

    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });

    // Should not have been called again after unmount
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('usePollingUntil', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should stop polling when condition is met', async () => {
    let count = 0;
    const callback = jest.fn(() => {
      count++;
      return count >= 3;
    });
    const interval = 1000;

    renderHook(() => usePollingUntil(callback, { interval, enabled: true }));

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(3));

    // Should stop polling after condition is met
    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should stop polling after maxAttempts', async () => {
    const callback = jest.fn(() => false);
    const onError = jest.fn();
    const interval = 1000;
    const maxAttempts = 3;

    renderHook(() =>
      usePollingUntil(callback, { interval, enabled: true, maxAttempts, onError })
    );

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(3));

    // Should stop after maxAttempts
    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });
    expect(callback).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Polling stopped after 3 attempts',
      })
    );
  });

  it('should handle async callbacks', async () => {
    let count = 0;
    const callback = jest.fn(async () => {
      count++;
      return count >= 2;
    });
    const interval = 1000;

    renderHook(() => usePollingUntil(callback, { interval, enabled: true }));

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(interval);
    });
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

    // Should stop after condition is met
    act(() => {
      jest.advanceTimersByTime(interval * 2);
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should call onError and stop polling when callback throws', async () => {
    const error = new Error('Test error');
    const callback = jest.fn().mockRejectedValue(error);
    const onError = jest.fn();
    const interval = 1000;

    renderHook(() => usePollingUntil(callback, { interval, enabled: true, onError }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith(error));

    // Should stop polling after error
    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not poll when disabled', () => {
    const callback = jest.fn(() => false);
    const interval = 1000;

    renderHook(() => usePollingUntil(callback, { interval, enabled: false }));

    act(() => {
      jest.advanceTimersByTime(interval * 3);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
