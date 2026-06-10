/**
 * QuickActionsWidget component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QuickActionsWidget } from './QuickActionsWidget';
import authReducer from '../../auth/store/authSlice';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (features: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'test-token',
          user: { userid: 'testuser', name: 'Test User' },
          features,
        },
        loading: false,
        error: null,
      },
    },
  });
};

describe('QuickActionsWidget', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders with all permissions', () => {
    const store = createMockStore({
      svc_catalog_provision: true,
      service: true,
      service_view: true,
      miq_request_show_list: true,
      miq_request_show: true,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuickActionsWidget />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Browse Catalog')).toBeInTheDocument();
    expect(screen.getByText('View Services')).toBeInTheDocument();
    expect(screen.getByText('View Orders')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('filters actions based on permissions', () => {
    const store = createMockStore({
      svc_catalog_provision: true,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuickActionsWidget />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Browse Catalog')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.queryByText('View Services')).not.toBeInTheDocument();
    expect(screen.queryByText('View Orders')).not.toBeInTheDocument();
  });

  it('renders nothing when no permissions', () => {
    const store = createMockStore({});

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <QuickActionsWidget />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('navigates on action click', () => {
    const store = createMockStore({
      svc_catalog_provision: true,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuickActionsWidget />
        </BrowserRouter>
      </Provider>
    );

    const catalogButton = screen.getByText('Browse Catalog');
    fireEvent.click(catalogButton);

    expect(mockNavigate).toHaveBeenCalledWith('/catalogs');
  });

  it('supports hasAny permission check', () => {
    const store = createMockStore({
      service_view: true,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuickActionsWidget />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('View Services')).toBeInTheDocument();
  });
});
