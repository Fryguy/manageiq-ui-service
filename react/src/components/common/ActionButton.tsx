/**
 * ActionButton Component
 *
 * A permission-aware button component that integrates with RBAC.
 * Automatically hides or disables the button based on user permissions.
 *
 * Features:
 * - Permission checking via feature IDs
 * - Role-based visibility
 * - Automatic disable/hide based on permissions
 * - Carbon Button integration
 * - Loading state support
 * - Confirmation dialog support
 */

import React, { useCallback, useState } from 'react';
import { Button, type ButtonProps } from '@carbon/react';
import { usePermissions } from '../../features/auth/hooks/usePermissions';
import { ConfirmDialog } from './ConfirmDialog';
import type { FeatureId, RoleId } from '../../features/auth/types';

/**
 * Permission check configuration
 */
export interface PermissionCheck {
  /** Single feature ID to check */
  feature?: FeatureId;
  /** Multiple feature IDs - user must have at least one */
  features?: FeatureId[];
  /** Role IDs - user must have at least one */
  roles?: RoleId[];
}

/**
 * Confirmation dialog configuration
 */
export interface ConfirmationConfig {
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Confirm button text (default: "Confirm") */
  confirmText?: string;
  /** Cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Confirm button kind (default: "danger") */
  confirmKind?: 'primary' | 'danger' | 'secondary' | 'tertiary' | 'ghost';
}

/**
 * ActionButton props
 */
export interface ActionButtonProps extends Omit<ButtonProps<'button'>, 'onClick'> {
  /** Permission check configuration */
  permission?: PermissionCheck;
  /** If true, hide button when permission check fails (default: false) */
  hideOnNoPermission?: boolean;
  /** If true, disable button when permission check fails (default: true) */
  disableOnNoPermission?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** If true, show loading state during async onClick */
  showLoadingOnClick?: boolean;
  /** Confirmation dialog configuration */
  confirmation?: ConfirmationConfig;
  /** Tooltip text when disabled due to permissions */
  noPermissionTooltip?: string;
}

/**
 * ActionButton Component
 *
 * @example
 * ```tsx
 * // Simple permission check
 * <ActionButton
 *   permission={{ feature: 'service_edit' }}
 *   onClick={handleEdit}
 * >
 *   Edit Service
 * </ActionButton>
 * ```
 *
 * @example
 * ```tsx
 * // Multiple features (any)
 * <ActionButton
 *   permission={{ features: ['service_start', 'service_stop'] }}
 *   onClick={handlePowerAction}
 * >
 *   Power Actions
 * </ActionButton>
 * ```
 *
 * @example
 * ```tsx
 * // Role-based with confirmation
 * <ActionButton
 *   permission={{ roles: ['admin'] }}
 *   confirmation={{
 *     title: 'Delete Service',
 *     message: 'Are you sure you want to delete this service?',
 *     confirmKind: 'danger'
 *   }}
 *   onClick={handleDelete}
 *   kind="danger"
 * >
 *   Delete
 * </ActionButton>
 * ```
 *
 * @example
 * ```tsx
 * // Hide when no permission
 * <ActionButton
 *   permission={{ feature: 'service_retire' }}
 *   hideOnNoPermission
 *   onClick={handleRetire}
 * >
 *   Retire Service
 * </ActionButton>
 * ```
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  permission,
  hideOnNoPermission = false,
  disableOnNoPermission = true,
  onClick,
  showLoadingOnClick = false,
  confirmation,
  noPermissionTooltip,
  disabled,
  children,
  ...buttonProps
}) => {
  const { has, hasAny, hasRole } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  /**
   * Check if user has required permissions
   */
  const hasPermission = useCallback((): boolean => {
    if (!permission) {
      return true;
    }

    // Check single feature
    if (permission.feature && !has(permission.feature)) {
      return false;
    }

    // Check multiple features (any)
    if (permission.features && !hasAny(permission.features)) {
      return false;
    }

    // Check roles
    if (permission.roles && !hasRole(...permission.roles)) {
      return false;
    }

    return true;
  }, [permission, has, hasAny, hasRole]);

  /**
   * Handle button click
   */
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) {
        return;
      }

      // Show confirmation dialog if configured
      if (confirmation) {
        setShowConfirmDialog(true);
        return;
      }

      // Execute click handler
      if (showLoadingOnClick) {
        setIsLoading(true);
        try {
          await onClick(event);
        } finally {
          setIsLoading(false);
        }
      } else {
        onClick(event);
      }
    },
    [onClick, confirmation, showLoadingOnClick]
  );

  /**
   * Handle confirmation dialog confirm
   */
  const handleConfirm = useCallback(async () => {
    setShowConfirmDialog(false);

    if (!onClick) {
      return;
    }

    if (showLoadingOnClick) {
      setIsLoading(true);
      try {
        // Create a synthetic event for the onClick handler
        const syntheticEvent = {
          currentTarget: null,
          target: null,
        } as unknown as React.MouseEvent<HTMLButtonElement>;
        await onClick(syntheticEvent);
      } finally {
        setIsLoading(false);
      }
    } else {
      const syntheticEvent = {
        currentTarget: null,
        target: null,
      } as unknown as React.MouseEvent<HTMLButtonElement>;
      onClick(syntheticEvent);
    }
  }, [onClick, showLoadingOnClick]);

  /**
   * Handle confirmation dialog cancel
   */
  const handleCancel = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  // Check permissions
  const permitted = hasPermission();

  // Hide button if no permission and hideOnNoPermission is true
  if (!permitted && hideOnNoPermission) {
    return null;
  }

  // Determine if button should be disabled
  const isDisabled =
    disabled || isLoading || (!permitted && disableOnNoPermission);

  // Determine button title (tooltip)
  let title = buttonProps.title;
  if (!permitted && noPermissionTooltip) {
    title = noPermissionTooltip;
  }

  return (
    <>
      <Button
        {...buttonProps}
        disabled={isDisabled}
        onClick={handleClick}
        title={title}
      >
        {isLoading ? 'Loading...' : children}
      </Button>

      {confirmation && (
        <ConfirmDialog
          open={showConfirmDialog}
          title={confirmation.title}
          message={confirmation.message}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
          confirmKind={confirmation.confirmKind}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

/**
 * Default export
 */
export default ActionButton;
