import { AxiosError } from 'axios';
import {
  parseError,
  formatErrorMessage,
  isNetworkError,
  isAuthError,
  isForbiddenError,
  isNotFoundError,
  isServerError,
  getUserFriendlyErrorMessage,
  createRetryFunction,
} from './errorHandling';

describe('errorHandling', () => {
  describe('parseError', () => {
    it('should parse Axios error with response', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 404,
          data: {
            error: {
              message: 'Resource not found',
              kind: 'not_found',
            },
          },
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      const result = parseError(axiosError);

      expect(result.message).toBe('Resource not found');
      expect(result.status).toBe(404);
      expect(result.code).toBe('not_found');
    });

    it('should parse Axios error without response', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Network Error',
      };

      const result = parseError(axiosError);

      expect(result.message).toBe('Network Error');
      expect(result.status).toBeUndefined();
    });

    it('should parse Error instance', () => {
      const error = new Error('Something went wrong');
      const result = parseError(error);

      expect(result.message).toBe('Something went wrong');
      expect(result.status).toBeUndefined();
    });

    it('should parse string error', () => {
      const result = parseError('Error message');

      expect(result.message).toBe('Error message');
    });

    it('should handle unknown error types', () => {
      const result = parseError({ unknown: 'error' });

      expect(result.message).toBe('An unexpected error occurred');
      expect(result.details).toEqual({ unknown: 'error' });
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error with status', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      };

      const result = formatErrorMessage(axiosError);

      expect(result).toBe('Request failed (Status: 500)');
    });

    it('should format error without status', () => {
      const error = new Error('Something went wrong');
      const result = formatErrorMessage(error);

      expect(result).toBe('Something went wrong');
    });
  });

  describe('isNetworkError', () => {
    it('should return true for network errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Network Error',
      };

      expect(isNetworkError(axiosError)).toBe(true);
    });

    it('should return false for non-network errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      expect(isNetworkError(axiosError)).toBe(false);
    });

    it('should return false for non-Axios errors', () => {
      expect(isNetworkError(new Error('Error'))).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('should return true for 401 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      };

      expect(isAuthError(axiosError)).toBe(true);
    });

    it('should return false for non-401 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
          statusText: 'Forbidden',
          headers: {},
          config: {} as any,
        },
      };

      expect(isAuthError(axiosError)).toBe(false);
    });
  });

  describe('isForbiddenError', () => {
    it('should return true for 403 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
          statusText: 'Forbidden',
          headers: {},
          config: {} as any,
        },
      };

      expect(isForbiddenError(axiosError)).toBe(true);
    });

    it('should return false for non-403 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      expect(isForbiddenError(axiosError)).toBe(false);
    });
  });

  describe('isNotFoundError', () => {
    it('should return true for 404 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      expect(isNotFoundError(axiosError)).toBe(true);
    });

    it('should return false for non-404 errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      };

      expect(isNotFoundError(axiosError)).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 5xx errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      };

      expect(isServerError(axiosError)).toBe(true);
    });

    it('should return false for non-5xx errors', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      expect(isServerError(axiosError)).toBe(false);
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('should return network error message', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Network Error',
      };

      const result = getUserFriendlyErrorMessage(axiosError);

      expect(result).toBe('Unable to connect to the server. Please check your network connection.');
    });

    it('should return auth error message', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      };

      const result = getUserFriendlyErrorMessage(axiosError);

      expect(result).toBe('Your session has expired. Please log in again.');
    });

    it('should return forbidden error message', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
          statusText: 'Forbidden',
          headers: {},
          config: {} as any,
        },
      };

      const result = getUserFriendlyErrorMessage(axiosError);

      expect(result).toBe('You do not have permission to perform this action.');
    });

    it('should return not found error message', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      const result = getUserFriendlyErrorMessage(axiosError);

      expect(result).toBe('The requested resource was not found.');
    });

    it('should return server error message', () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      };

      const result = getUserFriendlyErrorMessage(axiosError);

      expect(result).toBe('A server error occurred. Please try again later.');
    });
  });

  describe('createRetryFunction', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should retry on failure', async () => {
      let attempts = 0;
      const fn = jest.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary error');
        }
        return 'success';
      });

      const retryFn = createRetryFunction(fn, { maxRetries: 3, initialDelay: 100 });

      const promise = retryFn();

      // Fast-forward through retries
      for (let i = 0; i < 3; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(1000);
      }

      const result = await promise;

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Persistent error');
      });

      const retryFn = createRetryFunction(fn, { maxRetries: 2, initialDelay: 100 });

      const promise = retryFn();

      // Fast-forward through retries
      for (let i = 0; i < 3; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(1000);
      }

      await expect(promise).rejects.toThrow('Persistent error');
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should not retry auth errors', async () => {
      const axiosError: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      };

      const fn = jest.fn(async () => {
        throw axiosError;
      });

      const retryFn = createRetryFunction(fn, { maxRetries: 3, initialDelay: 100 });

      await expect(retryFn()).rejects.toEqual(axiosError);
      expect(fn).toHaveBeenCalledTimes(1); // No retries
    });
  });
});