import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Extracts error information from various error types
 */
export const parseError = (error: unknown): ApiError => {
  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ error?: { message?: string; kind?: string } }>;
    
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data?.error;
    
    return {
      message: errorData?.message || axiosError.message || 'An unexpected error occurred',
      status,
      code: errorData?.kind,
      details: axiosError.response?.data,
    };
  }

  // Handle Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Handle unknown error types
  return {
    message: 'An unexpected error occurred',
    details: error,
  };
};

/**
 * Formats error message for display to users
 */
export const formatErrorMessage = (error: unknown): string => {
  const parsed = parseError(error);
  
  if (parsed.status) {
    return `${parsed.message} (Status: ${parsed.status})`;
  }
  
  return parsed.message;
};

/**
 * Checks if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    return !axiosError.response && axiosError.message === 'Network Error';
  }
  return false;
};

/**
 * Checks if error is an authentication error (401)
 */
export const isAuthError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 401;
};

/**
 * Checks if error is a forbidden error (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 403;
};

/**
 * Checks if error is a not found error (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 404;
};

/**
 * Checks if error is a server error (5xx)
 */
export const isServerError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status !== undefined && parsed.status >= 500 && parsed.status < 600;
};

/**
 * Gets user-friendly error message based on error type
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your network connection.';
  }

  if (isAuthError(error)) {
    return 'Your session has expired. Please log in again.';
  }

  if (isForbiddenError(error)) {
    return 'You do not have permission to perform this action.';
  }

  if (isNotFoundError(error)) {
    return 'The requested resource was not found.';
  }

  if (isServerError(error)) {
    return 'A server error occurred. Please try again later.';
  }

  return formatErrorMessage(error);
};

/**
 * Logs error to console with additional context
 */
export const logError = (error: unknown, context?: string): void => {
  const parsed = parseError(error);
  
  if (context) {
    console.error(`[${context}]`, parsed);
  } else {
    console.error(parsed);
  }

  // In production, you might want to send errors to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (e.g., Sentry)
  }
};

/**
 * Creates a retry function with exponential backoff
 */
export const createRetryFunction = <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: unknown, attempt: number) => boolean;
  } = {}
): (() => Promise<T>) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => !isAuthError(error) && !isForbiddenError(error),
  } = options;

  return async () => {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry if we've exhausted attempts or if error shouldn't be retried
        if (attempt === maxRetries || !shouldRetry(error, attempt)) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };
};
