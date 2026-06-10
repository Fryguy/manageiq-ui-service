/**
 * Tests for HelpResources component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelpResources } from './HelpResources';
import { Book } from '@carbon/icons-react';

describe('HelpResources', () => {
  it('renders help resources with default resources', () => {
    render(<HelpResources />);

    expect(screen.getByTestId('help-resources')).toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('User Guide')).toBeInTheDocument();
    expect(screen.getByText('Community Support')).toBeInTheDocument();
    expect(screen.getByText('Report an Issue')).toBeInTheDocument();
  });

  it('renders custom resources', () => {
    const customResources = [
      {
        title: 'Custom Resource',
        description: 'Custom description',
        url: 'https://example.com',
        icon: Book,
      },
    ];

    render(<HelpResources resources={customResources} />);

    expect(screen.getByText('Custom Resource')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<HelpResources loading />);

    expect(screen.getByTestId('help-resources-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('help-resources')).not.toBeInTheDocument();
  });

  it('renders resource links with correct attributes', () => {
    render(<HelpResources />);

    const documentationLink = screen.getByRole('link', { name: 'Documentation' });
    expect(documentationLink).toHaveAttribute('href', 'https://www.manageiq.org/docs/');
    expect(documentationLink).toHaveAttribute('target', '_blank');
    expect(documentationLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders all default resource descriptions', () => {
    render(<HelpResources />);

    expect(screen.getByText('Browse the complete ManageIQ documentation')).toBeInTheDocument();
    expect(screen.getByText('Learn how to use the Service UI')).toBeInTheDocument();
    expect(screen.getByText('Get help from the ManageIQ community')).toBeInTheDocument();
    expect(screen.getByText('Report bugs or request features')).toBeInTheDocument();
  });

  it('renders resources in a grid layout', () => {
    const { container } = render(<HelpResources />);

    const gridContainer = container.querySelector('[style*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });
});
