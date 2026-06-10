/**
 * ActionButton Component Tests
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionButton } from './ActionButton';
import authReducer from '../../features/auth/store/authSlice';

/**
 * Create mock store with auth state
 */
const createMockStore = (
  features: Record<string, unknown> = {},
  role: string | null = null
) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'mock-token',
          identity: role ? { role } : null,
          features,
          loading: false,
          error: null,
        },
      },
    },
  });
};

/**
 * Render component with Redux provider
 */
const renderWithStore = (
  ui: React.ReactElement,
  features: Record<string, unknown> = {},
  role: string | null = null
) => {
  const store = createMockStore(features, role);
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('ActionButton', () => {
  describe('Basic Rendering', () => {
    it('renders button with children', () => {
      renderWithStore(<ActionButton>Click Me</ActionButton>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('passes through Carbon Button props', () => {
      renderWithStore(
        <ActionButton kind="danger" size="sm">
          Delete
        </ActionButton>
      );
      const button = screen.getByRole('button', { name: 'Delete' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('cds--btn--danger');
      expect(button).toHaveClass('cds--btn--sm');
    });

    it('handles disabled prop', () => {
      renderWithStore(<ActionButton disabled>Disabled</ActionButton>);
      expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    });
  });

  describe('Permission Checking', () => {
    it('enables button when user has required feature', () => {
      renderWithStore(
        <ActionButton permission={{ feature: 'service_edit' }}>
          Edit
        </ActionButton>,
        { service_edit: true }
      );
      expect(screen.getByRole('button', { name: 'Edit' })).not.toBeDisabled();
    });

    it('disables button when user lacks required feature', () => {
      renderWithStore(
        <ActionButton permission={{ feature: 'service_edit' }}>
          Edit
        </ActionButton>,
        {}
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    });

    it('enables button when user has any of multiple features', () => {
      renderWithStore(
        <ActionButton
          permission={{ features: ['service_start', 'service_stop'] }}
        >
          Power Actions
        </ActionButton>,
        { service_stop: true }
      );
      expect(screen.getByRole('button', { name: 'Power Actions' })).not.toBeDisabled();
    });

    it('disables button when user lacks all multiple features', () => {
      renderWithStore(
        <ActionButton
          permission={{ features: ['service_start', 'service_stop'] }}
        >
          Power Actions
        </ActionButton>,
        {}
      );
      expect(screen.getByRole('button', { name: 'Power Actions' })).toBeDisabled();
    });

    it('enables button when user has required role', () => {
      renderWithStore(
        <ActionButton permission={{ roles: ['admin'] }}>
          Admin Action
        </ActionButton>,
        {},
        'admin'
      );
      expect(screen.getByRole('button', { name: 'Admin Action' })).not.toBeDisabled();
    });

    it('disables button when user lacks required role', () => {
      renderWithStore(
        <ActionButton permission={{ roles: ['admin'] }}>
          Admin Action
        </ActionButton>,
        {},
        'user'
      );
      expect(screen.getByRole('button', { name: 'Admin Action' })).toBeDisabled();
    });

    it('enables button when user has _ALL_ role', () => {
      renderWithStore(
        <ActionButton permission={{ roles: ['_ALL_'] }}>
          Any Role Action
        </ActionButton>,
        {},
        'user'
      );
      expect(screen.getByRole('button', { name: 'Any Role Action' })).not.toBeDisabled();
    });

    it('checks multiple permission types', () => {
      renderWithStore(
        <ActionButton
          permission={{
            feature: 'service_edit',
            roles: ['admin'],
          }}
        >
          Edit
        </ActionButton>,
        { service_edit: true },
        'admin'
      );
      expect(screen.getByRole('button', { name: 'Edit' })).not.toBeDisabled();
    });

    it('disables when any permission check fails', () => {
      renderWithStore(
        <ActionButton
          permission={{
            feature: 'service_edit',
            roles: ['admin'],
          }}
        >
          Edit
        </ActionButton>,
        { service_edit: true },
        'user'
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    });
  });

  describe('Hide on No Permission', () => {
    it('hides button when hideOnNoPermission is true and permission check fails', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          hideOnNoPermission
        >
          Edit
        </ActionButton>,
        {}
      );
      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    });

    it('shows button when hideOnNoPermission is true and permission check passes', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          hideOnNoPermission
        >
          Edit
        </ActionButton>,
        { service_edit: true }
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('shows disabled button when hideOnNoPermission is false', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          hideOnNoPermission={false}
        >
          Edit
        </ActionButton>,
        {}
      );
      expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

      await user.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(
        <ActionButton onClick={handleClick} disabled>
          Click Me
        </ActionButton>
      );

      await user.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when permission check fails', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(
        <ActionButton
          onClick={handleClick}
          permission={{ feature: 'service_edit' }}
        >
          Edit
        </ActionButton>,
        {}
      );

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading state during async onClick', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithStore(
        <ActionButton onClick={handleClick} showLoadingOnClick>
          Submit
        </ActionButton>
      );

      const button = screen.getByRole('button', { name: 'Submit' });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button during loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithStore(
        <ActionButton onClick={handleClick} showLoadingOnClick>
          Submit
        </ActionButton>
      );

      const button = screen.getByRole('button', { name: 'Submit' });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
      });
    });
  });

  describe('Confirmation Dialog', () => {
    it('shows confirmation dialog when confirmation is configured', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(
        <ActionButton
          onClick={handleClick}
          confirmation={{
            title: 'Delete Service',
            message: 'Are you sure?',
          }}
        >
          Delete
        </ActionButton>
      );

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick when confirmation is confirmed', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(
        <ActionButton
          onClick={handleClick}
          confirmation={{
            title: 'Delete Service',
            message: 'Are you sure?',
          }}
        >
          Delete
        </ActionButton>
      );

      await user.click(screen.getByRole('button', { name: 'Delete' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithStore(
        <ActionButton
          onClick={handleClick}
          confirmation={{
            title: 'Delete Service',
            message: 'Are you sure?',
          }}
        >
          Delete
        </ActionButton>
      );

      await user.click(screen.getByRole('button', { name: 'Delete' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('uses custom confirmation button text', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ActionButton
          confirmation={{
            title: 'Delete Service',
            message: 'Are you sure?',
            confirmText: 'Yes, Delete',
            cancelText: 'No, Keep',
          }}
        >
          Delete
        </ActionButton>
      );

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      // ConfirmDialog now supports both confirmText and confirmButtonText
      expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
      expect(screen.getByText('No, Keep')).toBeInTheDocument();
    });
  });

  describe('Tooltip', () => {
    it('shows custom tooltip when no permission', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          noPermissionTooltip="You do not have permission to edit services"
        >
          Edit
        </ActionButton>,
        {}
      );

      const button = screen.getByRole('button', { name: 'Edit' });
      expect(button).toHaveAttribute(
        'title',
        'You do not have permission to edit services'
      );
    });

    it('preserves original title when permission check passes', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          title="Edit this service"
          noPermissionTooltip="No permission"
        >
          Edit
        </ActionButton>,
        { service_edit: true }
      );

      const button = screen.getByRole('button', { name: 'Edit' });
      expect(button).toHaveAttribute('title', 'Edit this service');
    });
  });

  describe('No Permission Configuration', () => {
    it('enables button when no permission configuration is provided', () => {
      renderWithStore(<ActionButton>No Permission Check</ActionButton>);
      expect(
        screen.getByRole('button', { name: 'No Permission Check' })
      ).not.toBeDisabled();
    });

    it('respects disableOnNoPermission=false', () => {
      renderWithStore(
        <ActionButton
          permission={{ feature: 'service_edit' }}
          disableOnNoPermission={false}
        >
          Edit
        </ActionButton>,
        {}
      );
      expect(screen.getByRole('button', { name: 'Edit' })).not.toBeDisabled();
    });
  });
});
