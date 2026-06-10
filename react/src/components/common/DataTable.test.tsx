import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  const mockColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'date', header: 'Date', sortable: false },
  ];

  const mockRows = [
    { id: '1', name: 'Service A', status: 'Running', date: '2026-01-01' },
    { id: '2', name: 'Service B', status: 'Stopped', date: '2026-01-02' },
    { id: '3', name: 'Service C', status: 'Running', date: '2026-01-03' },
  ];

  it('renders table with data', () => {
    render(<DataTable rows={mockRows} columns={mockColumns} />);
    
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('Service B')).toBeInTheDocument();
    expect(screen.getByText('Service C')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataTable rows={mockRows} columns={mockColumns} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('displays empty state when no rows', () => {
    render(
      <DataTable
        rows={[]}
        columns={mockColumns}
        emptyStateMessage="No services found"
      />
    );
    
    expect(screen.getByText('No services found')).toBeInTheDocument();
  });

  it('filters rows based on search term', async () => {
    render(<DataTable rows={mockRows} columns={mockColumns} searchable />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Service A' } });
    
    await waitFor(() => {
      expect(screen.getByText('Service A')).toBeInTheDocument();
      expect(screen.queryByText('Service B')).not.toBeInTheDocument();
      expect(screen.queryByText('Service C')).not.toBeInTheDocument();
    });
  });

  it('sorts rows when clicking sortable column header', () => {
    render(<DataTable rows={mockRows} columns={mockColumns} sortable />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    const rows = screen.getAllByRole('row');
    // First row is header, so data rows start at index 1
    expect(rows[1]).toHaveTextContent('Service A');
  });

  it('handles pagination', () => {
    const manyRows = Array.from({ length: 25 }, (_, i) => ({
      id: `${i}`,
      name: `Service ${i}`,
      status: 'Running',
      date: '2026-01-01',
    }));

    render(
      <DataTable
        rows={manyRows}
        columns={mockColumns}
        paginated
        pageSize={10}
      />
    );
    
    // Should show first 10 items
    expect(screen.getByText('Service 0')).toBeInTheDocument();
    expect(screen.getByText('Service 9')).toBeInTheDocument();
    expect(screen.queryByText('Service 10')).not.toBeInTheDocument();
  });

  it('calls onSearch when search term changes', () => {
    const onSearch = jest.fn();
    render(
      <DataTable
        rows={mockRows}
        columns={mockColumns}
        searchable
        onSearch={onSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('renders with title and description', () => {
    render(
      <DataTable
        rows={mockRows}
        columns={mockColumns}
        title="Services"
        description="List of all services"
      />
    );
    
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('List of all services')).toBeInTheDocument();
  });

  it('disables search when searchable is false', () => {
    render(<DataTable rows={mockRows} columns={mockColumns} searchable={false} />);
    
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('disables pagination when paginated is false', () => {
    render(<DataTable rows={mockRows} columns={mockColumns} paginated={false} />);
    
    // All rows should be visible
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('Service B')).toBeInTheDocument();
    expect(screen.getByText('Service C')).toBeInTheDocument();
  });
});
