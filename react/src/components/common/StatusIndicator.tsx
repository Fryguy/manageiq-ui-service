import React from 'react';
import { CheckmarkFilled, ErrorFilled, WarningFilled, InProgress, Unknown } from '@carbon/icons-react';
import classNames from 'classnames';
import './StatusIndicator.scss';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'in-progress' | 'unknown';

export interface StatusIndicatorProps {
  /** Status type */
  status: StatusType;
  /** Status label text */
  label?: string;
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

const statusConfig = {
  success: {
    icon: CheckmarkFilled,
    label: 'Success',
    className: 'miq-status-indicator--success',
  },
  error: {
    icon: ErrorFilled,
    label: 'Error',
    className: 'miq-status-indicator--error',
  },
  warning: {
    icon: WarningFilled,
    label: 'Warning',
    className: 'miq-status-indicator--warning',
  },
  info: {
    icon: InProgress,
    label: 'Info',
    className: 'miq-status-indicator--info',
  },
  'in-progress': {
    icon: InProgress,
    label: 'In Progress',
    className: 'miq-status-indicator--in-progress',
  },
  unknown: {
    icon: Unknown,
    label: 'Unknown',
    className: 'miq-status-indicator--unknown',
  },
};

/**
 * StatusIndicator component for displaying status with icon and label.
 * Supports various status types with appropriate icons and colors.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
  testId = 'status-indicator',
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const statusClasses = classNames(
    'miq-status-indicator',
    config.className,
    `miq-status-indicator--${size}`,
    className
  );

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <div className={statusClasses} data-testid={testId}>
      {showIcon && (
        <Icon
          size={iconSize}
          className="miq-status-indicator__icon"
          data-testid={`${testId}-icon`}
        />
      )}
      <span className="miq-status-indicator__label" data-testid={`${testId}-label`}>
        {displayLabel}
      </span>
    </div>
  );
};

export default StatusIndicator;
