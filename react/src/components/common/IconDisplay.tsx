import React from 'react';
import * as CarbonIcons from '@carbon/icons-react';
import classNames from 'classnames';
import './IconDisplay.scss';

export interface IconDisplayProps {
  /** Icon name from Carbon icons */
  icon: keyof typeof CarbonIcons;
  /** Icon size */
  size?: 16 | 20 | 24 | 32;
  /** Icon color */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for the icon */
  ariaLabel?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * IconDisplay component for rendering Carbon icons with consistent styling.
 * Provides size and color variants for common use cases.
 */
export const IconDisplay: React.FC<IconDisplayProps> = ({
  icon,
  size = 20,
  color,
  className,
  ariaLabel,
  testId = 'icon-display',
}) => {
  const Icon = CarbonIcons[icon] as React.ComponentType<{ size: number; className?: string }>;

  if (!Icon) {
    console.warn(`Icon "${icon}" not found in Carbon icons`);
    return null;
  }

  const iconClasses = classNames(
    'miq-icon-display',
    {
      [`miq-icon-display--${color}`]: color,
    },
    className
  );

  return (
    <Icon
      size={size}
      className={iconClasses}
      aria-label={ariaLabel}
      data-testid={testId}
    />
  );
};

export default IconDisplay;
