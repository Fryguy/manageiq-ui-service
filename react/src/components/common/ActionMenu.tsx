/**
 * ActionMenu Component
 *
 * A permission-aware dropdown menu component that integrates with RBAC.
 * Automatically filters menu items based on user permissions.
 *
 * Features:
 * - Permission-based item filtering
 * - Role-based visibility
 * - Carbon OverflowMenu integration
 * - Confirmation dialog support for destructive actions
 * - Disabled state support
 * - Custom icons and labels
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  OverflowMenu,
  OverflowMenuItem,
  type OverflowMenuProps,
} from '@carbon/react';
import { usePermissions } from '../../features/auth/hooks/usePermissions';
import { ConfirmDialog } from './ConfirmDialog';
import type { FeatureId, RoleId } from '../../features/auth/types';

/**
 * Permission check configuration for menu items
 */
export interface MenuItemPermission {
  /** Single feature ID to check */
  feature?: FeatureId;
  /** Multiple feature IDs - user must have at least one */
  features?: FeatureId[];
  /** Role IDs - user must have at least one */
  roles?: RoleId[];
}

/**
 * Confirmation dialog configuration for menu items
 */
export interface MenuItemConfirmation {
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
 * Menu item configuration
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label */
  label: string;
  /** Click handler */
  onClick?: () => void | Promise<void>;
  /** Permission check configuration */
  permission?: MenuItemPermission;
  /** If true, item is disabled */
  disabled?: boolean;
  /** If true, item is a divider (separator) */
  isDivider?: boolean;
  /** If true, item is a danger action (red text) */
  isDanger?: boolean;
  /** Confirmation dialog configuration */
  confirmation?: MenuItemConfirmation;
  /** Tooltip text */
  title?: string;
}

/**
 * ActionMenu props
 */
export interface ActionMenuProps extends Omit<OverflowMenuProps, 'children'> {
  /** Menu items */
  items: MenuItem[];
  /** If true, hide menu when all items are filtered out (default: true) */
  hideWhenEmpty?: boolean;
  /** Aria label for the menu */
  ariaLabel?: string;
}

/**
 * ActionMenu Component
 *
 * @example
 * ```tsx
 * const menuItems: MenuItem[] = [
 *   {
 *     id: 'edit',
 *     label: 'Edit Service',
 *     permission: { feature: 'service_edit' },
 *     onClick: handleEdit,
 *   },
 *   {
 *     id: 'divider-1',
 *     isDivider: true,
 *   },
 *   {
 *     id: 'delete',
 *     label: 'Delete Service',
 *     permission: { roles: ['admin'] },
 *     isDanger: true,
 *     confirmation: {
 *       title: 'Delete Service',
 *       message: 'Are you sure you want to delete this service?',
 *       confirmKind: 'danger',
 *     },
 *     onClick: handleDelete,
 *   },
 * ];
 *
 * <ActionMenu items={menuItems} ariaLabel="Service actions" />
 * ```
 *
 * @example
 * ```tsx
 * // Power operations menu
 * const powerActions: MenuItem[] = [
 *   {
 *     id: 'start',
 *     label: 'Start',
 *     permission: { feature: 'service_start' },
 *     onClick: handleStart,
 *   },
 *   {
 *     id: 'stop',
 *     label: 'Stop',
 *     permission: { feature: 'service_stop' },
 *     confirmation: {
 *       title: 'Stop Service',
 *       message: 'Are you sure you want to stop this service?',
 *     },
 *     onClick: handleStop,
 *   },
 *   {
 *     id: 'suspend',
 *     label: 'Suspend',
 *     permission: { feature: 'service_suspend' },
 *     onClick: handleSuspend,
 *   },
 * ];
 *
 * <ActionMenu items={powerActions} ariaLabel="Power operations" />
 * ```
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  hideWhenEmpty = true,
  ariaLabel = 'Actions',
  ...menuProps
}) => {
  const { has, hasAny, hasRole } = usePermissions();
  const [confirmationState, setConfirmationState] = useState<{
    item: MenuItem | null;
    show: boolean;
  }>({ item: null, show: false });

  /**
   * Check if user has required permissions for a menu item
   */
  const hasItemPermission = useCallback(
    (item: MenuItem): boolean => {
      if (!item.permission) {
        return true;
      }

      // Check single feature
      if (item.permission.feature && !has(item.permission.feature)) {
        return false;
      }

      // Check multiple features (any)
      if (item.permission.features && !hasAny(item.permission.features)) {
        return false;
      }

      // Check roles
      if (item.permission.roles && !hasRole(...item.permission.roles)) {
        return false;
      }

      return true;
    },
    [has, hasAny, hasRole]
  );

  /**
   * Filter menu items based on permissions
   */
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      // Always show dividers
      if (item.isDivider) {
        return true;
      }

      // Filter based on permissions
      return hasItemPermission(item);
    });
  }, [items, hasItemPermission]);

  /**
   * Remove consecutive dividers and leading/trailing dividers
   */
  const cleanedItems = useMemo(() => {
    const cleaned: MenuItem[] = [];
    let lastWasDivider = true; // Start as true to remove leading dividers

    for (const item of visibleItems) {
      if (item.isDivider) {
        if (!lastWasDivider) {
          cleaned.push(item);
          lastWasDivider = true;
        }
      } else {
        cleaned.push(item);
        lastWasDivider = false;
      }
    }

    // Remove trailing divider
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].isDivider) {
      cleaned.pop();
    }

    return cleaned;
  }, [visibleItems]);

  /**
   * Handle menu item click
   */
  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.disabled || !item.onClick) {
      return;
    }

    // Show confirmation dialog if configured
    if (item.confirmation) {
      setConfirmationState({ item, show: true });
      return;
    }

    // Execute click handler
    item.onClick();
  }, []);

  /**
   * Handle confirmation dialog confirm
   */
  const handleConfirm = useCallback(() => {
    const { item } = confirmationState;
    setConfirmationState({ item: null, show: false });

    if (item?.onClick) {
      item.onClick();
    }
  }, [confirmationState]);

  /**
   * Handle confirmation dialog cancel
   */
  const handleCancel = useCallback(() => {
    setConfirmationState({ item: null, show: false });
  }, []);

  // Hide menu if no visible items and hideWhenEmpty is true
  if (cleanedItems.length === 0 && hideWhenEmpty) {
    return null;
  }

  return (
    <>
      <OverflowMenu {...menuProps} ariaLabel={ariaLabel}>
        {cleanedItems.map((item) => {
          if (item.isDivider) {
            return (
              <OverflowMenuItem
                key={item.id}
                hasDivider
                itemText=""
                disabled
              />
            );
          }

          return (
            <OverflowMenuItem
              key={item.id}
              itemText={item.label}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              isDelete={item.isDanger}
              title={item.title}
            />
          );
        })}
      </OverflowMenu>

      {confirmationState.item?.confirmation && (
        <ConfirmDialog
          open={confirmationState.show}
          title={confirmationState.item.confirmation.title}
          message={confirmationState.item.confirmation.message}
          confirmText={confirmationState.item.confirmation.confirmText}
          cancelText={confirmationState.item.confirmation.cancelText}
          confirmKind={confirmationState.item.confirmation.confirmKind}
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
export default ActionMenu;
