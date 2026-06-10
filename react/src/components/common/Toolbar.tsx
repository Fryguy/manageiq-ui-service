/**
 * Toolbar Component
 *
 * A flexible toolbar component for displaying actions, filters, and controls.
 * Integrates with Carbon Design System and supports permission-aware actions.
 *
 * Features:
 * - Flexible layout with left, center, and right sections
 * - Action button integration
 * - Search and filter integration
 * - Responsive design
 * - Carbon styling
 */

import React from 'react';
import classNames from 'classnames';
import './Toolbar.scss';

/**
 * Toolbar section alignment
 */
export type ToolbarAlignment = 'left' | 'center' | 'right';

/**
 * Toolbar props
 */
export interface ToolbarProps {
  /** Content for the left section */
  left?: React.ReactNode;
  /** Content for the center section */
  center?: React.ReactNode;
  /** Content for the right section */
  right?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** If true, add bottom border */
  bordered?: boolean;
  /** If true, add padding */
  padded?: boolean;
  /** Aria label for the toolbar */
  ariaLabel?: string;
}

/**
 * Toolbar Component
 *
 * @example
 * ```tsx
 * <Toolbar
 *   left={
 *     <>
 *       <h2>Services</h2>
 *       <span>25 items</span>
 *     </>
 *   }
 *   right={
 *     <>
 *       <SearchBar onSearch={handleSearch} />
 *       <ActionButton onClick={handleCreate}>Create Service</ActionButton>
 *     </>
 *   }
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With action menu
 * <Toolbar
 *   left={<h2>Service Details</h2>}
 *   right={
 *     <ActionMenu
 *       items={[
 *         { id: 'edit', label: 'Edit', onClick: handleEdit },
 *         { id: 'delete', label: 'Delete', onClick: handleDelete },
 *       ]}
 *     />
 *   }
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With filters and actions
 * <Toolbar
 *   left={
 *     <>
 *       <FilterBar filters={filters} onChange={handleFilterChange} />
 *     </>
 *   }
 *   right={
 *     <>
 *       <ActionButtonGroup
 *         actions={[
 *           { id: 'start', label: 'Start', onClick: handleStart },
 *           { id: 'stop', label: 'Stop', onClick: handleStop },
 *         ]}
 *       />
 *     </>
 *   }
 * />
 * ```
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  left,
  center,
  right,
  className,
  bordered = false,
  padded = true,
  ariaLabel = 'Toolbar',
}) => {
  const toolbarClasses = classNames(
    'toolbar',
    {
      'toolbar--bordered': bordered,
      'toolbar--padded': padded,
    },
    className
  );

  return (
    <div className={toolbarClasses} role="toolbar" aria-label={ariaLabel}>
      {left && <div className="toolbar__section toolbar__section--left">{left}</div>}
      {center && (
        <div className="toolbar__section toolbar__section--center">{center}</div>
      )}
      {right && (
        <div className="toolbar__section toolbar__section--right">{right}</div>
      )}
    </div>
  );
};

/**
 * ToolbarSection Component
 *
 * A helper component for creating custom toolbar sections with specific alignment.
 */
export interface ToolbarSectionProps {
  /** Section content */
  children: React.ReactNode;
  /** Section alignment */
  align?: ToolbarAlignment;
  /** Additional CSS class names */
  className?: string;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  children,
  align = 'left',
  className,
}) => {
  const sectionClasses = classNames(
    'toolbar__section',
    `toolbar__section--${align}`,
    className
  );

  return <div className={sectionClasses}>{children}</div>;
};

/**
 * ToolbarDivider Component
 *
 * A vertical divider for separating toolbar items.
 */
export interface ToolbarDividerProps {
  /** Additional CSS class names */
  className?: string;
}

export const ToolbarDivider: React.FC<ToolbarDividerProps> = ({ className }) => {
  const dividerClasses = classNames('toolbar__divider', className);
  return <div className={dividerClasses} role="separator" aria-orientation="vertical" />;
};

/**
 * ToolbarGroup Component
 *
 * A helper component for grouping related toolbar items.
 */
export interface ToolbarGroupProps {
  /** Group content */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Gap size between items */
  gap?: 'sm' | 'md' | 'lg';
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  className,
  gap = 'md',
}) => {
  const groupClasses = classNames(
    'toolbar__group',
    `toolbar__group--gap-${gap}`,
    className
  );

  return <div className={groupClasses}>{children}</div>;
};

/**
 * Default export
 */
export default Toolbar;
