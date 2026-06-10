/**
 * Dashboard slice tests
 */

import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, {
  fetchServiceSummary,
  fetchRecentServices,
  fetchRecentOrders,
  fetchDashboardData,
  clearDashboard,
} from './dashboardSlice';
import { servicesApi } from '../../../api/services';
import { ordersApi } from '../../../api/orders';

jest.mock('../../../api/services');
jest.mock('../../../api/orders');

const mockServicesApi = servicesApi as jest.Mocked<typeof servicesApi>;
const mockOrdersApi = ordersApi as jest.Mocked<typeof ordersApi>;

describe('dashboardSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        dashboard: dashboardReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = store.getState().dashboard;
      expect(state).toEqual({
        serviceSummary: null,
        recentServices: [],
        recentOrders: [],
        loading: false,
        error: null,
        lastUpdated: null,
      });
    });
  });

  describe('clearDashboard', () => {
    it('clears dashboard state', () => {
      store.dispatch(clearDashboard());
      const state = store.getState().dashboard;
      expect(state.serviceSummary).toBeNull();
      expect(state.recentServices).toEqual([]);
      expect(state.recentOrders).toEqual([]);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).toBeNull();
    });
  });

  describe('fetchServiceSummary', () => {
    it('fetches and calculates service summary', async () => {
      const mockServices = {
        resources: [
          { id: '1', power_state: 'on' },
          { id: '2', power_state: 'on' },
          { id: '3', power_state: 'off' },
          { id: '4', power_state: 'suspended' },
          { id: '5', retired: true },
        ],
      };

      mockServicesApi.getServices.mockResolvedValue(mockServices);

      await store.dispatch(fetchServiceSummary());

      const state = store.getState().dashboard;
      expect(state.serviceSummary).toEqual({
        total: 5,
        running: 2,
        stopped: 1,
        suspended: 1,
        retired: 1,
      });
      expect(state.lastUpdated).toBeTruthy();
    });

    it('handles fetch error', async () => {
      mockServicesApi.getServices.mockRejectedValue(new Error('API Error'));

      await store.dispatch(fetchServiceSummary());

      const state = store.getState().dashboard;
      expect(state.error).toBe('API Error');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchRecentServices', () => {
    it('fetches recent services', async () => {
      const mockServices = {
        resources: [
          {
            id: '1',
            href: '/api/services/1',
            name: 'Service 1',
            description: 'Test service',
          created_at: '2026-06-10T10:00:00Z',
            power_state: 'on',
            service_template_name: 'Template 1',
          },
        ],
      };

      mockServicesApi.getServices.mockResolvedValue(mockServices);

      await store.dispatch(fetchRecentServices());

      const state = store.getState().dashboard;
      expect(state.recentServices).toEqual([
        {
          id: '1',
          name: 'Service 1',
          description: 'Test service',
          created_at: '2026-06-10T10:00:00Z',
          power_state: 'on',
        },
      ]);
      expect(state.lastUpdated).toBeTruthy();
    });

    it('handles fetch error', async () => {
      mockServicesApi.getServices.mockRejectedValue(new Error('API Error'));

      await store.dispatch(fetchRecentServices());

      const state = store.getState().dashboard;
      expect(state.error).toBe('API Error');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchRecentOrders', () => {
    it('fetches recent orders', async () => {
      const mockOrders = {
        resources: [
          {
            id: '1',
            href: '/api/service_requests/1',
            description: 'Order 1',
            request_state: 'finished',
            created_on: '2026-06-10T10:00:00Z',
            updated_on: '2026-06-10T11:00:00Z',
            approval_state: 'approved',
            type: 'ServiceTemplateProvisionRequest',
          },
        ],
      };

      mockOrdersApi.getOrders.mockResolvedValue(mockOrders);

      await store.dispatch(fetchRecentOrders());

      const state = store.getState().dashboard;
      expect(state.recentOrders).toEqual([
        {
          id: '1',
          description: 'Order 1',
          state: 'finished',
          created_on: '2026-06-10T10:00:00Z',
          updated_on: '2026-06-10T11:00:00Z',
          approval_state: 'approved',
          type: 'ServiceTemplateProvisionRequest',
        },
      ]);
      expect(state.lastUpdated).toBeTruthy();
    });

    it('handles fetch error', async () => {
      mockOrdersApi.getOrders.mockRejectedValue(new Error('API Error'));

      await store.dispatch(fetchRecentOrders());

      const state = store.getState().dashboard;
      expect(state.error).toBe('API Error');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchDashboardData', () => {
    it('fetches all dashboard data', async () => {
      mockServicesApi.getServices.mockResolvedValue({ resources: [] });
      mockOrdersApi.getOrders.mockResolvedValue({ resources: [] });

      await store.dispatch(fetchDashboardData());

      const state = store.getState().dashboard;
      expect(state.loading).toBe(false);
    });

    it('handles fetch error', async () => {
      mockServicesApi.getServices.mockRejectedValue(new Error('API Error'));

      await store.dispatch(fetchDashboardData());

      const state = store.getState().dashboard;
      expect(state.error).toBeTruthy();
      expect(state.loading).toBe(false);
    });
  });
});
