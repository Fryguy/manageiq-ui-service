/**
 * RecentOrdersWidget component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecentOrdersWidget } from './RecentOrdersWidget';
import type { RecentOrder } from '../types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RecentOrdersWidget', () => {
  const mockOrders: RecentOrder[] = [
    {
      id: '1',
      description: 'Test Order 1',
      state: 'finished',
      created_on: '2026-06-10T10:00:00Z',
      updated_on: '2026-06-10T11:00:00Z',
      approval_state: 'approved',
      type: 'ServiceTemplateProvisionRequest',
    },
    {
      id: '2',
      description: 'Test Order 2',
      state: 'pending',
      created_on: '2026-06-10T11:00:00Z',
      updated_on: '2026-06-10T11:30:00Z',
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders loading state', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={[]} loading={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={[]} loading={false} />
      </BrowserRouter>
    );

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('No orders found')).toBeInTheDocument();
  });

  it('renders orders list', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={mockOrders} loading={false} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Order 1')).toBeInTheDocument();
    expect(screen.getByText('Test Order 2')).toBeInTheDocument();
  });

  it('navigates to order details on click', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={mockOrders} loading={false} />
      </BrowserRouter>
    );

    const orderItem = screen.getByText('Test Order 1').closest('div[role="button"]');
    fireEvent.click(orderItem!);

    expect(mockNavigate).toHaveBeenCalledWith('/orders/1');
  });

  it('navigates to orders list on View All click', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={mockOrders} loading={false} />
      </BrowserRouter>
    );

    const viewAllButton = screen.getByText('View All');
    fireEvent.click(viewAllButton);

    expect(mockNavigate).toHaveBeenCalledWith('/orders');
  });

  it('handles keyboard navigation', () => {
    render(
      <BrowserRouter>
        <RecentOrdersWidget orders={mockOrders} loading={false} />
      </BrowserRouter>
    );

    const orderItem = screen.getByText('Test Order 1').closest('div[role="button"]');
    fireEvent.keyDown(orderItem!, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/orders/1');
  });
});
