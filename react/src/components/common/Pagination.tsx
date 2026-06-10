import React from 'react';
import { Pagination as CarbonPagination } from '@carbon/react';

export interface PaginationProps {
  totalItems: number;
  pageSize: number;
  pageSizes?: number[];
  page: number;
  onChange: (data: { page: number; pageSize: number }) => void;
  disabled?: boolean;
  isLastPage?: boolean;
  pageInputDisabled?: boolean;
  pageSizeInputDisabled?: boolean;
  pagesUnknown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  pageSizes = [10, 20, 30, 40, 50],
  page,
  onChange,
  disabled = false,
  isLastPage = false,
  pageInputDisabled = false,
  pageSizeInputDisabled = false,
  pagesUnknown = false,
  size = 'md',
}) => {
  return (
    <CarbonPagination
      totalItems={totalItems}
      pageSize={pageSize}
      pageSizes={pageSizes}
      page={page}
      onChange={onChange}
      disabled={disabled}
      isLastPage={isLastPage}
      pageInputDisabled={pageInputDisabled}
      pageSizeInputDisabled={pageSizeInputDisabled}
      pagesUnknown={pagesUnknown}
      size={size}
    />
  );
};
