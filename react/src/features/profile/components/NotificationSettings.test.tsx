/**
 * Tests for NotificationSettings component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationSettings } from './NotificationSettings';

describe('NotificationSettings', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render notification settings form', () => {
    render(<NotificationSettings onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('notification-settings-form')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /browser notifications/i })).toBeInTheDocument();
  });

  it('should display current settings', () => {
    const currentSettings = { email: false, browser: true };
    render(
      <NotificationSettings
        currentSettings={currentSettings}
        onSubmit={mockOnSubmit}
      />
    );

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    const browserToggle = screen.getByRole('switch', { name: /browser notifications/i });

    expect(emailToggle).toHaveAttribute('aria-checked', 'false');
    expect(browserToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('should disable submit button when settings are not changed', () => {
    render(<NotificationSettings onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByText('Save Notification Preferences');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when email setting is changed', async () => {
    const user = userEvent.setup();
    render(<NotificationSettings onSubmit={mockOnSubmit} />);

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    await user.click(emailToggle);

    const submitButton = screen.getByText('Save Notification Preferences');
    expect(submitButton).not.toBeDisabled();
  });

  it('should enable submit button when browser setting is changed', async () => {
    const user = userEvent.setup();
    render(<NotificationSettings onSubmit={mockOnSubmit} />);

    const browserToggle = screen.getByRole('switch', { name: /browser notifications/i });
    await user.click(browserToggle);

    const submitButton = screen.getByText('Save Notification Preferences');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit with updated settings', async () => {
    const user = userEvent.setup();
    const currentSettings = { email: true, browser: true };
    render(
      <NotificationSettings
        currentSettings={currentSettings}
        onSubmit={mockOnSubmit}
      />
    );

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    await user.click(emailToggle);

    const submitButton = screen.getByText('Save Notification Preferences');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        notifications: {
          email: false,
          browser: true,
        },
      });
    });
  });

  it('should display error message', () => {
    const errorMessage = 'Failed to update notifications';
    render(<NotificationSettings onSubmit={mockOnSubmit} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should disable form when loading', () => {
    render(<NotificationSettings onSubmit={mockOnSubmit} loading={true} />);
    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    const browserToggle = screen.getByRole('switch', { name: /browser notifications/i });
    const submitButton = screen.getByText('Save Notification Preferences');

    expect(emailToggle).toBeDisabled();
    expect(browserToggle).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should display info notification', () => {
    render(<NotificationSettings onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Browser notifications require permission from your browser.')).toBeInTheDocument();
  });
});
