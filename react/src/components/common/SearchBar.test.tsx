import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    jest.clearAllTimers();
  });

  it('renders search input', () => {
    render(<SearchBar onChange={mockOnChange} />);
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onChange with debounced value', async () => {
    jest.useFakeTimers();
    
    render(<SearchBar onChange={mockOnChange} debounceMs={300} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnChange).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });
    
    jest.useRealTimers();
  });

  it('updates internal value immediately', () => {
    render(<SearchBar onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(input.value).toBe('test');
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = jest.fn();
    render(<SearchBar onChange={mockOnChange} onClear={onClear} value="test" />);
    
    const clearButton = screen.getByLabelText(/clear search input/i);
    fireEvent.click(clearButton);
    
    expect(onClear).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onChange={mockOnChange} placeholder="Search services..." />);
    
    expect(screen.getByPlaceholderText('Search services...')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<SearchBar onChange={mockOnChange} disabled />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeDisabled();
  });

  it('uses controlled value when provided', () => {
    const { rerender } = render(
      <SearchBar onChange={mockOnChange} value="initial" />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.value).toBe('initial');
    
    rerender(<SearchBar onChange={mockOnChange} value="updated" />);
    expect(input.value).toBe('updated');
  });

  it('renders with custom size', () => {
    render(<SearchBar onChange={mockOnChange} size="lg" />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });
});
