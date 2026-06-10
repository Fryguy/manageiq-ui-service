import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterBar, FilterCategory, ActiveFilter } from './FilterBar';

describe('FilterBar', () => {
  const mockCategories: FilterCategory[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect',
      options: [
        { id: 'running', label: 'Running', value: 'running' },
        { id: 'stopped', label: 'Stopped', value: 'stopped' },
      ],
    },
    {
      id: 'type',
      label: 'Type',
      type: 'dropdown',
      options: [
        { id: 'vm', label: 'Virtual Machine', value: 'vm' },
        { id: 'container', label: 'Container', value: 'container' },
      ],
    },
  ];

  const mockActiveFilters: ActiveFilter[] = [
    {
      categoryId: 'status',
      categoryLabel: 'Status',
      optionId: 'running',
      optionLabel: 'Running',
    },
  ];

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders filter categories', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={[]}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('displays active filters as tags', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={mockActiveFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.getByText(/Status: Running/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when removing a filter', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={mockActiveFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /clear filter/i });
    fireEvent.click(closeButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith([]);
  });

  it('calls onClearAll when clear all button is clicked', () => {
    const onClearAll = jest.fn();
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={mockActiveFilters}
        onFilterChange={mockOnFilterChange}
        onClearAll={onClearAll}
      />
    );
    
    const clearAllButton = screen.getByText(/clear all/i);
    fireEvent.click(clearAllButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith([]);
    expect(onClearAll).toHaveBeenCalled();
  });

  it('does not show clear all button when no active filters', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={[]}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
  });

  it('disables controls when disabled prop is true', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={mockActiveFilters}
        onFilterChange={mockOnFilterChange}
        disabled
      />
    );
    
    const clearAllButton = screen.getByText(/clear all/i);
    expect(clearAllButton).toBeDisabled();
  });

  it('shows active filters label when filters are present', () => {
    render(
      <FilterBar
        categories={mockCategories}
        activeFilters={mockActiveFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.getByText(/active filters:/i)).toBeInTheDocument();
  });
});