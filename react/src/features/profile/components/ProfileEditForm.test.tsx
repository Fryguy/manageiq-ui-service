/**
 * Tests for ProfileEditForm component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileEditForm } from './ProfileEditForm';
import type { UserProfile } from '../types';

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
};

describe('ProfileEditForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with profile data', () => {
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
  });

  it('should disable submit button when form is not dirty', () => {
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Save');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is dirty', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    const submitButton = screen.getByText('Save');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit with updated data', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    const submitButton = screen.getByText('Save');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Updated Name',
        email: 'test@example.com',
      });
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should display error message', () => {
    const errorMessage = 'Update failed';
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should disable form when loading', () => {
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Save');
    const cancelButton = screen.getByText('Cancel');

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should render readonly fields', () => {
    render(
      <ProfileEditForm
        profile={mockProfile}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const useridInput = screen.getByLabelText('User ID') as HTMLInputElement;
    const groupInput = screen.getByLabelText('Group') as HTMLInputElement;
    const roleInput = screen.getByLabelText('Role') as HTMLInputElement;

    expect(useridInput).toHaveAttribute('readonly');
    expect(groupInput).toHaveAttribute('readonly');
    expect(roleInput).toHaveAttribute('readonly');
  });
});
