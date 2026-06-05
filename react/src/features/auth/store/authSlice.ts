/**
 * Authentication Redux Slice
 * 
 * Manages authentication state including login, logout, session management,
 * and token refresh functionality.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../../api/auth';
import type { 
  AuthState, 
  LoginCredentials, 
  OIDCParams, 
  AuthResponse,
  SessionData,
  Authorization
} from '../types';

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  session: {
    token: null,
    identity: null,
    features: {},
    expiresOn: undefined,
  },
  loading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Load session from localStorage on app initialization
 */
const loadSessionFromStorage = (): SessionData | null => {
  try {
    const storedSession = localStorage.getItem('manageiq_session');
    if (storedSession) {
      return JSON.parse(storedSession);
    }
  } catch (error) {
    console.error('Failed to load session from storage:', error);
  }
  return null;
};

/**
 * Save session to localStorage
 */
const saveSessionToStorage = (session: SessionData): void => {
  try {
    localStorage.setItem('manageiq_session', JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to storage:', error);
  }
};

/**
 * Clear session from localStorage
 */
const clearSessionFromStorage = (): void => {
  try {
    localStorage.removeItem('manageiq_session');
  } catch (error) {
    console.error('Failed to clear session from storage:', error);
  }
};

/**
 * Login with username and password
 */
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

/**
 * Login with OIDC
 */
export const loginWithOIDC = createAsyncThunk<AuthResponse, OIDCParams>(
  'auth/loginWithOIDC',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authApi.loginWithOIDC(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'OIDC login failed');
    }
  }
);

/**
 * Logout
 */
export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error: any) {
      // Even if logout API call fails, we still clear local session
      console.error('Logout API call failed:', error);
    }
  }
);

/**
 * Refresh user authorization data
 */
export const refreshAuthorization = createAsyncThunk<Authorization, void>(
  'auth/refreshAuthorization',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getAuthorization();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to refresh authorization');
    }
  }
);

/**
 * Validate current session token
 */
export const validateSession = createAsyncThunk<boolean, void>(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.validateToken();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Session validation failed');
    }
  }
);

/**
 * Authentication slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Initialize session from localStorage
     */
    initializeSession: (state) => {
      const storedSession = loadSessionFromStorage();
      if (storedSession && storedSession.token) {
        state.session = storedSession;
        state.isAuthenticated = true;
      }
    },

    /**
     * Clear authentication error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set authentication token
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.session.token = action.payload;
      state.isAuthenticated = true;
      saveSessionToStorage(state.session);
    },

    /**
     * Update session features
     */
    updateFeatures: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.session.features = action.payload;
      saveSessionToStorage(state.session);
    },

    /**
     * Clear session (used for 401 handling)
     */
    clearSession: (state) => {
      state.session = {
        token: null,
        identity: null,
        features: {},
        expiresOn: undefined,
      };
      state.isAuthenticated = false;
      state.error = null;
      clearSessionFromStorage();
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.session.token = action.payload.auth_token;
        state.session.identity = action.payload.identity || null;
        state.session.features = action.payload.authorization?.product_features || {};
        state.session.expiresOn = action.payload.expires_on;
        state.isAuthenticated = true;
        saveSessionToStorage(state.session);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Login with OIDC
    builder
      .addCase(loginWithOIDC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOIDC.fulfilled, (state, action) => {
        state.loading = false;
        state.session.token = action.payload.auth_token;
        state.session.identity = action.payload.identity || null;
        state.session.features = action.payload.authorization?.product_features || {};
        state.session.expiresOn = action.payload.expires_on;
        state.isAuthenticated = true;
        saveSessionToStorage(state.session);
      })
      .addCase(loginWithOIDC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.session = {
          token: null,
          identity: null,
          features: {},
          expiresOn: undefined,
        };
        state.isAuthenticated = false;
        state.error = null;
        clearSessionFromStorage();
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout fails, clear local session
        state.loading = false;
        state.session = {
          token: null,
          identity: null,
          features: {},
          expiresOn: undefined,
        };
        state.isAuthenticated = false;
        state.error = null;
        clearSessionFromStorage();
      });

    // Refresh authorization
    builder
      .addCase(refreshAuthorization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAuthorization.fulfilled, (state, action) => {
        state.loading = false;
        state.session.identity = action.payload.identity || state.session.identity;
        state.session.features = action.payload.product_features || {};
        saveSessionToStorage(state.session);
      })
      .addCase(refreshAuthorization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Validate session
    builder
      .addCase(validateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateSession.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Clear session if validation fails
        state.session = {
          token: null,
          identity: null,
          features: {},
          expiresOn: undefined,
        };
        state.isAuthenticated = false;
        clearSessionFromStorage();
      });
  },
});

export const {
  initializeSession,
  clearError,
  setToken,
  updateFeatures,
  clearSession,
} = authSlice.actions;

export default authSlice.reducer;
