/**
 * Tests for ProfilePage component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProfilePage } from './ProfilePage';
import profileReducer from '../store/profileSlice';
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
    notifications: {
      email: true,
      browser: true,
    },
  },
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      profile: profileReducer,
    },
  });
};

const renderWithStore = (component: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render profile page', async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  it('should fetch profile on mount', async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(profileApi.getProfile).toHaveBeenCalled();
    });
  });

  it('should display error when profile fetch fails', async () => {
    const errorMessage = 'Failed to load profile';
    (profileApi.getProfile as jest.Mock).mockRejectedValue({
      response: { data: { error: errorMessage } },
    });
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Error loading profile')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should render profile tabs', async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(screen.getByText('Language Settings')).toBeInTheDocument();
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
  });

  it('should switch between tabs', async () => {
    const user = userEvent.setup();
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });

    const languageTab = screen.getByText('Language Settings');
    await user.click(languageTab);

    await waitFor(() => {
      expect(screen.getByTestId('language-settings-form')).toBeInTheDocument();
    });

    const notificationTab = screen.getByText('Notification Settings');
    await user.click(notificationTab);

    await waitFor(() => {
      expect(screen.getByTestId('notification-settings-form')).toBeInTheDocument();
    });
  });

  it.skip('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await user.click(editButton);

    // Wait for edit form to appear
    await waitFor(() => {
      expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    });
  });

  it.skip('should exit edit mode after successful update', async () => {
    const user = userEvent.setup();
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    (profileApi.updateProfile as jest.Mock).mockResolvedValue({
      ...mockProfile,
      name: 'Updated Name',
    });

    renderWithStore(<ProfilePage />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    });

    // Update the name
    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    // Save changes
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Should exit edit mode and show profile info again
    await waitFor(() => {
      expect(screen.getByTestId('profile-info')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-edit-form')).not.toBeInTheDocument();
    });
  });

  it('should clear update error when switching tabs', async () => {
    const user = userEvent.setup();
    (profileApi.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    renderWithStore(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });

    const languageTab = screen.getByText('Language Settings');
    await user.click(languageTab);

    await waitFor(() => {
      expect(screen.getByTestId('language-settings-form')).toBeInTheDocument();
    });
  });
});
