/**
 * AboutModal tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AboutModal } from './AboutModal';

describe('AboutModal', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
  };

  const mockAppInfo = {
    version: '1.0.0',
    suiVersion: '2.0.0',
    serverName: 'test-server',
    userName: 'test-user',
    userRole: 'admin',
    copyright: '© 2026 ManageIQ',
    supportWebsiteText: 'Support',
    supportWebsite: 'https://example.com/support',
    documentationUrl: '/docs',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when open', () => {
    render(<AboutModal {...defaultProps} />);
    expect(screen.getByText('About ManageIQ Service UI')).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    expect(screen.getByText('Version:')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('SUI Version:')).toBeInTheDocument();
    expect(screen.getByText('2.0.0')).toBeInTheDocument();
  });

  it('displays server information', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    expect(screen.getByText('Server Name:')).toBeInTheDocument();
    expect(screen.getByText('test-server')).toBeInTheDocument();
  });

  it('displays user information', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    expect(screen.getByText('User Name:')).toBeInTheDocument();
    expect(screen.getByText('test-user')).toBeInTheDocument();
    expect(screen.getByText('User Role:')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('displays copyright information', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    expect(screen.getByText('© 2026 ManageIQ')).toBeInTheDocument();
  });

  it('displays documentation link', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    const docLink = screen.getByText('Documentation');
    expect(docLink).toBeInTheDocument();
    expect(docLink).toHaveAttribute('href', '/docs');
    expect(docLink).toHaveAttribute('target', '_blank');
    expect(docLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays support website link when provided', () => {
    render(<AboutModal {...defaultProps} appInfo={mockAppInfo} />);
    const supportLink = screen.getByText('Support');
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute('href', 'https://example.com/support');
    expect(supportLink).toHaveAttribute('target', '_blank');
    expect(supportLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not display support link when not provided', () => {
    const appInfoWithoutSupport = { ...mockAppInfo, supportWebsite: '' };
    render(<AboutModal {...defaultProps} appInfo={appInfoWithoutSupport} />);
    expect(screen.queryByText('Support')).not.toBeInTheDocument();
  });

  it('displays default values when appInfo is not provided', () => {
    render(<AboutModal {...defaultProps} />);
    expect(screen.getAllByText('N/A')).toHaveLength(5); // version, suiVersion, serverName, userName, userRole
  });

  it('calls onClose when modal close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AboutModal {...defaultProps} />);
    
    // Carbon Modal has a close button in the header
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});