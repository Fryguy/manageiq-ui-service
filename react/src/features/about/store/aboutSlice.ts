/**
 * Redux slice for about feature
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AboutState } from '../types';

export interface AboutModalInfo {
  version?: string;
  suiVersion?: string;
  serverName?: string;
  userName?: string;
  userRole?: string;
  copyright?: string;
  supportWebsiteText?: string;
  supportWebsite?: string;
  documentationUrl?: string;
}

interface AboutStateExtended extends AboutState {
  modalInfo: AboutModalInfo | null;
}

const initialState: AboutStateExtended = {
  appInfo: null,
  modalInfo: null,
  loading: false,
  error: null,
};

/**
 * Fetch application information for the About modal
 * This fetches appliance info from the ManageIQ API
 */
export const fetchAboutModalInfo = createAsyncThunk<AboutModalInfo>(
  'about/fetchAboutModalInfo',
  async () => {
    // TODO: Replace with actual API call to fetch appliance info
    // const response = await apiClient.get('/api/appliance_info');
    // For now, return mock data that matches Angular structure
    return {
      version: 'N/A',
      suiVersion: 'N/A',
      serverName: 'N/A',
      userName: 'N/A',
      userRole: 'N/A',
      copyright: '',
      supportWebsiteText: 'Support Website',
      supportWebsite: '',
      documentationUrl: '/support/index?support_tab=about',
    };
  }
);

/**
 * Fetch application information for About modal
 */
export const fetchAppInfo = createAsyncThunk(
  'about/fetchAppInfo',
  async () => {
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
      })
      .addCase(fetchAboutModalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutModalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.modalInfo = action.payload;
      })
      .addCase(fetchAboutModalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch about information';
      });
  },
});

export const { clearError } = aboutSlice.actions;
export default aboutSlice.reducer;