/**
 * Tests for profile Redux slice
 */

import { configureStore } from '@reduxjs/toolkit';
import profileReducer, {
  fetchProfile,
  updateProfile,
  updateSettings,
  clearProfile,
  clearUpdateError,
  setProfile,
} from './profileSlice';
import { profileApi } from '../../../api/profile';
import type { UserProfile } from '../types';

jest.mock('../../../api/profile');

const mockProfile: UserProfile = {
  id: '1',
  name: 'Test User',
  userid: 'testuser',
  email: 'test@example.com',
  group: {
    id: 'g1',
    description: 'Test Group',
  },
  role: {
    id: 'r1',
    name: 'Test Role',
  },
  settings: {
    locale: 'en',
  },
};

describe('profileSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profile: profileReducer,
      },
    });
  });

  describe('reducers', () => {
    it('should handle clearProfile', () => {
      store.dispatch(setProfile(mockProfile));
      store.dispatch(clearProfile());
      const state = store.getState().profile;
      expect(state.profile).toBeNull();
      expect(state.error).toBeNull();
      expect(state.updateError).toBeNull();
    });

    it('should handle clearUpdateError', () => {
      store.dispatch(clearUpdateError());
      const state = store.getState().profile;
      expect(state.updateError).toBeNull();
    });

    it('should handle setProfile', () => {
      store.dispatch(setProfile(mockProfile));
      const state = store.getState().profile;
      expect(state.profile).toEqual(mockProfile);
    });
  });

  describe('fetchProfile', () => {
    it('should handle fetchProfile.pending', () => {
      store.dispatch(fetchProfile.pending('', undefined));
      const state = store.getState().profile;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProfile.fulfilled', () => {
      store.dispatch(fetchProfile.fulfilled(mockProfile, '', undefined));
      const state = store.getState().profile;
      expect(state.loading).toBe(false);
      expect(state.profile).toEqual(mockProfile);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProfile.rejected', () => {
      const error = 'Failed to fetch profile';
      store.dispatch(fetchProfile.rejected(null, '', undefined, error));
      const state = store.getState().profile;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });

    it('should fetch profile successfully', async () => {
      (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
      await store.dispatch(fetchProfile());
      const state = store.getState().profile;
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch profile error', async () => {
      const errorMessage = 'Network error';
      (profileApi.getProfile as jest.Mock).mockRejectedValue({
        response: { data: { error: errorMessage } },
      });
      await store.dispatch(fetchProfile());
      const state = store.getState().profile;
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  describe('updateProfile', () => {
    const updatePayload = { name: 'Updated Name', email: 'updated@example.com' };

    it('should handle updateProfile.pending', () => {
      store.dispatch(updateProfile.pending('', updatePayload));
      const state = store.getState().profile;
      expect(state.updating).toBe(true);
      expect(state.updateError).toBeNull();
    });

    it('should handle updateProfile.fulfilled', () => {
      const updatedProfile = { ...mockProfile, ...updatePayload };
      store.dispatch(updateProfile.fulfilled(updatedProfile, '', updatePayload));
      const state = store.getState().profile;
      expect(state.updating).toBe(false);
      expect(state.profile).toEqual(updatedProfile);
      expect(state.updateError).toBeNull();
    });

    it('should handle updateProfile.rejected', () => {
      const error = 'Failed to update profile';
      store.dispatch(updateProfile.rejected(null, '', updatePayload, error));
      const state = store.getState().profile;
      expect(state.updating).toBe(false);
      expect(state.updateError).toBe(error);
    });

    it('should update profile successfully', async () => {
      const updatedProfile = { ...mockProfile, ...updatePayload };
      (profileApi.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);
      await store.dispatch(updateProfile(updatePayload));
      const state = store.getState().profile;
      expect(state.profile).toEqual(updatedProfile);
      expect(state.updating).toBe(false);
      expect(state.updateError).toBeNull();
    });

    it('should handle update profile error', async () => {
      const errorMessage = 'Update failed';
      (profileApi.updateProfile as jest.Mock).mockRejectedValue({
        response: { data: { error: errorMessage } },
      });
      await store.dispatch(updateProfile(updatePayload));
      const state = store.getState().profile;
      expect(state.updateError).toBe(errorMessage);
      expect(state.updating).toBe(false);
    });
  });

  describe('updateSettings', () => {
    const settingsPayload = { locale: 'de' };

    it('should handle updateSettings.pending', () => {
      store.dispatch(updateSettings.pending('', settingsPayload));
      const state = store.getState().profile;
      expect(state.updating).toBe(true);
      expect(state.updateError).toBeNull();
    });

    it('should handle updateSettings.fulfilled', () => {
      const updatedProfile = {
        ...mockProfile,
        settings: { ...mockProfile.settings, ...settingsPayload },
      };
      store.dispatch(updateSettings.fulfilled(updatedProfile, '', settingsPayload));
      const state = store.getState().profile;
      expect(state.updating).toBe(false);
      expect(state.profile).toEqual(updatedProfile);
      expect(state.updateError).toBeNull();
    });

    it('should handle updateSettings.rejected', () => {
      const error = 'Failed to update settings';
      store.dispatch(updateSettings.rejected(null, '', settingsPayload, error));
      const state = store.getState().profile;
      expect(state.updating).toBe(false);
      expect(state.updateError).toBe(error);
    });

    it('should update settings successfully', async () => {
      const updatedProfile = {
        ...mockProfile,
        settings: { ...mockProfile.settings, ...settingsPayload },
      };
      (profileApi.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);
      await store.dispatch(updateSettings(settingsPayload));
      const state = store.getState().profile;
      expect(state.profile).toEqual(updatedProfile);
      expect(state.updating).toBe(false);
      expect(state.updateError).toBeNull();
    });

    it('should handle update settings error', async () => {
      const errorMessage = 'Settings update failed';
      (profileApi.updateProfile as jest.Mock).mockRejectedValue({
        response: { data: { error: errorMessage } },
      });
      await store.dispatch(updateSettings(settingsPayload));
      const state = store.getState().profile;
      expect(state.updateError).toBe(errorMessage);
      expect(state.updating).toBe(false);
    });
  });
});
