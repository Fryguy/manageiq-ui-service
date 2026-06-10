import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders pagination component', () => {
    render(
      <Pagination
        totalItems={100}
        pageSize={10}
        page={1}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText(/1–10 of 100 items/i)).toBeInTheDocument();
  });

  it('calls onChange when page changes', () => {
    render(
      <Pagination
        totalItems={100}
        pageSize={10}
        page={1}
        onChange={mockOnChange}
      />
    );
    
    const nextButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextButton);
    
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        pageSize: 10,
      })
    );
  });

  it('calls onChange when page size changes', () => {
    render(
      <Pagination
        totalItems={100}
        pageSize={10}
        page={1}
        onChange={mockOnChange}
        pageSizes={[10, 20, 30]}
      />
    );
    
    const pageSizeSelect = screen.getByLabelText(/items per page/i);
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 20,
      })
    );
  });

  it('disables pagination when disabled prop is true', () => {
    render(
      <Pagination
        totalItems={100}
        pageSize={10}
        page={1}
        onChange={mockOnChange}
        disabled
      />
    );
    
    const nextButton = screen.getByLabelText(/next page/i);
    expect(nextButton).toBeDisabled();
  });

  it('renders with custom page sizes', () => {
    render(
      <Pagination
        totalItems={100}
        pageSize={25}
        page={1}
        onChange={mockOnChange}
        pageSizes={[25, 50, 75, 100]}
      />
    );
    
    expect(screen.getByText(/1–25 of 100 items/i)).toBeInTheDocument();
  });

  it('handles last page correctly', () => {
    render(
      <Pagination
        totalItems={95}
        pageSize={10}
        page={10}
        onChange={mockOnChange}
        isLastPage
      />
    );
    
    const nextButton = screen.getByLabelText(/next page/i);
    expect(nextButton).toBeDisabled();
  });
});
