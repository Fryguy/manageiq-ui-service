import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react';
import classNames from 'classnames';
import './List.scss';

export interface ListColumn<T = unknown> {
  /** Column key */
  key: string;
  /** Column header label */
  label: string;
  /** Column width (CSS value) */
  width?: string;
  /** Custom render function */
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface ListProps<T = unknown> {
  /** Array of items to display */
  items: T[];
  /** Column definitions */
  columns: ListColumn<T>[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to show header */
  showHeader?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Row click handler */
  onRowClick?: (item: T, index: number) => void;
  /** Test ID for testing */
  testId?: string;
  /** Whether rows are selectable */
  selectable?: boolean;
  /** Selected item IDs */
  selectedIds?: string[];
  /** ID field name */
  idField?: string;
}

/**
 * List component for displaying structured data in a list format.
 * Built on Carbon's StructuredList component.
 */
export const List = <T extends Record<string, unknown>>({
  items,
  columns,
  className,
  showHeader = true,
  emptyMessage = 'No items to display',
  onRowClick,
  testId = 'list',
  selectable = false,
  selectedIds = [],
  idField = 'id',
}: ListProps<T>): React.ReactElement => {
  const listClasses = classNames(
    'miq-list',
    {
      'miq-list--clickable': !!onRowClick,
      'miq-list--selectable': selectable,
    },
    className
  );

  if (items.length === 0) {
    return (
      <div className="miq-list__empty" data-testid={`${testId}-empty`}>
        {emptyMessage}
      </div>
    );
  }

  const isRowSelected = (item: T): boolean => {
    return selectable && selectedIds.includes(String(item[idField]));
  };

  return (
    <StructuredListWrapper className={listClasses} data-testid={testId}>
      {showHeader && (
        <StructuredListHead>
          <StructuredListRow head>
            {columns.map((column) => (
              <StructuredListCell
                key={column.key}
                head
                style={{ width: column.width }}
                data-testid={`${testId}-header-${column.key}`}
              >
                {column.label}
              </StructuredListCell>
            ))}
          </StructuredListRow>
        </StructuredListHead>
      )}
      <StructuredListBody>
        {items.map((item, index) => {
          const rowClasses = classNames('miq-list__row', {
            'miq-list__row--selected': isRowSelected(item),
            'miq-list__row--clickable': !!onRowClick,
          });

          return (
            <StructuredListRow
              key={String(item[idField]) || index}
              className={rowClasses}
              onClick={() => onRowClick?.(item, index)}
              data-testid={`${testId}-row-${index}`}
            >
              {columns.map((column) => {
                const value = item[column.key];
                const content: React.ReactNode = column.render ? column.render(value, item) : String(value ?? '');

                return (
                  <StructuredListCell
                    key={column.key}
                    style={{ width: column.width }}
                    data-testid={`${testId}-cell-${index}-${column.key}`}
                  >
                    {content}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          );
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  );
};

export default List;
