/**
 * Profile API endpoints
 */

import { getApiClient } from './client';
import type { UserProfile, UpdateProfilePayload } from '../features/profile/types';

export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ identity: UserProfile }>('/api?attributes=identity');
    return response.identity;
  },

  /**
   * Update user profile
   */
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const apiClient = getApiClient();
    const response = await apiClient.post<{ identity: UserProfile }>('/api', {
      action: 'edit',
      resource: payload,
    });
    return response.identity;
  },
};
