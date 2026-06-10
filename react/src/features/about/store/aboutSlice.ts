/**
 * Redux slice for about feature
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AboutState, AppInfo } from '../types';

const initialState: AboutState = {
  appInfo: null,
  loading: false,
  error: null,
};

/**
 * Fetch application information
 * In a real implementation, this would call an API endpoint
 * For now, we'll return mock data
 */
export const fetchAppInfo = createAsyncThunk<AppInfo>(
  'about/fetchAppInfo',
  async () => {
    // Mock implementation - in production this would call an API
    // e.g., const response = await apiClient.get('/api/about');
    return {
      version: '0.1.0',
      buildDate: new Date().toISOString(),
      gitCommit: 'development',
      licenseName: 'Apache License 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
      copyrightYear: new Date().getFullYear().toString(),
      copyrightHolder: 'ManageIQ',
    };
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.appInfo = action.payload;
      })
      .addCase(fetchAppInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application information';
      });
  },
});

export const { clearError } = aboutSlice.actions;
export default aboutSlice.reducer;
