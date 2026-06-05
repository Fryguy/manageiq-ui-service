import axios, { AxiosInstance } from 'axios';
import { ApiClient } from './client';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;
  let apiClient: ApiClient;
  let mockGetToken: jest.Mock;
  let mockOnUnauthorized: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Create mock functions
    mockGetToken = jest.fn();
    mockOnUnauthorized = jest.fn();

    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      request: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn((onFulfilled) => {
            // Store the interceptor for testing
            (mockAxiosInstance as any)._requestInterceptor = onFulfilled;
            return 0;
          }),
          eject: jest.fn(),
          clear: jest.fn(),
        },
        response: {
          use: jest.fn((onFulfilled, onRejected) => {
            // Store the interceptor for testing
            (mockAxiosInstance as any)._responseInterceptor = { onFulfilled, onRejected };
            return 0;
          }),
          eject: jest.fn(),
          clear: jest.fn(),
        },
      },
      defaults: {} as any,
      getUri: jest.fn(),
    } as any;

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Create API client instance
    apiClient = new ApiClient({
      baseURL: '/api',
      getToken: mockGetToken,
      onUnauthorized: mockOnUnauthorized,
    });
  });

  describe('Initialization', () => {
    it('creates axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: '/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('sets up request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('sets up response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Request Interceptor', () => {
    it('adds X-Auth-Token header when token is present', () => {
      mockGetToken.mockReturnValue('test-token-123');

      const config = { headers: {} } as any;
      const interceptor = (mockAxiosInstance as any)._requestInterceptor;
      const result = interceptor(config);

      expect(result.headers['X-Auth-Token']).toBe('test-token-123');
    });

    it('does not add X-Auth-Token header when token is null', () => {
      mockGetToken.mockReturnValue(null);

      const config = { headers: {} } as any;
      const interceptor = (mockAxiosInstance as any)._requestInterceptor;
      const result = interceptor(config);

      expect(result.headers['X-Auth-Token']).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('calls onUnauthorized callback on 401 response', async () => {
      const error = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      const interceptor = (mockAxiosInstance as any)._responseInterceptor;
      
      try {
        await interceptor.onRejected(error);
      } catch (e) {
        // Expected to throw
      }

      expect(mockOnUnauthorized).toHaveBeenCalled();
    });

    it('does not call onUnauthorized for other error codes', async () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'Not found' },
        },
      };

      const interceptor = (mockAxiosInstance as any)._responseInterceptor;
      
      try {
        await interceptor.onRejected(error);
      } catch (e) {
        // Expected to throw
      }

      expect(mockOnUnauthorized).not.toHaveBeenCalled();
    });
  });

  describe('HTTP Methods', () => {
    it('performs GET requests', async () => {
      const mockData = { resources: [{ id: '1', name: 'Service 1' }] };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData } as any);

      const response = await apiClient.get('/services');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services', undefined);
      expect(response).toEqual(mockData);
    });

    it('performs GET requests with params', async () => {
      const mockData = { resources: [] };
      const params = { expand: 'resources', filter: 'name=test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData } as any);

      const response = await apiClient.get('/services', { params });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services', { params });
      expect(response).toEqual(mockData);
    });

    it('performs POST requests', async () => {
      const requestData = { action: 'start' };
      const responseData = { success: true, task_id: 'task-123' };
      mockAxiosInstance.post.mockResolvedValue({ data: responseData } as any);

      const response = await apiClient.post('/services/1', requestData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/services/1', requestData, undefined);
      expect(response).toEqual(responseData);
    });

    it('performs PUT requests', async () => {
      const requestData = { name: 'Updated Service' };
      const responseData = { id: '1', name: 'Updated Service' };
      mockAxiosInstance.put.mockResolvedValue({ data: responseData } as any);

      const response = await apiClient.put('/services/1', requestData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/services/1', requestData, undefined);
      expect(response).toEqual(responseData);
    });

    it('performs PATCH requests', async () => {
      const requestData = { description: 'Updated description' };
      const responseData = { id: '1', description: 'Updated description' };
      mockAxiosInstance.patch.mockResolvedValue({ data: responseData } as any);

      const response = await apiClient.patch('/services/1', requestData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/services/1', requestData, undefined);
      expect(response).toEqual(responseData);
    });

    it('performs DELETE requests', async () => {
      const responseData = { success: true };
      mockAxiosInstance.delete.mockResolvedValue({ data: responseData } as any);

      const response = await apiClient.delete('/services/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/services/1', undefined);
      expect(response).toEqual(responseData);
    });
  });

  describe('Error Handling', () => {
    it('handles request errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiClient.get('/services')).rejects.toThrow('Network error');
    });

    it('handles 404 errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Not found' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiClient.get('/services/999')).rejects.toEqual(mockError);
    });

    it('handles 500 errors', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiClient.get('/services')).rejects.toEqual(mockError);
    });
  });

  describe('getAxiosInstance', () => {
    it('returns the underlying axios instance', () => {
      const instance = apiClient.getAxiosInstance();
      expect(instance).toBe(mockAxiosInstance);
    });
  });
});