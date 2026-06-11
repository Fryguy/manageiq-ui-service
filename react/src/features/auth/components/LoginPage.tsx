/**
 * LoginPage Component
 *
 * Provides the login interface for the ManageIQ Service UI.
 * Supports both username/password authentication and OIDC.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Form,
  TextInput,
  Button,
  InlineNotification,
  Stack,
  Layer,
} from '@carbon/react';
import { Login } from '@carbon/icons-react';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types';

/**
 * LoginPage component
 *
 * Renders a login form with username and password fields.
 * Handles authentication and redirects to the intended destination
 * or dashboard after successful login.
 *
 * @example
 * ```tsx
 * <Route path="/login" element={<LoginPage />} />
 * ```
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Get the redirect path from location state, default to root
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  /**
   * Redirect to intended destination if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Clear errors when component unmounts
   */
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    if (!username.trim()) {
      setValidationError('Username is required');
      return false;
    }
    if (!password) {
      setValidationError('Password is required');
      return false;
    }
    setValidationError(null);
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials: LoginCredentials = {
      username: username.trim(),
      password,
    };

    try {
      await login(credentials);
      // Navigation will happen via useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by the auth slice and displayed via the error state
      console.error('Login failed:', err);
    }
  };

  /**
   * Handle username input change
   */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      clearError();
    }
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      clearError();
    }
  };

  /**
   * Display error message
   */
  const displayError = validationError || error;

  return (
    <div
      data-testid="login-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
      }}
    >
      <Layer>
        <div
          style={{
            width: '400px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack gap={6}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>ManageIQ Service UI</h2>
              <p style={{ color: '#525252', fontSize: '0.875rem' }}>
                Sign in to your account
              </p>
            </div>

            {/* Error notification */}
            {displayError && (
              <InlineNotification
                kind="error"
                title="Login Failed"
                subtitle={displayError}
                lowContrast
                hideCloseButton
              />
            )}

            {/* Login form */}
            <Form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <TextInput
                  id="username"
                  labelText="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />

                <TextInput
                  id="password"
                  type="password"
                  labelText="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />

                <Button
                  type="submit"
                  renderIcon={Login}
                  disabled={isLoading}
                  style={{ width: '100%' }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </Form>

            {/* Footer */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#8d8d8d',
                marginTop: '1rem',
              }}
            >
              <p>ManageIQ Service UI</p>
            </div>
          </Stack>
        </div>
      </Layer>
    </div>
  );
};
