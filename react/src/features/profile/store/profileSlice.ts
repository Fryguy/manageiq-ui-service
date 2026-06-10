/**
 * Profile Redux slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileApi } from '../../../api/profile';
import type { ProfileState, UserProfile, UpdateProfilePayload } from '../types';

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

/**
 * Fetch current user profile
 */
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getProfile();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

/**
 * Update user profile
 */
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      return await profileApi.updateProfile(payload);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
    }
  }
);

/**
 * Update user settings
 */
export const updateSettings = createAsyncThunk(
  'profile/updateSettings',
  async (settings: UpdateProfilePayload['settings'], { rejectWithValue }) => {
    try {
      return await profileApi.updateProfile({ settings });
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error || 'Failed to update settings');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
        state.updateError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
        state.updateError = null;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearProfile, clearUpdateError, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
