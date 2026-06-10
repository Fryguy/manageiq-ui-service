import { getApiClient } from './client';
import { ActionResponse } from './types';

/**
 * Authentication API endpoints
 *
 * Based on the Angular implementation in:
 * - client/app/core/authentication-api.factory.js
 * - client/app/core/session.service.js
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
  token_ttl?: number;
  expires_on?: string;
}

export interface AuthorizationResponse {
  identity: {
    userid: string;
    name: string;
    user_href: string;
    group: string;
    group_href: string;
    role: string;
    role_href: string;
    tenant: string;
    groups: string[];
  };
  authorization: {
    product_features: Record<string, unknown>;
  };
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login with username and password
   * GET /api/auth?requester_type=ui
   * Uses Basic Authentication header
   *
   * Based on Angular implementation in authentication-api.factory.js
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const client = getApiClient();

    // Create Basic Auth header: base64(username:password)
    const basicAuth = btoa(`${credentials.username}:${credentials.password}`);

    // Get the underlying axios instance to bypass the token interceptor
    const axiosInstance = client.getAxiosInstance();

    const response = await axiosInstance.get<LoginResponse>('/auth', {
      params: {
        requester_type: 'ui',
      },
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'X-Auth-Token': undefined,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    return response.data;
  },

  /**
   * Logout and invalidate session token
   * DELETE /api/auth
   */
  async logout(): Promise<ActionResponse> {
    const client = getApiClient();
    return client.delete<ActionResponse>('/auth');
  },

  /**
   * Get user authorization data (product features, identity, role)
   * GET /api?attributes=authorization
   *
   * Based on getUserAuthorizations() in session.service.js
   * Response structure: { identity: {...}, authorization: { product_features: {...} } }
   */
  async getAuthorization(): Promise<AuthorizationResponse> {
    const client = getApiClient();
    const axiosInstance = client.getAxiosInstance();

    const response = await axiosInstance.get<AuthorizationResponse>('/', {
      params: {
        attributes: 'authorization',
      },
      headers: {
        'X-Auth-Skip-Token-Renewal': 'true',
      },
    });

    return response.data;
  },

  /**
   * Refresh session token
   * GET /api/auth with current token
   */
  async refreshToken(): Promise<LoginResponse> {
    const client = getApiClient();
    return client.get<LoginResponse>('/auth');
  },

  /**
   * Validate current session token
   * GET /api/auth
   */
  async validateToken(): Promise<{ token_ttl: number }> {
    const client = getApiClient();
    return client.get<{ token_ttl: number }>('/auth');
  },
};
