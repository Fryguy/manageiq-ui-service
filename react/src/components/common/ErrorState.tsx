import React from 'react';
import { Button } from '@carbon/react';
import { WarningAlt, ErrorFilled } from '@carbon/icons-react';
import './ErrorState.scss';

export interface ErrorStateProps {
  title?: string;
  message: string | React.ReactNode;
  error?: Error;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  showDetails?: boolean;
  severity?: 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  error,
  actionText = 'Try Again',
  onAction,
  secondaryActionText,
  onSecondaryAction,
  showDetails = false,
  severity = 'error',
  size = 'md',
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  const defaultTitle = severity === 'error' ? 'Something went wrong' : 'Warning';
  const Icon = severity === 'error' ? ErrorFilled : WarningAlt;

  return (
    <div className={`error-state error-state--${severity} error-state--${size}`}>
      <div className="error-state__icon">
        <Icon size={48} />
      </div>
      <h3 className="error-state__title">{title || defaultTitle}</h3>
      <div className="error-state__message">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
      {error && showDetails && (
        <div className="error-state__details">
          <Button
            kind="ghost"
            size="sm"
            onClick={() => setDetailsExpanded(!detailsExpanded)}
          >
            {detailsExpanded ? 'Hide' : 'Show'} details
          </Button>
          {detailsExpanded && (
            <div className="error-state__details-content">
              <pre>{error.message}</pre>
              {error.stack && (
                <details>
                  <summary>Stack trace</summary>
                  <pre>{error.stack}</pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
      {(actionText || secondaryActionText) && (
        <div className="error-state__actions">
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
