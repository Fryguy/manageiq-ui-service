/**
 * Tests for LicenseInfo component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LicenseInfo } from './LicenseInfo';

describe('LicenseInfo', () => {
  it('renders license information with default values', () => {
    render(<LicenseInfo />);

    expect(screen.getByTestId('license-info')).toBeInTheDocument();
    expect(screen.getByText('License Information')).toBeInTheDocument();
    expect(screen.getByText('Apache License 2.0')).toBeInTheDocument();
    expect(screen.getByText(/ManageIQ/)).toBeInTheDocument();
  });

  it('renders custom license information', () => {
    render(
      <LicenseInfo
        licenseName="MIT License"
        licenseUrl="https://opensource.org/licenses/MIT"
        copyrightYear="2025"
        copyrightHolder="Custom Holder"
      />
    );

    expect(screen.getByText('MIT License')).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
    expect(screen.getByText(/Custom Holder/)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<LicenseInfo loading />);

    expect(screen.getByTestId('license-info-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('license-info')).not.toBeInTheDocument();
  });

  it('renders license URL as a link', () => {
    const licenseUrl = 'https://www.apache.org/licenses/LICENSE-2.0';
    render(<LicenseInfo licenseUrl={licenseUrl} />);

    const links = screen.getAllByRole('link', { name: /Apache License 2.0/i });
    expect(links[0]).toHaveAttribute('href', licenseUrl);
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders copyright notice', () => {
    const currentYear = new Date().getFullYear().toString();
    render(<LicenseInfo />);

    expect(screen.getByText(new RegExp(`© ${currentYear} ManageIQ`))).toBeInTheDocument();
  });

  it('renders license text', () => {
    render(<LicenseInfo />);

    expect(
      screen.getByText(/Licensed under the Apache License, Version 2.0/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/distributed under the License is distributed on an "AS IS" BASIS/)
    ).toBeInTheDocument();
  });
});
