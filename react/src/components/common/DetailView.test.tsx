import React from 'react';
import { render, screen } from '@testing-library/react';
import { DetailView, DetailItem } from './DetailView';

describe('DetailView', () => {
  const mockItems: DetailItem[] = [
    { label: 'Name', value: 'Test Service' },
    { label: 'Status', value: 'Running' },
    { label: 'Created', value: '2024-01-01' },
    { label: 'Owner', value: 'admin@example.com' },
  ];

  it('renders all detail items', () => {
    render(<DetailView items={mockItems} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('renders labels with correct test IDs', () => {
    render(<DetailView items={mockItems} />);
    expect(screen.getByTestId('detail-view-label-0')).toHaveTextContent('Name');
    expect(screen.getByTestId('detail-view-label-1')).toHaveTextContent('Status');
  });

  it('renders values with correct test IDs', () => {
    render(<DetailView items={mockItems} />);
    expect(screen.getByTestId('detail-view-value-0')).toHaveTextContent('Test Service');
    expect(screen.getByTestId('detail-view-value-1')).toHaveTextContent('Running');
  });

  it('applies custom className', () => {
    render(<DetailView items={mockItems} className="custom-detail" />);
    expect(screen.getByTestId('detail-view')).toHaveClass('custom-detail');
  });

  it('applies horizontal orientation class by default', () => {
    render(<DetailView items={mockItems} />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--horizontal');
  });

  it('applies vertical orientation class when specified', () => {
    render(<DetailView items={mockItems} orientation="vertical" />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--vertical');
  });

  it('applies 2 column class by default', () => {
    render(<DetailView items={mockItems} />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--columns-2');
  });

  it('applies 1 column class when specified', () => {
    render(<DetailView items={mockItems} columns={1} />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--columns-1');
  });

  it('applies 3 column class when specified', () => {
    render(<DetailView items={mockItems} columns={3} />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--columns-3');
  });

  it('applies 4 column class when specified', () => {
    render(<DetailView items={mockItems} columns={4} />);
    expect(screen.getByTestId('detail-view')).toHaveClass('miq-detail-view--columns-4');
  });

  it('uses custom testId', () => {
    render(<DetailView items={mockItems} testId="custom-detail-view" />);
    expect(screen.getByTestId('custom-detail-view')).toBeInTheDocument();
  });

  it('renders React node values', () => {
    const itemsWithNodes: DetailItem[] = [
      { label: 'Name', value: <strong>Bold Name</strong> },
      { label: 'Status', value: <span className="status-badge">Active</span> },
    ];

    render(<DetailView items={itemsWithNodes} />);
    expect(screen.getByText('Bold Name')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<DetailView items={[]} />);
    expect(screen.getByTestId('detail-view')).toBeInTheDocument();
    expect(screen.queryByTestId('detail-view-item-0')).not.toBeInTheDocument();
  });

  it('uses custom keys when provided', () => {
    const itemsWithKeys: DetailItem[] = [
      { key: 'service-name', label: 'Name', value: 'Test' },
      { key: 'service-status', label: 'Status', value: 'Running' },
    ];

    const { container } = render(<DetailView items={itemsWithKeys} />);
    const items = container.querySelectorAll('.miq-detail-view__item');
    expect(items).toHaveLength(2);
  });

  it('generates keys from label and index when key not provided', () => {
    const { container } = render(<DetailView items={mockItems} />);
    const items = container.querySelectorAll('.miq-detail-view__item');
    expect(items).toHaveLength(4);
  });

  it('renders all items with correct structure', () => {
    render(<DetailView items={mockItems} />);
    
    mockItems.forEach((item, index) => {
      expect(screen.getByTestId(`detail-view-item-${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`detail-view-label-${index}`)).toHaveTextContent(item.label);
      expect(screen.getByTestId(`detail-view-value-${index}`)).toHaveTextContent(item.value as string);
    });
  });

  it('handles complex value content', () => {
    const complexItems: DetailItem[] = [
      {
        label: 'Resources',
        value: (
          <div>
            <p>CPU: 2 cores</p>
            <p>Memory: 4GB</p>
          </div>
        ),
      },
    ];

    render(<DetailView items={complexItems} />);
    expect(screen.getByText('CPU: 2 cores')).toBeInTheDocument();
    expect(screen.getByText('Memory: 4GB')).toBeInTheDocument();
  });
});
