/**
 * PermissionGate Component
 * 
 * A component that conditionally renders children based on user permissions.
 * Supports feature-based, role-based, and custom permission checks.
 */

import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { FeatureId, RoleId } from '../types';

/**
 * PermissionGate props
 */
export interface PermissionGateProps {
  /** Child components to render if permission check passes */
  children: React.ReactNode;
  /** Feature ID to check (uses has()) */
  feature?: FeatureId;
  /** Array of feature IDs to check (uses hasAny()) */
  features?: FeatureId[];
  /** Role ID(s) to check (uses hasRole()) */
  roles?: RoleId | RoleId[];
  /** Custom permission check function */
  check?: () => boolean;
  /** Component to render if permission check fails */
  fallback?: React.ReactNode;
  /** Whether to require Service UI authorization */
  requireSuiAuth?: boolean;
}

/**
 * PermissionGate component
 * 
 * Conditionally renders children based on permission checks.
 * Supports multiple permission check strategies:
 * - Single feature check (feature prop)
 * - Multiple feature check (features prop)
 * - Role check (roles prop)
 * - Custom check function (check prop)
 * - Service UI authorization (requireSuiAuth prop)
 * 
 * @example
 * ```tsx
 * // Single feature check
 * <PermissionGate feature="service_edit">
 *   <EditButton />
 * </PermissionGate>
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple features check (any)
 * <PermissionGate features={['service_start', 'service_stop']}>
 *   <PowerOperations />
 * </PermissionGate>
 * ```
 * 
 * @example
 * ```tsx
 * // Role check
 * <PermissionGate roles="admin">
 *   <AdminPanel />
 * </PermissionGate>
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple roles check
 * <PermissionGate roles={['admin', 'operator']}>
 *   <AdvancedSettings />
 * </PermissionGate>
 * ```
 * 
 * @example
 * ```tsx
 * // Custom check with fallback
 * <PermissionGate
 *   check={() => user.isActive && user.hasAccess}
 *   fallback={<AccessDenied />}
 * >
 *   <SecureContent />
 * </PermissionGate>
 * ```
 * 
 * @example
 * ```tsx
 * // Require Service UI authorization
 * <PermissionGate requireSuiAuth>
 *   <ServiceUIContent />
 * </PermissionGate>
 * ```
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  feature,
  features,
  roles,
  check,
  fallback = null,
  requireSuiAuth = false,
}) => {
  const { has, hasAny, hasRole, suiAuthorized } = usePermissions();

  /**
   * Determine if permission check passes
   */
  const hasPermission = (): boolean => {
    // Check Service UI authorization if required
    if (requireSuiAuth && !suiAuthorized()) {
      return false;
    }

    // Custom check function takes precedence
    if (check) {
      return check();
    }

    // Single feature check
    if (feature) {
      return has(feature);
    }

    // Multiple features check (any)
    if (features && features.length > 0) {
      return hasAny(features);
    }

    // Role check
    if (roles) {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return hasRole(...roleArray);
    }

    // If no checks specified, default to allowing access
    return true;
  };

  // Render children if permission check passes, otherwise render fallback
  return hasPermission() ? <>{children}</> : <>{fallback}</>;
};

/**
 * Higher-order component version of PermissionGate
 * 
 * Wraps a component with permission checking logic.
 * 
 * @example
 * ```tsx
 * const ProtectedEditButton = withPermission(EditButton, {
 *   feature: 'service_edit'
 * });
 * ```
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permissionProps: Omit<PermissionGateProps, 'children'>
): React.FC<P> {
  return (props: P) => (
    <PermissionGate {...permissionProps}>
      <Component {...props} />
    </PermissionGate>
  );
}
