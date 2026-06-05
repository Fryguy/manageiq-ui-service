/**
 * useAuth Hook
 * 
 * Provides convenient access to authentication state and actions.
 * This hook wraps the auth Redux slice and provides a clean API
 * for components to interact with authentication.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  login,
  loginWithOIDC,
  logout,
  refreshAuthorization,
  validateSession,
  clearError,
  setToken,
  initializeSession,
} from '../store/authSlice';
import type { LoginCredentials, OIDCParams, UserIdentity } from '../types';

/**
 * Authentication hook return type
 */
export interface UseAuthReturn {
  /** Current user identity */
  user: UserIdentity | null;
  /** Authentication token */
  token: string | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication operation is in progress */
  isLoading: boolean;
  /** Authentication error message */
  error: string | null;
  /** Token expiration time */
  expiresOn?: string;
  /** Login with username and password */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Login with OIDC */
  loginWithOIDC: (params: OIDCParams) => Promise<void>;
  /** Logout */
  logout: () => Promise<void>;
  /** Refresh authorization data */
  refreshAuthorization: () => Promise<void>;
  /** Validate current session */
  validateSession: () => Promise<void>;
  /** Clear authentication error */
  clearError: () => void;
  /** Set authentication token */
  setToken: (token: string) => void;
  /** Initialize session from storage */
  initializeSession: () => void;
}

/**
 * Hook for authentication operations
 * 
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { login, isLoading, error } = useAuth();
 *   
 *   const handleSubmit = async (credentials) => {
 *     await login(credentials);
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div>{error}</div>}
 *       <button disabled={isLoading}>Login</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  
  // Select auth state from Redux store
  const {
    session,
    loading,
    error,
    isAuthenticated,
  } = useAppSelector((state) => state.auth);

  /**
   * Login with username and password
   */
  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      await dispatch(login(credentials)).unwrap();
    },
    [dispatch]
  );

  /**
   * Login with OIDC
   */
  const handleLoginWithOIDC = useCallback(
    async (params: OIDCParams) => {
      await dispatch(loginWithOIDC(params)).unwrap();
    },
    [dispatch]
  );

  /**
   * Logout
   */
  const handleLogout = useCallback(async () => {
    await dispatch(logout()).unwrap();
  }, [dispatch]);

  /**
   * Refresh authorization data
   */
  const handleRefreshAuthorization = useCallback(async () => {
    await dispatch(refreshAuthorization()).unwrap();
  }, [dispatch]);

  /**
   * Validate current session
   */
  const handleValidateSession = useCallback(async () => {
    await dispatch(validateSession()).unwrap();
  }, [dispatch]);

  /**
   * Clear authentication error
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Set authentication token
   */
  const handleSetToken = useCallback(
    (token: string) => {
      dispatch(setToken(token));
    },
    [dispatch]
  );

  /**
   * Initialize session from storage
   */
  const handleInitializeSession = useCallback(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  return {
    user: session.identity,
    token: session.token,
    isAuthenticated,
    isLoading: loading,
    error,
    expiresOn: session.expiresOn,
    login: handleLogin,
    loginWithOIDC: handleLoginWithOIDC,
    logout: handleLogout,
    refreshAuthorization: handleRefreshAuthorization,
    validateSession: handleValidateSession,
    clearError: handleClearError,
    setToken: handleSetToken,
    initializeSession: handleInitializeSession,
  };
};
