import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { List, ListColumn } from './List';

describe('List', () => {
  const mockColumns: ListColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Created' },
  ];

  const mockItems = [
    { id: '1', name: 'Item 1', status: 'Active', created: '2024-01-01' },
    { id: '2', name: 'Item 2', status: 'Inactive', created: '2024-01-02' },
    { id: '3', name: 'Item 3', status: 'Active', created: '2024-01-03' },
  ];

  it('renders list with items', () => {
    render(<List items={mockItems} columns={mockColumns} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<List items={mockItems} columns={mockColumns} />);
    expect(screen.getByTestId('list-header-name')).toHaveTextContent('Name');
    expect(screen.getByTestId('list-header-status')).toHaveTextContent('Status');
    expect(screen.getByTestId('list-header-created')).toHaveTextContent('Created');
  });

  it('hides headers when showHeader is false', () => {
    render(<List items={mockItems} columns={mockColumns} showHeader={false} />);
    expect(screen.queryByTestId('list-header-name')).not.toBeInTheDocument();
  });

  it('displays empty message when no items', () => {
    render(<List items={[]} columns={mockColumns} />);
    expect(screen.getByTestId('list-empty')).toHaveTextContent('No items to display');
  });

  it('displays custom empty message', () => {
    render(<List items={[]} columns={mockColumns} emptyMessage="No services found" />);
    expect(screen.getByTestId('list-empty')).toHaveTextContent('No services found');
  });

  it('applies custom className', () => {
    render(<List items={mockItems} columns={mockColumns} className="custom-list" />);
    expect(screen.getByTestId('list')).toHaveClass('custom-list');
  });

  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = jest.fn();
    render(<List items={mockItems} columns={mockColumns} onRowClick={handleRowClick} />);
    
    fireEvent.click(screen.getByTestId('list-row-0'));
    expect(handleRowClick).toHaveBeenCalledWith(mockItems[0], 0);
  });

  it('applies clickable class when onRowClick is provided', () => {
    const handleRowClick = jest.fn();
    render(<List items={mockItems} columns={mockColumns} onRowClick={handleRowClick} />);
    expect(screen.getByTestId('list')).toHaveClass('miq-list--clickable');
  });

  it('renders custom cell content with render function', () => {
    const columnsWithRender: ListColumn[] = [
      { key: 'name', label: 'Name' },
      {
        key: 'status',
        label: 'Status',
        render: (value) => <span className="status-badge">{value.toUpperCase()}</span>,
      },
    ];

    render(<List items={mockItems} columns={columnsWithRender} />);
    const activeElements = screen.getAllByText('ACTIVE');
    expect(activeElements.length).toBeGreaterThan(0);
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('applies column width styles', () => {
    const columnsWithWidth: ListColumn[] = [
      { key: 'name', label: 'Name', width: '40%' },
      { key: 'status', label: 'Status', width: '30%' },
      { key: 'created', label: 'Created', width: '30%' },
    ];

    render(<List items={mockItems} columns={columnsWithWidth} />);
    const nameHeader = screen.getByTestId('list-header-name');
    expect(nameHeader).toHaveStyle({ width: '40%' });
  });

  it('uses custom testId', () => {
    render(<List items={mockItems} columns={mockColumns} testId="custom-list" />);
    expect(screen.getByTestId('custom-list')).toBeInTheDocument();
  });

  it('handles selectable rows', () => {
    render(
      <List
        items={mockItems}
        columns={mockColumns}
        selectable
        selectedIds={['1', '3']}
      />
    );
    expect(screen.getByTestId('list')).toHaveClass('miq-list--selectable');
    expect(screen.getByTestId('list-row-0')).toHaveClass('miq-list__row--selected');
    expect(screen.getByTestId('list-row-2')).toHaveClass('miq-list__row--selected');
    expect(screen.getByTestId('list-row-1')).not.toHaveClass('miq-list__row--selected');
  });

  it('uses custom idField for selection', () => {
    const itemsWithCustomId = [
      { customId: 'a', name: 'Item A', status: 'Active' },
      { customId: 'b', name: 'Item B', status: 'Inactive' },
    ];

    render(
      <List
        items={itemsWithCustomId}
        columns={mockColumns}
        selectable
        selectedIds={['a']}
        idField="customId"
      />
    );
    expect(screen.getByTestId('list-row-0')).toHaveClass('miq-list__row--selected');
  });

  it('renders all cell values correctly', () => {
    render(<List items={mockItems} columns={mockColumns} />);
    
    // Check first row
    expect(screen.getByTestId('list-cell-0-name')).toHaveTextContent('Item 1');
    expect(screen.getByTestId('list-cell-0-status')).toHaveTextContent('Active');
    expect(screen.getByTestId('list-cell-0-created')).toHaveTextContent('2024-01-01');
    
    // Check second row
    expect(screen.getByTestId('list-cell-1-name')).toHaveTextContent('Item 2');
    expect(screen.getByTestId('list-cell-1-status')).toHaveTextContent('Inactive');
  });

  it('passes item to render function', () => {
    const renderSpy = jest.fn((value, item) => `${item.name}: ${value}`);
    const columnsWithSpy: ListColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status', render: renderSpy },
    ];

    render(<List items={mockItems} columns={columnsWithSpy} />);
    expect(renderSpy).toHaveBeenCalledWith('Active', mockItems[0]);
    expect(screen.getByText('Item 1: Active')).toBeInTheDocument();
  });
});
