/**
 * Tests for appliance API endpoints
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { getApiClient } from './client';
import { getApplianceInfo, getDocumentationUrl } from './appliance';

// Mock the API client
jest.mock('./client', () => {
  const actualClient = jest.requireActual('./client');
  return {
    ...actualClient,
    getApiClient: jest.fn(),
  };
});

const mockGet = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (getApiClient as jest.Mock).mockReturnValue({
    get: mockGet,
  });
});

describe('appliance API', () => {
  describe('getApplianceInfo', () => {
    it('fetches appliance information successfully', async () => {
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

      mockGet.mockResolvedValue(mockApplianceInfo);

      const result = await getApplianceInfo();

      expect(mockGet).toHaveBeenCalledWith('/');
      expect(result).toEqual(mockApplianceInfo);
      expect(result.product_info.copyright).toBe('© 2026 ManageIQ');
      expect(result.identity.name).toBe('Test User');
      expect(result.server_info.version).toBe('1.0');
    });

    it('includes all required fields', async () => {
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

      mockGet.mockResolvedValue(mockApplianceInfo);

      const result = await getApplianceInfo();

      expect(result.product_info).toBeDefined();
      expect(result.product_info.copyright).toBeDefined();
      expect(result.product_info.support_website_text).toBeDefined();
      expect(result.product_info.support_website).toBeDefined();
      expect(result.product_info.branding_info).toBeDefined();
      expect(result.identity).toBeDefined();
      expect(result.identity.name).toBeDefined();
      expect(result.identity.role).toBeDefined();
      expect(result.server_info).toBeDefined();
      expect(result.server_info.version).toBeDefined();
      expect(result.server_info.build).toBeDefined();
      expect(result.server_info.appliance).toBeDefined();
    });

    it('handles API errors', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      await expect(getApplianceInfo()).rejects.toThrow('API Error');
    });
  });

  describe('getDocumentationUrl', () => {
    it('fetches documentation URL successfully', async () => {
      mockGet.mockResolvedValue({
        help_menu: {
          documentation: {
            href: 'https://docs.manageiq.org',
          },
        },
      });

      const result = await getDocumentationUrl();

      expect(mockGet).toHaveBeenCalledWith('/settings/help_menu/documentation');
      expect(result).toBe('https://docs.manageiq.org');
    });

    it('returns default URL when API returns no href', async () => {
      mockGet.mockResolvedValue({
        help_menu: {},
      });

      const result = await getDocumentationUrl();

      expect(result).toBe('/support/index?support_tab=about');
    });

    it('returns default URL when API returns empty response', async () => {
      mockGet.mockResolvedValue({});

      const result = await getDocumentationUrl();

      expect(result).toBe('/support/index?support_tab=about');
    });

    it('fixes double http:// in URL', async () => {
      mockGet.mockResolvedValue({
        help_menu: {
          documentation: {
            href: 'http://localhost:3000/api/http://www.example.com',
          },
        },
      });

      const result = await getDocumentationUrl();

      expect(result).toBe('http://www.example.com');
    });

    it('handles API errors gracefully', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      const result = await getDocumentationUrl();

      expect(result).toBe('/support/index?support_tab=about');
    });
  });
});