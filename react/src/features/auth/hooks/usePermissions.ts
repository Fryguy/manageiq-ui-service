/**
 * usePermissions Hook
 * 
 * Provides RBAC (Role-Based Access Control) functionality.
 * This hook mirrors the behavior of the Angular rbac.service.js
 * and provides permission checking methods: has, hasAny, hasRole.
 */

import { useCallback, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../store/hooks';
import type { FeatureId, RoleId, UserIdentity } from '../types';

/**
 * Permissions hook return type
 */
export interface UsePermissionsReturn {
  /** User identity */
  identity: UserIdentity | null;
  /** Product features available to the user */
  features: Record<string, unknown>;
  /** Check if user has a specific feature permission */
  has: (featureId: FeatureId) => boolean;
  /** Check if user has any of the specified feature permissions */
  hasAny: (featureIds: FeatureId[]) => boolean;
  /** Check if user has a specific role */
  hasRole: (...roles: RoleId[]) => boolean;
  /** Check if user is authorized for the Service UI */
  suiAuthorized: () => boolean;
}

/**
 * Special role identifier that matches all roles
 */
const ALL_ROLES = '_ALL_';

/**
 * Hook for RBAC permission checking
 * 
 * Provides methods to check user permissions based on:
 * - Product features (has, hasAny)
 * - User roles (hasRole)
 * - Service UI authorization (suiAuthorized)
 * 
 * @example
 * ```tsx
 * function ServiceActions() {
 *   const { has, hasRole } = usePermissions();
 *   
 *   if (!has('service_edit')) {
 *     return null;
 *   }
 *   
 *   return (
 *     <div>
 *       <button>Edit Service</button>
 *       {hasRole('admin') && <button>Delete Service</button>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function ActionMenu() {
 *   const { hasAny } = usePermissions();
 *   
 *   const canPerformActions = hasAny([
 *     'service_start',
 *     'service_stop',
 *     'service_suspend'
 *   ]);
 *   
 *   if (!canPerformActions) {
 *     return null;
 *   }
 *   
 *   return <ActionsDropdown />;
 * }
 * ```
 */
export const usePermissions = (): UsePermissionsReturn => {
  // Select auth state from Redux store with shallow equality check
  // to prevent unnecessary re-renders when object references change
  const { identity, features } = useAppSelector(
    (state) => ({
      identity: state.auth.session.identity,
      features: state.auth.session.features,
    }),
    shallowEqual
  );

  /**
   * Check if user has a specific feature permission
   * 
   * Mirrors Angular rbac.service.js has() method.
   * Checks if the feature ID exists in the user's features object.
   * 
   * @param featureId - The feature identifier to check
   * @returns true if user has the feature permission
   */
  const has = useCallback(
    (featureId: FeatureId): boolean => {
      return featureId in features;
    },
    [features]
  );

  /**
   * Check if user has any of the specified feature permissions
   * 
   * Mirrors Angular rbac.service.js hasAny() method.
   * Returns true if the user has at least one of the specified features.
   * 
   * @param featureIds - Array of feature identifiers to check
   * @returns true if user has any of the feature permissions
   */
  const hasAny = useCallback(
    (featureIds: FeatureId[]): boolean => {
      return featureIds.some((featureId) => featureId in features);
    },
    [features]
  );

  /**
   * Check if user has a specific role
   * 
   * Mirrors Angular rbac.service.js hasRole() method.
   * Supports the special '_ALL_' role that matches any role.
   * 
   * @param roles - Role identifiers to check (supports multiple roles)
   * @returns true if user has any of the specified roles
   */
  const hasRole = useCallback(
    (...roles: RoleId[]): boolean => {
      if (!identity?.role) {
        return false;
      }

      return roles.some(
        (role) => role === ALL_ROLES || role === identity.role
      );
    },
    [identity]
  );

  /**
   * Check if user is authorized for the Service UI
   * 
   * Mirrors Angular rbac.service.js suiAuthorized() method.
   * Checks if the user has the 'sui' feature permission.
   * 
   * @returns true if user is authorized for Service UI
   */
  const suiAuthorized = useCallback((): boolean => {
    return has('sui');
  }, [has]);

  /**
   * Memoized return value to prevent unnecessary re-renders
   */
  return useMemo(
    () => ({
      identity,
      features,
      has,
      hasAny,
      hasRole,
      suiAuthorized,
    }),
    [identity, features, has, hasAny, hasRole, suiAuthorized]
  );
};

/**
 * Helper function to check permissions outside of React components
 * 
 * @param features - Product features object
 * @param featureId - Feature identifier to check
 * @returns true if feature exists in features object
 */
export const checkFeature = (
  features: Record<string, unknown>,
  featureId: FeatureId
): boolean => {
  return featureId in features;
};

/**
 * Helper function to check multiple permissions outside of React components
 * 
 * @param features - Product features object
 * @param featureIds - Array of feature identifiers to check
 * @returns true if any feature exists in features object
 */
export const checkAnyFeature = (
  features: Record<string, unknown>,
  featureIds: FeatureId[]
): boolean => {
  return featureIds.some((featureId) => featureId in features);
};

/**
 * Helper function to check role outside of React components
 * 
 * @param identity - User identity object
 * @param roles - Role identifiers to check
 * @returns true if user has any of the specified roles
 */
export const checkRole = (
  identity: UserIdentity | null,
  ...roles: RoleId[]
): boolean => {
  if (!identity?.role) {
    return false;
  }

  return roles.some(
    (role) => role === ALL_ROLES || role === identity.role
  );
};
