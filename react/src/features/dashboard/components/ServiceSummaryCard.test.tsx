/**
 * ServiceSummaryCard component tests
 */

import { render, screen } from '@testing-library/react';
import { ServiceSummaryCard } from './ServiceSummaryCard';
import type { ServiceSummary } from '../types';

describe('ServiceSummaryCard', () => {
  const mockSummary: ServiceSummary = {
    total: 100,
    running: 60,
    stopped: 20,
    suspended: 15,
    retired: 5,
  };

  it('renders loading state', () => {
    render(<ServiceSummaryCard summary={null} loading={true} />);

    expect(screen.getByText('Service Summary')).toBeInTheDocument();
  });

  it('renders summary data correctly', () => {
    render(<ServiceSummaryCard summary={mockSummary} loading={false} />);

    expect(screen.getByText('Service Summary')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Services')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('Stopped')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Retired')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with zero values', () => {
    const zeroSummary: ServiceSummary = {
      total: 0,
      running: 0,
      stopped: 0,
      suspended: 0,
      retired: 0,
    };

    render(<ServiceSummaryCard summary={zeroSummary} loading={false} />);

    expect(screen.getByText('Total Services')).toBeInTheDocument();
    const counts = screen.getAllByText('0');
    expect(counts.length).toBeGreaterThan(0);
  });

  it('applies loading class when loading', () => {
    const { container } = render(
      <ServiceSummaryCard summary={null} loading={true} />
    );

    expect(
      container.querySelector('.service-summary-card--loading')
    ).toBeInTheDocument();
  });
});
