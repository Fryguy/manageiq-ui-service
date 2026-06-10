import React from 'react';
import { Button } from '@carbon/react';
import './EmptyState.scss';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  size = 'md',
}) => {
  return (
    <div className={`empty-state empty-state--${size}`}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {(actionText || secondaryActionText) && (
        <div className="empty-state__actions">
          {actionText && onAction && (
            <Button onClick={onAction} kind="primary">
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button onClick={onSecondaryAction} kind="secondary">
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
