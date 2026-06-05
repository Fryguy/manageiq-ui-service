/**
 * ProtectedRoute Component
 * 
 * A route wrapper that requires authentication.
 * Redirects unauthenticated users to the login page.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute props
 */
export interface ProtectedRouteProps {
  /** Child components to render if authenticated */
  children: React.ReactNode;
  /** Optional redirect path (defaults to /login) */
  redirectTo?: string;
}

/**
 * ProtectedRoute component
 * 
 * Wraps routes that require authentication. If the user is not authenticated,
 * they are redirected to the login page with the current location saved
 * so they can be redirected back after successful login.
 * 
 * @example
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom redirect path
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute redirectTo="/unauthorized">
 *       <AdminPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
