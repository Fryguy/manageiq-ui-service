import React from 'react';
import classNames from 'classnames';
import './DetailView.scss';

export interface DetailItem {
  /** Label for the detail */
  label: string;
  /** Value to display */
  value: React.ReactNode;
  /** Optional key for the item */
  key?: string;
}

export interface DetailViewProps {
  /** Array of detail items to display */
  items: DetailItem[];
  /** Additional CSS classes */
  className?: string;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Column count for grid layout */
  columns?: 1 | 2 | 3 | 4;
  /** Test ID for testing */
  testId?: string;
}

/**
 * DetailView component for displaying key-value pairs in a structured format.
 * Useful for showing entity details, properties, and metadata.
 */
export const DetailView: React.FC<DetailViewProps> = ({
  items,
  className,
  orientation = 'horizontal',
  columns = 2,
  testId = 'detail-view',
}) => {
  const detailViewClasses = classNames(
    'miq-detail-view',
    `miq-detail-view--${orientation}`,
    `miq-detail-view--columns-${columns}`,
    className
  );

  return (
    <div className={detailViewClasses} data-testid={testId}>
      {items.map((item, index) => {
        const itemKey = item.key || `${item.label}-${index}`;
        return (
          <div
            key={itemKey}
            className="miq-detail-view__item"
            data-testid={`${testId}-item-${index}`}
          >
            <dt
              className="miq-detail-view__label"
              data-testid={`${testId}-label-${index}`}
            >
              {item.label}
            </dt>
            <dd
              className="miq-detail-view__value"
              data-testid={`${testId}-value-${index}`}
            >
              {item.value}
            </dd>
          </div>
        );
      })}
    </div>
  );
};

export default DetailView;
