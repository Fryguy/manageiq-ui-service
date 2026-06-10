/**
 * ActionButtonGroup Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionButtonGroup, type Action } from './ActionButtonGroup';
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

describe('ActionButtonGroup', () => {
  const mockActions: Action[] = [
    {
      id: 'start',
      label: 'Start',
      permission: { feature: 'service_start' },
      onClick: jest.fn(),
      isPrimary: true,
    },
    {
      id: 'stop',
      label: 'Stop',
      permission: { feature: 'service_stop' },
      onClick: jest.fn(),
    },
    {
      id: 'suspend',
      label: 'Suspend',
      permission: { feature: 'service_suspend' },
      onClick: jest.fn(),
    },
    {
      id: 'retire',
      label: 'Retire',
      permission: { feature: 'service_retire' },
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders action buttons', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} />,
        {
          service_start: true,
          service_stop: true,
          service_suspend: true,
          service_retire: true,
        }
      );

      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Suspend' })).toBeInTheDocument();
    });

    it('renders with default aria label', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} />,
        { service_start: true }
      );
      expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument();
    });

    it('renders with custom aria label', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} ariaLabel="Power actions" />,
        { service_start: true }
      );
      expect(screen.getByRole('group', { name: 'Power actions' })).toBeInTheDocument();
    });
  });

  describe('Permission Filtering', () => {
    it('shows buttons when user has required features', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} />,
        { service_start: true, service_stop: true }
      );

      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    });

    it('hides buttons when user lacks required features', () => {
      renderWithStore(<ActionButtonGroup actions={mockActions} />, {});

      expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument();
    });

    it('shows buttons with role permissions', () => {
      const actions: Action[] = [
        {
          id: 'admin-action',
          label: 'Admin Action',
          permission: { roles: ['admin'] },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />, {}, 'admin');

      expect(screen.getByRole('button', { name: 'Admin Action' })).toBeInTheDocument();
    });

    it('hides buttons when user lacks required role', () => {
      const actions: Action[] = [
        {
          id: 'admin-action',
          label: 'Admin Action',
          permission: { roles: ['admin'] },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />, {}, 'user');

      expect(screen.queryByRole('button', { name: 'Admin Action' })).not.toBeInTheDocument();
    });

    it('shows buttons without permission configuration', () => {
      const actions: Action[] = [
        {
          id: 'view',
          label: 'View',
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />, {});

      expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
    });
  });

  describe('Primary Action', () => {
    it('renders primary action first', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} />,
        {
          service_start: true,
          service_stop: true,
          service_suspend: true,
        }
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Start');
    });

    it('applies primary button styling to primary action', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} />,
        { service_start: true }
      );

      const startButton = screen.getByRole('button', { name: 'Start' });
      expect(startButton).toHaveClass('cds--btn--primary');
    });
  });

  describe('Max Buttons and Overflow', () => {
    it('shows maxButtons number of buttons', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} maxButtons={2} />,
        {
          service_start: true,
          service_stop: true,
          service_suspend: true,
          service_retire: true,
        }
      );

      // Should have 2 action buttons + 1 overflow menu button = 3 total
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(3);
      
      // Check that Start and Stop buttons are visible
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    });

    it('shows overflow menu when actions exceed maxButtons', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} maxButtons={2} />,
        {
          service_start: true,
          service_stop: true,
          service_suspend: true,
          service_retire: true,
        }
      );

      // Overflow menu button should be present
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('does not show overflow menu when actions do not exceed maxButtons', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} maxButtons={5} />,
        {
          service_start: true,
          service_stop: true,
        }
      );

      expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
    });

    it('includes overflow actions in menu', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ActionButtonGroup actions={mockActions} maxButtons={2} />,
        {
          service_start: true,
          service_stop: true,
          service_suspend: true,
          service_retire: true,
        }
      );

      // Find the overflow menu button (third button)
      const buttons = screen.getAllByRole('button');
      const overflowButton = buttons[buttons.length - 1];
      await user.click(overflowButton);

      expect(screen.getByText('Suspend')).toBeInTheDocument();
      expect(screen.getByText('Retire')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const actions: Action[] = [
        {
          id: 'test',
          label: 'Test Action',
          onClick: handleClick,
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />);

      await user.click(screen.getByRole('button', { name: 'Test Action' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hide When Empty', () => {
    it('hides group when all actions are filtered out and hideWhenEmpty is true', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} hideWhenEmpty />,
        {}
      );

      expect(screen.queryByRole('group')).not.toBeInTheDocument();
    });

    it('shows group when all actions are filtered out and hideWhenEmpty is false', () => {
      renderWithStore(
        <ActionButtonGroup actions={mockActions} hideWhenEmpty={false} />,
        {}
      );

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('hides group by default when all actions are filtered out', () => {
      renderWithStore(<ActionButtonGroup actions={mockActions} />, {});

      expect(screen.queryByRole('group')).not.toBeInTheDocument();
    });
  });

  describe('Disabled Actions', () => {
    it('renders disabled buttons', () => {
      const actions: Action[] = [
        {
          id: 'disabled',
          label: 'Disabled Action',
          onClick: jest.fn(),
          disabled: true,
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />);

      expect(screen.getByRole('button', { name: 'Disabled Action' })).toBeDisabled();
    });
  });

  describe('Confirmation Dialogs', () => {
    it('shows confirmation dialog for actions with confirmation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const actions: Action[] = [
        {
          id: 'delete',
          label: 'Delete',
          confirmation: {
            title: 'Delete Service',
            message: 'Are you sure?',
          },
          onClick: handleClick,
        },
      ];

      renderWithStore(<ActionButtonGroup actions={actions} />);

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = renderWithStore(
        <ActionButtonGroup
          actions={mockActions}
          className="custom-group"
        />,
        { service_start: true }
      );

      const group = container.querySelector('.custom-group');
      expect(group).toBeInTheDocument();
    });

    it('applies vertical layout class', () => {
      const { container } = renderWithStore(
        <ActionButtonGroup actions={mockActions} vertical />,
        { service_start: true }
      );

      const group = container.querySelector('.action-button-group--vertical');
      expect(group).toBeInTheDocument();
    });
  });
});
