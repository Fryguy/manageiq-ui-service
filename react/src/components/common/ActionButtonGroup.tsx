/**
 * ActionButtonGroup Component
 *
 * A permission-aware button group component that filters and displays actions
 * based on user permissions. Integrates with RBAC and Carbon Design System.
 *
 * Features:
 * - Automatic permission-based filtering
 * - Role-based visibility
 * - Flexible layout (horizontal/vertical)
 * - Primary action highlighting
 * - Overflow menu for additional actions
 * - Carbon Button integration
 */

import React, { useCallback, useMemo } from 'react';
import { ButtonSet } from '@carbon/react';
import { ActionButton, type PermissionCheck } from './ActionButton';
import { ActionMenu, type MenuItem } from './ActionMenu';
import { usePermissions } from '../../features/auth/hooks/usePermissions';
import classNames from 'classnames';
import './ActionButtonGroup.scss';

/**
 * Action configuration
 */
export interface Action {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Click handler */
  onClick?: () => void | Promise<void>;
  /** Permission check configuration */
  permission?: PermissionCheck;
  /** If true, action is disabled */
  disabled?: boolean;
  /** If true, action is a danger action */
  isDanger?: boolean;
  /** If true, action is the primary action */
  isPrimary?: boolean;
  /** Button kind */
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Icon component */
  icon?: React.ComponentType;
  /** Confirmation dialog configuration */
  confirmation?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmKind?: 'primary' | 'danger' | 'secondary' | 'tertiary' | 'ghost';
  };
  /** Tooltip text */
  title?: string;
}

/**
 * ActionButtonGroup props
 */
export interface ActionButtonGroupProps {
  /** Actions to display */
  actions: Action[];
  /** Maximum number of buttons to show before overflow (default: 3) */
  maxButtons?: number;
  /** If true, use vertical layout */
  vertical?: boolean;
  /** If true, hide group when all actions are filtered out (default: true) */
  hideWhenEmpty?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Aria label for the button group */
  ariaLabel?: string;
}

/**
 * ActionButtonGroup Component
 *
 * @example
 * ```tsx
 * const actions: Action[] = [
 *   {
 *     id: 'start',
 *     label: 'Start',
 *     permission: { feature: 'service_start' },
 *     onClick: handleStart,
 *     isPrimary: true,
 *   },
 *   {
 *     id: 'stop',
 *     label: 'Stop',
 *     permission: { feature: 'service_stop' },
 *     onClick: handleStop,
 *   },
 *   {
 *     id: 'suspend',
 *     label: 'Suspend',
 *     permission: { feature: 'service_suspend' },
 *     onClick: handleSuspend,
 *   },
 *   {
 *     id: 'retire',
 *     label: 'Retire',
 *     permission: { feature: 'service_retire' },
 *     onClick: handleRetire,
 *   },
 * ];
 *
 * <ActionButtonGroup actions={actions} maxButtons={2} />
 * ```
 *
 * @example
 * ```tsx
 * // With confirmation dialogs
 * const actions: Action[] = [
 *   {
 *     id: 'delete',
 *     label: 'Delete',
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
 * <ActionButtonGroup actions={actions} />
 * ```
 */
export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  maxButtons = 3,
  vertical = false,
  hideWhenEmpty = true,
  className,
  ariaLabel = 'Actions',
}) => {
  const { has, hasAny, hasRole } = usePermissions();

  /**
   * Check if user has required permissions for an action
   */
  const hasActionPermission = useCallback(
    (action: Action): boolean => {
      if (!action.permission) {
        return true;
      }

      // Check single feature
      if (action.permission.feature && !has(action.permission.feature)) {
        return false;
      }

      // Check multiple features (any)
      if (action.permission.features && !hasAny(action.permission.features)) {
        return false;
      }

      // Check roles
      if (action.permission.roles && !hasRole(...action.permission.roles)) {
        return false;
      }

      return true;
    },
    [has, hasAny, hasRole]
  );

  /**
   * Filter actions based on permissions
   */
  const visibleActions = useMemo(() => {
    return actions.filter(hasActionPermission);
  }, [actions, hasActionPermission]);

  /**
   * Split actions into buttons and overflow menu items
   */
  const { buttonActions, overflowActions } = useMemo(() => {
    // Sort actions: primary first, then by order
    const sortedActions = [...visibleActions].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return 0;
    });

    const buttons = sortedActions.slice(0, maxButtons);
    const overflow = sortedActions.slice(maxButtons);

    return {
      buttonActions: buttons,
      overflowActions: overflow,
    };
  }, [visibleActions, maxButtons]);

  /**
   * Convert overflow actions to menu items
   */
  const menuItems: MenuItem[] = useMemo(() => {
    return overflowActions.map((action) => ({
      id: action.id,
      label: action.label,
      onClick: action.onClick,
      disabled: action.disabled,
      isDanger: action.isDanger,
      confirmation: action.confirmation,
      title: action.title,
    }));
  }, [overflowActions]);

  // Hide group if no visible actions and hideWhenEmpty is true
  if (visibleActions.length === 0 && hideWhenEmpty) {
    return null;
  }

  const groupClasses = classNames(
    'action-button-group',
    {
      'action-button-group--vertical': vertical,
    },
    className
  );

  return (
    <div className={groupClasses} role="group" aria-label={ariaLabel}>
      <ButtonSet stacked={vertical}>
        {buttonActions.map((action) => {
          const buttonKind = action.kind || (action.isPrimary ? 'primary' : 'secondary');

          return (
            <ActionButton
              key={action.id}
              kind={buttonKind}
              size={action.size}
              onClick={action.onClick}
              disabled={action.disabled}
              confirmation={action.confirmation}
              title={action.title}
              renderIcon={action.icon}
            >
              {action.label}
            </ActionButton>
          );
        })}
      </ButtonSet>

      {menuItems.length > 0 && (
        <ActionMenu
          items={menuItems}
          ariaLabel="More actions"
          hideWhenEmpty={false}
        />
      )}
    </div>
  );
};

/**
 * Default export
 */
export default ActionButtonGroup;
