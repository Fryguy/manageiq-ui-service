/**
 * Tests for AboutModal component
 */

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AboutModal } from './AboutModal';

// Mock i18n
jest.mock('../../../i18n', () => ({
  __: (str: string) => str,
}));

describe('AboutModal', () => {
  const mockOnClose = jest.fn();

  const defaultAppInfo = {
    version: '1.0.123',
    suiVersion: 'abc123def456',
    serverName: 'test-server',
    userName: 'Test User',
    userRole: 'Administrator',
    copyright: '© 2026 ManageIQ',
    supportWebsiteText: 'ManageIQ Support',
    supportWebsite: 'https://www.manageiq.org/support',
    documentationUrl: 'https://docs.manageiq.org',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('rendering', () => {
    it('renders when open', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      expect(screen.getByText('About ManageIQ Service UI')).toBeInTheDocument();
    });

    it('displays all version information', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      expect(screen.getByText('Version:')).toBeInTheDocument();
      expect(screen.getByText('1.0.123')).toBeInTheDocument();
      expect(screen.getByText('SUI Version:')).toBeInTheDocument();
      expect(screen.getByText('abc123def456')).toBeInTheDocument();
      expect(screen.getByText('Server Name:')).toBeInTheDocument();
      expect(screen.getByText('test-server')).toBeInTheDocument();
      expect(screen.getByText('User Name:')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('User Role:')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('displays copyright information', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      expect(screen.getByText('© 2026 ManageIQ')).toBeInTheDocument();
    });

    it('displays documentation link', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      const docLink = screen.getByText('Documentation');
      expect(docLink).toBeInTheDocument();
      expect(docLink.closest('a')).toHaveAttribute('href', 'https://docs.manageiq.org');
      expect(docLink.closest('a')).toHaveAttribute('target', '_blank');
      expect(docLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays support website link', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      const supportLink = screen.getByText('ManageIQ Support');
      expect(supportLink).toBeInTheDocument();
      expect(supportLink.closest('a')).toHaveAttribute('href', 'https://www.manageiq.org/support');
      expect(supportLink.closest('a')).toHaveAttribute('target', '_blank');
      expect(supportLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not display support website link when not provided', () => {
      const appInfoWithoutWebsite = {
        ...defaultAppInfo,
        supportWebsite: '',
      };

      render(<AboutModal open={true} onClose={mockOnClose} appInfo={appInfoWithoutWebsite} />);

      expect(screen.queryByText('ManageIQ Support')).not.toBeInTheDocument();
    });

    it('does not display documentation link when not provided', () => {
      const appInfoWithoutDocs = {
        ...defaultAppInfo,
        documentationUrl: '',
      };

      render(<AboutModal open={true} onClose={mockOnClose} appInfo={appInfoWithoutDocs} />);

      expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
    });

    it('displays default values when appInfo is not provided', () => {
      render(<AboutModal open={true} onClose={mockOnClose} />);

      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0);
    });

    it('displays default values for missing fields', () => {
      const partialAppInfo = {
        version: '1.0.0',
      };

      render(<AboutModal open={true} onClose={mockOnClose} appInfo={partialAppInfo} />);

      // Should show provided version
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
      // Should show N/A for missing fields
      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0);
    });
  });

  describe('interactions', () => {
    it('calls onClose when modal is closed', async () => {
      const user = userEvent.setup();
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      // Find and click the close button (Carbon modal has a close button)
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has proper alt text for logo', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      const logo = screen.getByAltText('Product logo');
      expect(logo).toBeInTheDocument();
    });

    it('has proper link attributes for external links', () => {
      render(<AboutModal open={true} onClose={mockOnClose} appInfo={defaultAppInfo} />);

      // Get only the actual content links (not focus sentinels)
      const docLink = screen.getByText('Documentation').closest('a');
      const supportLink = screen.getByText('ManageIQ Support').closest('a');

      expect(docLink).toHaveAttribute('target', '_blank');
      expect(docLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(supportLink).toHaveAttribute('target', '_blank');
      expect(supportLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
