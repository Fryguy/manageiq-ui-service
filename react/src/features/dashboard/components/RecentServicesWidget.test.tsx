/**
 * RecentServicesWidget component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecentServicesWidget } from './RecentServicesWidget';
import type { RecentService } from '../types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RecentServicesWidget', () => {
  const mockServices: RecentService[] = [
    {
      id: '1',
      name: 'Test Service 1',
      description: 'Test Description 1',
      created_at: '2026-06-10T10:00:00Z',
      power_state: 'on',
    },
    {
      id: '2',
      name: 'Test Service 2',
      created_at: '2026-06-10T11:00:00Z',
      power_state: 'off',
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders loading state', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={[]} loading={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('Recent Services')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={[]} loading={false} />
      </BrowserRouter>
    );

    expect(screen.getByText('Recent Services')).toBeInTheDocument();
    expect(screen.getByText('No services found')).toBeInTheDocument();
  });

  it('renders services list', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={mockServices} loading={false} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Service 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Service 2')).toBeInTheDocument();
  });

  it('navigates to service details on click', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={mockServices} loading={false} />
      </BrowserRouter>
    );

    const serviceItem = screen.getByText('Test Service 1').closest('div[role="button"]');
    fireEvent.click(serviceItem!);

    expect(mockNavigate).toHaveBeenCalledWith('/services/1');
  });

  it('navigates to services list on View All click', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={mockServices} loading={false} />
      </BrowserRouter>
    );

    const viewAllButton = screen.getByText('View All');
    fireEvent.click(viewAllButton);

    expect(mockNavigate).toHaveBeenCalledWith('/services');
  });

  it('handles keyboard navigation', () => {
    render(
      <BrowserRouter>
        <RecentServicesWidget services={mockServices} loading={false} />
      </BrowserRouter>
    );

    const serviceItem = screen.getByText('Test Service 1').closest('div[role="button"]');
    fireEvent.keyDown(serviceItem!, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/services/1');
  });
});
