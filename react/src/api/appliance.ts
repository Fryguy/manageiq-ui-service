/**
 * Appliance API endpoints
 *
 * Provides access to appliance information including version, branding,
 * and product information used in the About modal.
 */

import { getApiClient } from './client';

export interface ApplianceInfoResponse {
  product_info: {
    copyright: string;
    support_website_text: string;
    support_website: string;
    name_full: string;
    branding_info: {
      brand: string;
      favicon: string;
      logo: string;
    };
  };
  identity: {
    name: string;
    role: string;
  };
  server_info: {
    version: string;
    build: string;
    appliance: string;
  };
  settings: {
    asynchronous_notifications?: boolean;
  };
}

export interface DocumentationSettingsResponse {
  help_menu?: {
    documentation?: {
      href: string;
    };
  };
}

/**
 * Fetch appliance information
 * This corresponds to the Angular ApplianceInfo.get() functionality
 */
export async function getApplianceInfo(): Promise<ApplianceInfoResponse> {
  const client = getApiClient();
  return client.get<ApplianceInfoResponse>('/');
}

/**
 * Fetch documentation URL from settings
 * This corresponds to the Angular navigation controller's documentation URL fetch
 */
export async function getDocumentationUrl(): Promise<string> {
  const client = getApiClient();
  try {
    const data = await client.get<DocumentationSettingsResponse>(
      '/settings/help_menu/documentation'
    );
    
    const href = data.help_menu?.documentation?.href;
    if (!href) {
      return '/support/index?support_tab=about';
    }

    // Fix "http://localhost:3000/api/http://www.google.com" issue
    const matches = href.match(/http.*(http.*)/);
    return matches?.[1] || href;
  } catch {
    // Fallback to default documentation URL if API call fails
    return '/support/index?support_tab=about';
  }
}
