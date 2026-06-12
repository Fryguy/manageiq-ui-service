/**
 * Tests for about Redux slice
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import aboutReducer, { fetchAboutModalInfo, fetchAppInfo, clearError } from './aboutSlice';
import * as applianceApi from '../../../api/appliance';

// Mock the appliance API
jest.mock('../../../api/appliance');

const mockGetApplianceInfo = applianceApi.getApplianceInfo as jest.MockedFunction<typeof applianceApi.getApplianceInfo>;
const mockGetDocumentationUrl = applianceApi.getDocumentationUrl as jest.MockedFunction<typeof applianceApi.getDocumentationUrl>;

// Mock fetch for version.json
global.fetch = jest.fn();

describe('aboutSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        about: aboutReducer,
      },
    });
  });

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = store.getState().about;

      expect(state.appInfo).toBeNull();
      expect(state.modalInfo).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('clears error state', () => {
      // Set an error first
      store = configureStore({
        reducer: {
          about: aboutReducer,
        },
        preloadedState: {
          about: {
            appInfo: null,
            modalInfo: null,
            loading: false,
            error: 'Test error',
          },
        },
      });

      store.dispatch(clearError());

      const state = store.getState().about;
      expect(state.error).toBeNull();
    });
  });

  describe('fetchAboutModalInfo', () => {
    it('fetches about modal info successfully', async () => {
      const mockApplianceInfo = {
        product_info: {
          copyright: '© 2026 ManageIQ',
          support_website_text: 'ManageIQ Support',
          support_website: 'https://www.manageiq.org/support',
          name_full: 'ManageIQ',
          branding_info: {
            brand: 'ManageIQ',
            favicon: '/favicon.ico',
            logo: '/images/logo.svg',
          },
        },
        identity: {
          name: 'Test User',
          role: 'Administrator',
        },
        server_info: {
          version: '1.0',
          build: '123',
          appliance: 'test-server',
        },
        settings: {
          asynchronous_notifications: true,
        },
      };

      mockGetApplianceInfo.mockResolvedValue(mockApplianceInfo);
      mockGetDocumentationUrl.mockResolvedValue('https://docs.manageiq.org');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ gitCommit: 'abc123def456' }),
      });

      await store.dispatch(fetchAboutModalInfo());

      const state = store.getState().about;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.modalInfo).toBeDefined();
      expect(state.modalInfo?.version).toBe('1.0.123');
      expect(state.modalInfo?.suiVersion).toBe('abc123def456');
      expect(state.modalInfo?.serverName).toBe('test-server');
      expect(state.modalInfo?.userName).toBe('Test User');
      expect(state.modalInfo?.userRole).toBe('Administrator');
      expect(state.modalInfo?.copyright).toBe('© 2026 ManageIQ');
      expect(state.modalInfo?.supportWebsiteText).toBe('ManageIQ Support');
      expect(state.modalInfo?.supportWebsite).toBe('https://www.manageiq.org/support');
      expect(state.modalInfo?.documentationUrl).toBe('https://docs.manageiq.org');
    });

    it('sets loading state while fetching', async () => {
      mockGetApplianceInfo.mockImplementation(() => new Promise(() => {})); // Never resolves
      mockGetDocumentationUrl.mockResolvedValue('https://docs.manageiq.org');

      store.dispatch(fetchAboutModalInfo());

      // Check loading state immediately
      const state = store.getState().about;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles version.json fetch failure gracefully', async () => {
      const mockApplianceInfo = {
        product_info: {
          copyright: '© 2026 ManageIQ',
          support_website_text: 'ManageIQ Support',
          support_website: 'https://www.manageiq.org/support',
          name_full: 'ManageIQ',
          branding_info: {
            brand: 'ManageIQ',
            favicon: '/favicon.ico',
            logo: '/images/logo.svg',
          },
        },
        identity: {
          name: 'Test User',
          role: 'Administrator',
        },
        server_info: {
          version: '1.0',
          build: '123',
          appliance: 'test-server',
        },
        settings: {
          asynchronous_notifications: true,
        },
      };

      mockGetApplianceInfo.mockResolvedValue(mockApplianceInfo);
      mockGetDocumentationUrl.mockResolvedValue('https://docs.manageiq.org');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await store.dispatch(fetchAboutModalInfo());

      const state = store.getState().about;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.modalInfo?.suiVersion).toBe('N/A');
    });

    it('handles API errors', async () => {
      mockGetApplianceInfo.mockRejectedValue(new Error('API Error'));
      mockGetDocumentationUrl.mockResolvedValue('https://docs.manageiq.org');

      await store.dispatch(fetchAboutModalInfo());

      const state = store.getState().about;

      expect(state.loading).toBe(false);
      expect(state.error).toBeDefined();
      expect(state.modalInfo).toBeNull();
    });

    it('handles documentation URL fetch failure', async () => {
      const mockApplianceInfo = {
        product_info: {
          copyright: '© 2026 ManageIQ',
          support_website_text: 'ManageIQ Support',
          support_website: 'https://www.manageiq.org/support',
          name_full: 'ManageIQ',
          branding_info: {
            brand: 'ManageIQ',
            favicon: '/favicon.ico',
            logo: '/images/logo.svg',
          },
        },
        identity: {
          name: 'Test User',
          role: 'Administrator',
        },
        server_info: {
          version: '1.0',
          build: '123',
          appliance: 'test-server',
        },
        settings: {
          asynchronous_notifications: true,
        },
      };

      mockGetApplianceInfo.mockResolvedValue(mockApplianceInfo);
      mockGetDocumentationUrl.mockResolvedValue('/support/index?support_tab=about');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ gitCommit: 'abc123' }),
      });

      await store.dispatch(fetchAboutModalInfo());

      const state = store.getState().about;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.modalInfo?.documentationUrl).toBe('/support/index?support_tab=about');
    });
  });

  describe('fetchAppInfo', () => {
    it('fetches app info successfully', async () => {
      await store.dispatch(fetchAppInfo());

      const state = store.getState().about;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.appInfo).toBeDefined();
      expect(state.appInfo?.version).toBe('0.1.0');
      expect(state.appInfo?.licenseName).toBe('Apache License 2.0');
      expect(state.appInfo?.copyrightHolder).toBe('ManageIQ');
    });

    it('sets loading state while fetching', async () => {
      const promise = store.dispatch(fetchAppInfo());

      // Check loading state immediately
      let state = store.getState().about;
      expect(state.loading).toBe(true);

      await promise;

      // Check final state
      state = store.getState().about;
      expect(state.loading).toBe(false);
    });
  });
});