/**
 * Redux slice for about feature
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AboutState } from '../types';
import { getApplianceInfo, getDocumentationUrl } from '../../../api/appliance';

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
    // Fetch both appliance info and documentation URL in parallel
    const [applianceInfo, documentationUrl] = await Promise.all([
      getApplianceInfo(),
      getDocumentationUrl(),
    ]);

    // Get git commit hash from version.json if available
    let suiVersion = 'N/A';
    try {
      const versionResponse = await fetch('/version.json');
      if (versionResponse.ok) {
        const versionData = await versionResponse.json();
        suiVersion = versionData.gitCommit || 'N/A';
      }
    } catch (error) {
      console.warn('Failed to fetch version.json:', error);
    }

    return {
      version: `${applianceInfo.server_info.version}.${applianceInfo.server_info.build}`,
      suiVersion,
      serverName: applianceInfo.server_info.appliance,
      userName: applianceInfo.identity.name,
      userRole: applianceInfo.identity.role,
      copyright: applianceInfo.product_info.copyright,
      supportWebsiteText: applianceInfo.product_info.support_website_text,
      supportWebsite: applianceInfo.product_info.support_website,
      documentationUrl,
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
