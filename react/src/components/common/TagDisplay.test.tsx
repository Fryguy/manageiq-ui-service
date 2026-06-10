import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagDisplay, TagItem } from './TagDisplay';

describe('TagDisplay', () => {
  const mockTags: TagItem[] = [
    { id: '1', label: 'Production', type: 'blue' },
    { id: '2', label: 'Critical', type: 'red' },
    { id: '3', label: 'Active', type: 'green' },
  ];

  it('renders all tags', () => {
    render(<TagDisplay tags={mockTags} />);
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not render when tags array is empty', () => {
    const { container } = render(<TagDisplay tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    render(<TagDisplay tags={mockTags} className="custom-tags" />);
    expect(screen.getByTestId('tag-display')).toHaveClass('custom-tags');
  });

  it('renders tags with correct test IDs', () => {
    render(<TagDisplay tags={mockTags} />);
    expect(screen.getByTestId('tag-display-tag-0')).toBeInTheDocument();
    expect(screen.getByTestId('tag-display-tag-1')).toBeInTheDocument();
    expect(screen.getByTestId('tag-display-tag-2')).toBeInTheDocument();
  });

  it('renders removable tags when removable is true', () => {
    const handleRemove = jest.fn();
    render(<TagDisplay tags={mockTags} removable onRemove={handleRemove} />);
    
    const firstTag = screen.getByTestId('tag-display-tag-0');
    expect(firstTag).toBeInTheDocument();
  });

  it('calls onRemove when tag is removed', () => {
    const handleRemove = jest.fn();
    render(<TagDisplay tags={mockTags} removable onRemove={handleRemove} />);
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);
    
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('does not show close button when removable is false', () => {
    render(<TagDisplay tags={mockTags} removable={false} />);
    const closeButtons = screen.queryAllByRole('button');
    expect(closeButtons).toHaveLength(0);
  });

  it('limits displayed tags with maxDisplay', () => {
    render(<TagDisplay tags={mockTags} maxDisplay={2} />);
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('shows remaining count when maxDisplay is exceeded', () => {
    render(<TagDisplay tags={mockTags} maxDisplay={2} />);
    expect(screen.getByTestId('tag-display-more')).toHaveTextContent('+1 more');
  });

  it('does not show remaining count when all tags are displayed', () => {
    render(<TagDisplay tags={mockTags} maxDisplay={3} />);
    expect(screen.queryByTestId('tag-display-more')).not.toBeInTheDocument();
  });

  it('uses custom testId', () => {
    render(<TagDisplay tags={mockTags} testId="custom-tag-display" />);
    expect(screen.getByTestId('custom-tag-display')).toBeInTheDocument();
  });

  it('renders tags with different types', () => {
    const typedTags: TagItem[] = [
      { id: '1', label: 'Default', type: 'default' },
      { id: '2', label: 'Blue', type: 'blue' },
      { id: '3', label: 'Green', type: 'green' },
      { id: '4', label: 'Red', type: 'red' },
      { id: '5', label: 'Purple', type: 'purple' },
      { id: '6', label: 'Gray', type: 'gray' },
    ];

    render(<TagDisplay tags={typedTags} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Purple')).toBeInTheDocument();
    expect(screen.getByText('Gray')).toBeInTheDocument();
  });

  it('renders tags without type as default', () => {
    const tagsWithoutType: TagItem[] = [
      { id: '1', label: 'No Type' },
    ];

    render(<TagDisplay tags={tagsWithoutType} />);
    expect(screen.getByText('No Type')).toBeInTheDocument();
  });

  it('handles multiple tag removals', () => {
    const handleRemove = jest.fn();
    render(<TagDisplay tags={mockTags} removable onRemove={handleRemove} />);
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);
    fireEvent.click(closeButtons[1]);
    
    expect(handleRemove).toHaveBeenCalledTimes(2);
    expect(handleRemove).toHaveBeenNthCalledWith(1, '1');
    expect(handleRemove).toHaveBeenNthCalledWith(2, '2');
  });

  it('calculates remaining count correctly', () => {
    const manyTags: TagItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      label: `Tag ${i + 1}`,
    }));

    render(<TagDisplay tags={manyTags} maxDisplay={3} />);
    expect(screen.getByTestId('tag-display-more')).toHaveTextContent('+7 more');
  });

  it('does not call onRemove when removable is false', () => {
    const handleRemove = jest.fn();
    render(<TagDisplay tags={mockTags} removable={false} onRemove={handleRemove} />);
    
    // No close buttons should be present
    const closeButtons = screen.queryAllByRole('button');
    expect(closeButtons).toHaveLength(0);
    expect(handleRemove).not.toHaveBeenCalled();
  });
});
