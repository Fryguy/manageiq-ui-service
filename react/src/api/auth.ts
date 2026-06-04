import { getApiClient } from './client';
import { Authorization, SessionData, ActionResponse } from './types';

/**
 * Authentication API endpoints
 *
 * Based on the Angular implementation in:
 * - client/app/core/authentication-api.factory.js
 * - client/app/core/session.service.js
 */

export interface LoginCredentials {
  user: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
  token_ttl?: number;
  expires_on?: string;
}

export interface AuthorizationResponse {
  authorization: Authorization;
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login with username and password
   * POST /api/auth
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const client = getApiClient();
    return client.post<LoginResponse>('/auth', {
      auth: credentials,
    });
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
   */
  async getAuthorization(): Promise<AuthorizationResponse> {
    const client = getApiClient();
    return client.get<AuthorizationResponse>('/', {
      params: {
        attributes: 'authorization',
      },
    });
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
