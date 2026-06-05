import { authApi } from './auth';
import { getApiClient } from './client';
import { Authorization, ActionResponse } from './types';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('Auth API', () => {
  let mockClient: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock client methods
    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    // Mock getApiClient to return our mock client
    mockGetApiClient.mockReturnValue(mockClient as any);
  });

  describe('login', () => {
    it('sends login credentials to /auth endpoint', async () => {
      const credentials = {
        user: 'admin',
        password: 'password123',
      };

      const mockResponse = {
        auth_token: 'token-abc-123',
        token_ttl: 3600,
        expires_on: '2026-06-05T02:40:00Z',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockClient.post).toHaveBeenCalledWith('/auth', {
        auth: credentials,
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles login errors', async () => {
      const credentials = {
        user: 'admin',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          status: 401,
          data: { error: 'Invalid credentials' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

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
    it('fetches authorization data with correct params', async () => {
      const mockAuthorization: Authorization = {
        product_features: {
          'service_view': {},
          'service_edit': {},
          'catalog_items_view': {},
        },
        identity: {
          userid: 'admin',
          name: 'Administrator',
          user_href: '/api/users/1',
          group: 'EvmGroup-super_administrator',
          group_href: '/api/groups/1',
          role: 'EvmRole-super_administrator',
          role_href: '/api/roles/1',
          tenant: 'My Company',
        },
      };

      const mockResponse = {
        authorization: mockAuthorization,
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await authApi.getAuthorization();

      expect(mockClient.get).toHaveBeenCalledWith('/', {
        params: {
          attributes: 'authorization',
        },
      });
      expect(result).toEqual(mockResponse);
      expect(result.authorization).toEqual(mockAuthorization);
    });

    it('handles authorization fetch errors', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

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
