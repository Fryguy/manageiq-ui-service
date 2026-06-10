/**
 * Dashboard Redux slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { servicesApi, Service } from '../../../api/services';
import { ordersApi, Order } from '../../../api/orders';
import type { DashboardState, ServiceSummary, RecentService, RecentOrder } from '../types';

const initialState: DashboardState = {
  serviceSummary: null,
  recentServices: [],
  recentOrders: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Fetch service summary statistics
 */
export const fetchServiceSummary = createAsyncThunk(
  'dashboard/fetchServiceSummary',
  async () => {
    const response = await servicesApi.getServices({
      expand: 'resources',
      attributes: 'power_state',
      limit: 1000,
    });

    const services = response.resources || [];
    const summary: ServiceSummary = {
      total: services.length,
      running: services.filter((s) => s.power_state === 'on').length,
      stopped: services.filter((s) => s.power_state === 'off').length,
      suspended: services.filter((s) => s.power_state === 'suspended').length,
      retired: services.filter((s) => s.retired === true).length,
    };

    return summary;
  }
);

/**
 * Fetch recent services
 */
export const fetchRecentServices = createAsyncThunk(
  'dashboard/fetchRecentServices',
  async () => {
    const response = await servicesApi.getServices({
      expand: 'resources',
      attributes: 'id,name,description,created_at,power_state',
      sort_by: 'created_at',
      sort_order: 'desc',
      limit: 5,
    });

    return (response.resources || []).map((service: Service) => ({
      id: service.id,
      name: service.name || '',
      description: service.description,
      created_at: service.created_at || '',
      power_state: service.power_state,
    })) as RecentService[];
  }
);

/**
 * Fetch recent orders
 */
export const fetchRecentOrders = createAsyncThunk(
  'dashboard/fetchRecentOrders',
  async () => {
    const response = await ordersApi.getOrders({
      expand: 'resources',
      attributes: 'id,description,state,created_on,updated_on,approval_state,type',
      sort_by: 'created_on',
      sort_order: 'desc',
      limit: 5,
    });

    return (response.resources || []).map((order: Order) => ({
      id: order.id,
      description: order.description || '',
      state: order.request_state || '',
      created_on: order.created_on || '',
      updated_on: order.updated_on || '',
      approval_state: order.approval_state || '',
      type: order.type || '',
    })) as RecentOrder[];
  }
);

/**
 * Fetch all dashboard data
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchServiceSummary()),
      dispatch(fetchRecentServices()),
      dispatch(fetchRecentOrders()),
    ]);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.serviceSummary = null;
      state.recentServices = [];
      state.recentOrders = [];
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch service summary
    builder
      .addCase(fetchServiceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceSummary.fulfilled, (state, action: PayloadAction<ServiceSummary>) => {
        state.serviceSummary = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchServiceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service summary';
      });

    // Fetch recent services
    builder
      .addCase(fetchRecentServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentServices.fulfilled, (state, action: PayloadAction<RecentService[]>) => {
        state.recentServices = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRecentServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recent services';
      });

    // Fetch recent orders
    builder
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action: PayloadAction<RecentOrder[]>) => {
        state.recentOrders = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recent orders';
      });

    // Fetch all dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
