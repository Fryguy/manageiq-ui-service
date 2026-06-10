import { authApi } from './auth';
import { getApiClient } from './client';
import { ActionResponse } from './types';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('Auth API', () => {
  let mockClient: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
    getAxiosInstance: jest.Mock;
  };
  
  let mockAxiosInstance: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    // Create mock client methods
    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      getAxiosInstance: jest.fn().mockReturnValue(mockAxiosInstance),
    };

    // Mock getApiClient to return our mock client
    mockGetApiClient.mockReturnValue(mockClient as any);
  });

  describe('login', () => {
    it('sends login credentials with Basic Auth header', async () => {
      const credentials = {
        username: 'admin',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          auth_token: 'token-abc-123',
          token_ttl: 3600,
          expires_on: '2026-06-05T02:40:00Z',
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockClient.getAxiosInstance).toHaveBeenCalled();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth', {
        params: {
          requester_type: 'ui',
        },
        headers: {
          'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=', // base64(admin:password123)
          'X-Auth-Token': undefined,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('handles login errors', async () => {
      const credentials = {
        username: 'admin',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          status: 401,
          data: { error: 'Invalid credentials' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(authApi.login(credentials)).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('sends DELETE request to /auth endpoint', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Logged out successfully',
      };

      mockClient.delete.mockResolvedValue(mockResponse);

      const result = await authApi.logout();

      expect(mockClient.delete).toHaveBeenCalledWith('/auth');
      expect(result).toEqual(mockResponse);
    });

    it('handles logout errors', async () => {
      const mockError = new Error('Network error');
      mockClient.delete.mockRejectedValue(mockError);

      await expect(authApi.logout()).rejects.toThrow('Network error');
    });
  });

  describe('getAuthorization', () => {
    it('fetches authorization data with correct params and headers', async () => {
      const mockResponse = {
        data: {
          identity: {
            userid: 'admin',
            name: 'Administrator',
            user_href: '/api/users/1',
            group: 'EvmGroup-super_administrator',
            group_href: '/api/groups/1',
            role: 'EvmRole-super_administrator',
            role_href: '/api/roles/1',
            tenant: 'My Company',
            groups: ['EvmGroup-super_administrator'],
          },
          authorization: {
            product_features: {
              'service_view': {},
              'service_edit': {},
              'catalog_items_view': {},
            },
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await authApi.getAuthorization();

      expect(mockClient.getAxiosInstance).toHaveBeenCalled();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/', {
        params: {
          attributes: 'authorization',
        },
        headers: {
          'X-Auth-Skip-Token-Renewal': 'true',
        },
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.identity.userid).toBe('admin');
      expect(result.authorization.product_features).toBeDefined();
    });

    it('handles authorization fetch errors', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(authApi.getAuthorization()).rejects.toEqual(mockError);
    });
  });

  describe('refreshToken', () => {
    it('sends GET request to /auth to refresh token', async () => {
      const mockResponse = {
        auth_token: 'new-token-xyz-789',
        token_ttl: 3600,
        expires_on: '2026-06-05T03:40:00Z',
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await authApi.refreshToken();

      expect(mockClient.get).toHaveBeenCalledWith('/auth');
      expect(result).toEqual(mockResponse);
    });

    it('handles token refresh errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'Token expired' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(authApi.refreshToken()).rejects.toEqual(mockError);
    });
  });

  describe('validateToken', () => {
    it('validates current session token', async () => {
      const mockResponse = {
        token_ttl: 1800,
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await authApi.validateToken();

      expect(mockClient.get).toHaveBeenCalledWith('/auth');
      expect(result).toEqual(mockResponse);
      expect(result.token_ttl).toBe(1800);
    });

    it('handles token validation errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'Invalid token' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(authApi.validateToken()).rejects.toEqual(mockError);
    });
  });
});
