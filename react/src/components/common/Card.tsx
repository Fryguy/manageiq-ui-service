import React from 'react';
import { Tile } from '@carbon/react';
import classNames from 'classnames';
import './Card.scss';

export interface CardProps {
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Whether the card is selected */
  selected?: boolean;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Card component for displaying content in a contained, elevated surface.
 * Built on Carbon's Tile component with additional features.
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  onClick,
  clickable = false,
  selected = false,
  footer,
  testId = 'card',
}) => {
  const cardClasses = classNames(
    'miq-card',
    {
      'miq-card--clickable': clickable || onClick,
      'miq-card--selected': selected,
    },
    className
  );

  return (
    <Tile
      className={cardClasses}
      onClick={onClick}
      data-testid={testId}
    >
      {(title || subtitle) && (
        <div className="miq-card__header" data-testid={`${testId}-header`}>
          {title && (
            <h3 className="miq-card__title" data-testid={`${testId}-title`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="miq-card__subtitle" data-testid={`${testId}-subtitle`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="miq-card__content" data-testid={`${testId}-content`}>
        {children}
      </div>
      {footer && (
        <div className="miq-card__footer" data-testid={`${testId}-footer`}>
          {footer}
        </div>
      )}
    </Tile>
  );
};

export default Card;
