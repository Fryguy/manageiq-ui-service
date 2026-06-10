/**
 * ActionMenu Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionMenu, type MenuItem } from './ActionMenu';
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

describe('ActionMenu', () => {
  const mockItems: MenuItem[] = [
    {
      id: 'edit',
      label: 'Edit',
      permission: { feature: 'service_edit' },
      onClick: jest.fn(),
    },
    {
      id: 'view',
      label: 'View Details',
      onClick: jest.fn(),
    },
    {
      id: 'delete',
      label: 'Delete',
      permission: { roles: ['admin'] },
      isDanger: true,
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders overflow menu', () => {
      renderWithStore(
        <ActionMenu items={mockItems} ariaLabel="Test actions" />,
        { service_edit: true },
        'admin'
      );
      // Carbon OverflowMenu renders with aria-label on the icon, not the button
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders menu items when opened', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ActionMenu items={mockItems} ariaLabel="Test actions" />,
        { service_edit: true },
        'admin'
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('uses default aria label when not provided', () => {
      renderWithStore(
        <ActionMenu items={mockItems} />,
        { service_edit: true },
        'admin'
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Permission Filtering', () => {
    it('shows items when user has required feature', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ActionMenu items={mockItems} />,
        { service_edit: true },
        'user'
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('hides items when user lacks required feature', async () => {
      const user = userEvent.setup();
      renderWithStore(<ActionMenu items={mockItems} />, {}, 'user');

      await user.click(screen.getByRole('button'));

      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('shows items when user has required role', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ActionMenu items={mockItems} />,
        { service_edit: true },
        'admin'
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('hides items when user lacks required role', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ActionMenu items={mockItems} />,
        { service_edit: true },
        'user'
      );

      await user.click(screen.getByRole('button'));

      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('shows items with multiple features when user has any', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'power',
          label: 'Power Actions',
          permission: { features: ['service_start', 'service_stop'] },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />, { service_stop: true });

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Power Actions')).toBeInTheDocument();
    });

    it('hides items with multiple features when user has none', () => {
      const items: MenuItem[] = [
        {
          id: 'power',
          label: 'Power Actions',
          permission: { features: ['service_start', 'service_stop'] },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />, {});

      // Menu should be hidden when all items are filtered out
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows items without permission configuration', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'view',
          label: 'View',
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />, {});

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('View')).toBeInTheDocument();
    });
  });

  describe('Dividers', () => {
    it('renders dividers', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          onClick: jest.fn(),
        },
        {
          id: 'divider-1',
          isDivider: true,
        },
        {
          id: 'delete',
          label: 'Delete',
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));

      // Check that both items are present (dividers don't count as separate menu items)
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('removes consecutive dividers', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          permission: { feature: 'service_edit' },
          onClick: jest.fn(),
        },
        {
          id: 'divider-1',
          isDivider: true,
        },
        {
          id: 'divider-2',
          isDivider: true,
        },
        {
          id: 'delete',
          label: 'Delete',
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />, {});

      await user.click(screen.getByRole('button'));

      // Should only have Delete item (Edit filtered out, consecutive dividers removed)
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('removes leading dividers', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'divider-1',
          isDivider: true,
        },
        {
          id: 'edit',
          label: 'Edit',
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('removes trailing dividers', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          onClick: jest.fn(),
        },
        {
          id: 'divider-1',
          isDivider: true,
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when menu item is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          onClick: handleClick,
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Edit'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when item is disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          onClick: handleClick,
          disabled: true,
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Edit'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Confirmation Dialog', () => {
    it('shows confirmation dialog when item has confirmation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: MenuItem[] = [
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

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick when confirmation is confirmed', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: MenuItem[] = [
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

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Delete'));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: MenuItem[] = [
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

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Delete'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Hide When Empty', () => {
    it('hides menu when all items are filtered out and hideWhenEmpty is true', () => {
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          permission: { feature: 'service_edit' },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} hideWhenEmpty />, {});

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows menu when all items are filtered out and hideWhenEmpty is false', () => {
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          permission: { feature: 'service_edit' },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} hideWhenEmpty={false} />, {});

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('hides menu by default when all items are filtered out', () => {
      const items: MenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          permission: { feature: 'service_edit' },
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />, {});

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Danger Items', () => {
    it('renders danger items with delete styling', async () => {
      const user = userEvent.setup();
      const items: MenuItem[] = [
        {
          id: 'delete',
          label: 'Delete',
          isDanger: true,
          onClick: jest.fn(),
        },
      ];

      renderWithStore(<ActionMenu items={items} />);

      await user.click(screen.getByRole('button'));

      const deleteItem = screen.getByText('Delete');
      expect(deleteItem).toBeInTheDocument();
    });
  });
});
