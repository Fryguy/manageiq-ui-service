/**
 * Tests for VersionInfo component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { VersionInfo } from './VersionInfo';

describe('VersionInfo', () => {
  it('renders version information', () => {
    render(
      <VersionInfo
        version="1.0.0"
        buildDate="2026-06-10"
        gitCommit="abc123def456"
      />
    );

    expect(screen.getByTestId('version-info')).toBeInTheDocument();
    expect(screen.getByText('Version Information')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('2026-06-10')).toBeInTheDocument();
    expect(screen.getByText('abc123def456')).toBeInTheDocument();
  });

  it('renders default values when props are not provided', () => {
    render(<VersionInfo />);

    expect(screen.getByTestId('version-info')).toBeInTheDocument();
    expect(screen.getAllByText('N/A')).toHaveLength(3);
  });

  it('renders loading state', () => {
    render(<VersionInfo loading />);

    expect(screen.getByTestId('version-info-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('version-info')).not.toBeInTheDocument();
  });

  it('renders structured list with correct headers', () => {
    render(<VersionInfo version="1.0.0" />);

    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Application Version')).toBeInTheDocument();
    expect(screen.getByText('Build Date')).toBeInTheDocument();
    expect(screen.getByText('Git Commit')).toBeInTheDocument();
  });

  it('renders git commit in code element', () => {
    const { container } = render(<VersionInfo gitCommit="abc123" />);

    const codeElement = container.querySelector('code');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveTextContent('abc123');
  });
});
