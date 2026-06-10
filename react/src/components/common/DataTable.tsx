import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  DataTable as CarbonDataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableSelectAll,
  TableSelectRow,
  Pagination as CarbonPagination,
} from '@carbon/react';
import { ArrowUp, ArrowDown } from '@carbon/icons-react';

export interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps {
  rows: Array<Record<string, unknown>>;
  columns: Column[];
  title?: string;
  description?: string;
  selectable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onRowSelect?: (selectedRows: Array<Record<string, unknown>>) => void;
  onSearch?: (searchTerm: string) => void;
  emptyStateMessage?: string;
}

interface SortState {
  columnKey: string | null;
  direction: 'ASC' | 'DESC' | 'NONE';
}

export const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  title,
  description,
  selectable = false,
  sortable = true,
  searchable = true,
  paginated = true,
  pageSize = 10,
  onRowSelect,
  onSearch,
  emptyStateMessage = 'No data available',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    columnKey: null,
    direction: 'NONE',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortState.columnKey || sortState.direction === 'NONE') {
      return filteredRows;
    }

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortState.columnKey!] as string | number;
      const bValue = b[sortState.columnKey!] as string | number;

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortState.direction === 'ASC' ? comparison : -comparison;
    });
  }, [filteredRows, sortState]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    if (!paginated) return sortedRows;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, currentPage, itemsPerPage, paginated]);

  const handleSearch = (_event: unknown, value?: string) => {
    const searchValue = value || '';
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page on search
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    setSortState((prev) => {
      if (prev.columnKey !== columnKey) {
        return { columnKey, direction: 'ASC' };
      }

      if (prev.direction === 'NONE') {
        return { columnKey, direction: 'ASC' };
      } else if (prev.direction === 'ASC') {
        return { columnKey, direction: 'DESC' };
      } else {
        return { columnKey: null, direction: 'NONE' };
      }
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (sortState.columnKey !== columnKey) return null;

    if (sortState.direction === 'ASC') {
      return <ArrowUp size={16} />;
    } else if (sortState.direction === 'DESC') {
      return <ArrowDown size={16} />;
    }
    return null;
  };

  const selectedRowsRef = useRef<unknown[]>([]);

  const handleSelectionChange = (selectedRows: unknown[]) => {
    selectedRowsRef.current = selectedRows;
  };

  useEffect(() => {
    if (selectable && onRowSelect && selectedRowsRef.current.length > 0) {
      const selectedData = selectedRowsRef.current.map((row) => row as Record<string, unknown>);
      onRowSelect(selectedData);
    }
  }, [selectable, onRowSelect]);

  return (
    <CarbonDataTable
      rows={paginatedRows.map((row, index) => ({
        id: String(row.id || `row-${index}`),
        ...row,
      }))}
      headers={columns.map((col) => ({
        key: col.key,
        header: col.header,
      }))}
    >
      {({
        rows: tableRows,
        headers,
        getHeaderProps,
        getRowProps,
        getSelectionProps,
        getTableProps,
        getTableContainerProps,
        selectedRows,
      }) => {
        // Update selection ref when selection changes
        if (selectable && selectedRows !== selectedRowsRef.current) {
          handleSelectionChange(selectedRows);
        }

        return (
          <TableContainer
            title={title}
            description={description}
            {...getTableContainerProps()}
          >
            {searchable && (
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={handleSearch}
                    placeholder="Search..."
                    value={searchTerm}
                  />
                </TableToolbarContent>
              </TableToolbar>
            )}
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {selectable && <TableSelectAll {...getSelectionProps()} />}
                  {headers.map((header) => {
                    const column = columns.find((col) => col.key === header.key);
                    const isSortable = sortable && column?.sortable !== false;

                    return (
                      <TableHeader
                        {...getHeaderProps({ header })}
                        key={header.key}
                        isSortable={isSortable}
                        onClick={() => isSortable && handleSort(header.key)}
                        style={{ width: column?.width }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {header.header}
                          {isSortable && getSortIcon(header.key)}
                        </div>
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        {emptyStateMessage}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tableRows.map((row) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { key, ...rowPropsWithoutKey } = getRowProps({ row });
                    return (
                      <TableRow key={row.id} {...rowPropsWithoutKey}>
                        {selectable && <TableSelectRow {...getSelectionProps({ row })} />}
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{String(cell.value ?? '')}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            {paginated && sortedRows.length > 0 && (
              <CarbonPagination
                totalItems={sortedRows.length}
                pageSize={itemsPerPage}
                pageSizes={[10, 20, 30, 40, 50]}
                page={currentPage}
                onChange={({ page, pageSize }: { page: number; pageSize: number }) => {
                  setCurrentPage(page);
                  setItemsPerPage(pageSize);
                }}
              />
            )}
          </TableContainer>
        );
      }}
    </CarbonDataTable>
  );
};
