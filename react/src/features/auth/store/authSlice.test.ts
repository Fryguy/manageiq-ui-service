/**
 * Tests for authSlice
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  login,
  loginWithOIDC,
  logout,
  refreshAuthorization,
  validateSession,
  initializeSession,
  clearError,
  setToken,
  updateFeatures,
  clearSession,
} from './authSlice';
import { authApi } from '../../../api/auth';

// Mock the auth API
jest.mock('../../../api/auth', () => ({
  authApi: {
    login: jest.fn(),
    loginWithOIDC: jest.fn(),
    logout: jest.fn(),
    getAuthorization: jest.fn(),
    validateToken: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        session: {
          token: null,
          identity: null,
          features: {},
          expiresOn: undefined,
        },
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  describe('initializeSession', () => {
    it('should load session from localStorage', () => {
      const sessionData = {
        token: 'test-token',
        identity: { id: '1', name: 'Test User', role: 'admin' },
        features: { service_edit: true },
        expiresOn: '2026-12-31T23:59:59Z',
      };

      localStorageMock.setItem('manageiq_session', JSON.stringify(sessionData));

      store.dispatch(initializeSession());

      const state = store.getState().auth;
      expect(state.session).toEqual(sessionData);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle missing session in localStorage', () => {
      store.dispatch(initializeSession());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle invalid JSON in localStorage', () => {
      // Suppress expected console.error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      localStorageMock.setItem('manageiq_session', 'invalid-json');

      store.dispatch(initializeSession());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);

      // Verify error was logged (but suppressed from output)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load session from storage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      // Set an error first
      store = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            session: { token: null, identity: null, features: {} },
            loading: false,
            error: 'Test error',
            isAuthenticated: false,
          },
        },
      });

      store.dispatch(clearError());

      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should set token and mark as authenticated', () => {
      store.dispatch(setToken('new-token'));

      const state = store.getState().auth;
      expect(state.session.token).toBe('new-token');
      expect(state.isAuthenticated).toBe(true);

      // Verify localStorage was updated
      const stored = JSON.parse(localStorageMock.getItem('manageiq_session') || '{}');
      expect(stored.token).toBe('new-token');
    });
  });

  describe('updateFeatures', () => {
    it('should update features', () => {
      const features = { service_edit: true, service_delete: true };

      store.dispatch(updateFeatures(features));

      const state = store.getState().auth;
      expect(state.session.features).toEqual(features);

      // Verify localStorage was updated
      const stored = JSON.parse(localStorageMock.getItem('manageiq_session') || '{}');
      expect(stored.features).toEqual(features);
    });
  });

  describe('clearSession', () => {
    it('should clear session and localStorage', () => {
      // Set up initial state with session
      localStorageMock.setItem('manageiq_session', JSON.stringify({ token: 'test' }));

      store.dispatch(clearSession());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.session.identity).toBeNull();
      expect(state.session.features).toEqual({});
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();

      // Verify localStorage was cleared
      expect(localStorageMock.getItem('manageiq_session')).toBeNull();
    });
  });

  describe('login', () => {
    it('should handle successful login with two-step process', async () => {
      const mockLoginResponse = {
        auth_token: 'test-token',
        expires_on: '2026-12-31T23:59:59Z',
      };

      const mockAuthResponse = {
        identity: {
          userid: 'testuser',
          name: 'Test User',
          user_href: '/api/users/1',
          group: 'EvmGroup-super_administrator',
          group_href: '/api/groups/1',
          role: 'EvmRole-super_administrator',
          role_href: '/api/roles/1',
          tenant: 'My Company',
          groups: ['EvmGroup-super_administrator'],
        },
        authorization: {
          product_features: { service_edit: {}, service_view: {} },
        },
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockLoginResponse);
      (authApi.getAuthorization as jest.Mock).mockResolvedValue(mockAuthResponse);

      await store.dispatch(login({ username: 'testuser', password: 'password' }));

      const state = store.getState().auth;
      expect(state.session.token).toBe('test-token');
      expect(state.session.identity).toEqual(mockAuthResponse.identity);
      expect(state.session.features).toEqual(mockAuthResponse.authorization.product_features);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Verify both API calls were made
      expect(authApi.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
      expect(authApi.getAuthorization).toHaveBeenCalled();

      // Verify localStorage was updated
      const stored = JSON.parse(localStorageMock.getItem('manageiq_session') || '{}');
      expect(stored.token).toBe('test-token');
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      (authApi.login as jest.Mock).mockRejectedValue({
        response: { data: { error: errorMessage } },
      });

      await store.dispatch(login({ username: 'testuser', password: 'wrong' }));

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle authorization fetch failure after successful login', async () => {
      const mockLoginResponse = {
        auth_token: 'test-token',
        expires_on: '2026-12-31T23:59:59Z',
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockLoginResponse);
      (authApi.getAuthorization as jest.Mock).mockRejectedValue({
        response: { data: { error: 'Authorization failed' } },
      });

      await store.dispatch(login({ username: 'testuser', password: 'password' }));

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Authorization failed');
    });

    it('should set loading state during login', () => {
      (authApi.login as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      (authApi.getAuthorization as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      store.dispatch(login({ username: 'testuser', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(true);
    });
  });

  describe('loginWithOIDC', () => {
    it('should handle successful OIDC login', async () => {
      const mockResponse = {
        auth_token: 'oidc-token',
        identity: { id: '2', name: 'OIDC User', role: 'user' },
        authorization: {
          identity: { id: '2', name: 'OIDC User', role: 'user' },
          product_features: { service_view: true },
        },
      };

      (authApi.loginWithOIDC as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(loginWithOIDC({ provider: 'google', token: 'oidc-token' }));

      const state = store.getState().auth;
      expect(state.session.token).toBe('oidc-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle OIDC login failure', async () => {
      (authApi.loginWithOIDC as jest.Mock).mockRejectedValue({
        response: { data: { error: 'OIDC failed' } },
      });

      await store.dispatch(loginWithOIDC({ provider: 'google' }));

      const state = store.getState().auth;
      expect(state.error).toBe('OIDC failed');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear session on logout', async () => {
      // Set up initial authenticated state
      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            session: {
              token: 'test-token',
              identity: { id: '1', name: 'Test User' },
              features: { service_edit: true },
            },
            loading: false,
            error: null,
            isAuthenticated: true,
          },
        },
      });

      (authApi.logout as jest.Mock).mockResolvedValue(undefined);

      await store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.session.identity).toBeNull();
      expect(state.session.features).toEqual({});
      expect(state.isAuthenticated).toBe(false);
      expect(localStorageMock.getItem('manageiq_session')).toBeNull();
    });

    it('should clear session even if logout API fails', async () => {
      // Suppress expected console.error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            session: { token: 'test-token', identity: null, features: {} },
            loading: false,
            error: null,
            isAuthenticated: true,
          },
        },
      });

      (authApi.logout as jest.Mock).mockRejectedValue(new Error('API error'));

      await store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);

      // Verify error was logged (but suppressed from output)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Logout API call failed:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('refreshAuthorization', () => {
    it('should update authorization data', async () => {
      const mockAuth = {
        identity: {
          userid: 'admin',
          name: 'Updated User',
          user_href: '/api/users/1',
          group: 'EvmGroup-super_administrator',
          group_href: '/api/groups/1',
          role: 'EvmRole-super_administrator',
          role_href: '/api/roles/1',
          tenant: 'My Company',
          groups: ['EvmGroup-super_administrator'],
        },
        authorization: {
          product_features: { service_edit: {}, service_delete: {} },
        },
      };

      (authApi.getAuthorization as jest.Mock).mockResolvedValue(mockAuth);

      await store.dispatch(refreshAuthorization());

      const state = store.getState().auth;
      expect(state.session.identity).toEqual(mockAuth.identity);
      expect(state.session.features).toEqual(mockAuth.authorization.product_features);
    });

    it('should handle refresh failure', async () => {
      (authApi.getAuthorization as jest.Mock).mockRejectedValue({
        response: { data: { error: 'Refresh failed' } },
      });

      await store.dispatch(refreshAuthorization());

      const state = store.getState().auth;
      expect(state.error).toBe('Refresh failed');
    });
  });

  describe('validateSession', () => {
    it('should validate session successfully', async () => {
      (authApi.validateToken as jest.Mock).mockResolvedValue(undefined);

      await store.dispatch(validateSession());

      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });

    it('should clear session on validation failure', async () => {
      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            session: { token: 'invalid-token', identity: null, features: {} },
            loading: false,
            error: null,
            isAuthenticated: true,
          },
        },
      });

      (authApi.validateToken as jest.Mock).mockRejectedValue({
        response: { data: { error: 'Invalid token' } },
      });

      await store.dispatch(validateSession());

      const state = store.getState().auth;
      expect(state.session.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid token');
    });
  });
});
