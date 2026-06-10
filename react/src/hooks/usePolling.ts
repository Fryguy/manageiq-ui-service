import { useEffect, useRef, useCallback } from 'react';

export interface PollingOptions {
  interval: number; // milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Hook for polling a function at regular intervals
 * @param callback - Function to call on each poll
 * @param options - Polling configuration
 */
export const usePolling = (
  callback: () => void | Promise<void>,
  options: PollingOptions
) => {
  const { interval, enabled = true, onError } = options;
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // Update callback ref when it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clearPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  const poll = useCallback(async () => {
    if (!isPollingRef.current) {
      return;
    }

    try {
      await savedCallback.current();
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }

    // Schedule next poll if still enabled
    if (isPollingRef.current) {
      timeoutRef.current = setTimeout(poll, interval);
    }
  }, [interval, onError]);

  const startPolling = useCallback(() => {
    if (!isPollingRef.current) {
      isPollingRef.current = true;
      poll();
    }
  }, [poll]);

  const stopPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  // Start/stop polling based on enabled flag
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    startPolling,
    stopPolling,
    isPolling: isPollingRef.current,
  };
};

/**
 * Hook for polling until a condition is met
 * @param callback - Function to call on each poll, returns true when condition is met
 * @param options - Polling configuration with optional maxAttempts
 */
export const usePollingUntil = (
  callback: () => boolean | Promise<boolean>,
  options: PollingOptions & { maxAttempts?: number }
) => {
  const { interval, enabled = true, onError, maxAttempts } = options;
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const attemptsRef = useRef(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clearPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPollingRef.current = false;
    attemptsRef.current = 0;
  }, []);

  const poll = useCallback(async () => {
    if (!isPollingRef.current) {
      return;
    }

    attemptsRef.current += 1;

    try {
      const conditionMet = await savedCallback.current();
      
      if (conditionMet) {
        clearPolling();
        return;
      }

      // Check max attempts
      if (maxAttempts && attemptsRef.current >= maxAttempts) {
        clearPolling();
        if (onError) {
          onError(new Error(`Polling stopped after ${maxAttempts} attempts`));
        }
        return;
      }

      // Schedule next poll
      if (isPollingRef.current) {
        timeoutRef.current = setTimeout(poll, interval);
      }
    } catch (error) {
      clearPolling();
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }, [interval, maxAttempts, onError, clearPolling]);

  const startPolling = useCallback(() => {
    if (!isPollingRef.current) {
      isPollingRef.current = true;
      attemptsRef.current = 0;
      poll();
    }
  }, [poll]);

  const stopPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    startPolling,
    stopPolling,
    isPolling: isPollingRef.current,
    attempts: attemptsRef.current,
  };
};
