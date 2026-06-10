/**
 * DashboardPage integration tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { DashboardPage } from './DashboardPage';
import dashboardReducer from '../store/dashboardSlice';
import authReducer from '../../auth/store/authSlice';
import uiReducer from '../../../store/uiSlice';
import { servicesApi } from '../../../api/services';
import { ordersApi } from '../../../api/orders';

jest.mock('../../../api/services');
jest.mock('../../../api/orders');

const mockServicesApi = servicesApi as jest.Mocked<typeof servicesApi>;
const mockOrdersApi = ordersApi as jest.Mocked<typeof ordersApi>;

const createMockStore = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'test-token',
          user: { userid: 'testuser', name: 'Test User' },
          features: {
            svc_catalog_provision: true,
            service: true,
            miq_request_show_list: true,
          },
        },
        loading: false,
        error: null,
      },
    },
  });
};

describe('DashboardPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard page and fetches data', async () => {
    const mockServices = {
      resources: [
        {
          id: '1',
          name: 'Service 1',
          created_at: '2026-06-10T10:00:00Z',
          power_state: 'on',
        },
      ],
    };

    const mockOrders = {
      resources: [
        {
          id: '1',
          description: 'Order 1',
          state: 'finished',
          created_on: '2026-06-10T10:00:00Z',
          updated_on: '2026-06-10T11:00:00Z',
        },
      ],
    };

    mockServicesApi.getServices.mockResolvedValue(mockServices);
    mockOrdersApi.getOrders.mockResolvedValue(mockOrders);

    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Order 1')).toBeInTheDocument();
    });
  });

  it('displays error state on fetch failure', async () => {
    mockServicesApi.getServices.mockRejectedValue(new Error('API Error'));
    mockOrdersApi.getOrders.mockRejectedValue(new Error('API Error'));

    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard')).toBeInTheDocument();
    });
  });

  it('renders all dashboard widgets', async () => {
    mockServicesApi.getServices.mockResolvedValue({ resources: [] });
    mockOrdersApi.getOrders.mockResolvedValue({ resources: [] });

    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Service Summary')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Recent Services')).toBeInTheDocument();
      expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    });
  });
});
