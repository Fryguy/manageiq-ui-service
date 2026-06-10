import React from 'react';
import { render, screen } from '@testing-library/react';
import { IconDisplay } from './IconDisplay';

describe('IconDisplay', () => {
  it('renders icon', () => {
    render(<IconDisplay icon="Checkmark" />);
    expect(screen.getByTestId('icon-display')).toBeInTheDocument();
  });

  it('applies default size of 20', () => {
    render(<IconDisplay icon="Checkmark" />);
    const icon = screen.getByTestId('icon-display');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
  });

  it('applies custom size', () => {
    render(<IconDisplay icon="Checkmark" size={32} />);
    const icon = screen.getByTestId('icon-display');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('applies primary color class', () => {
    render(<IconDisplay icon="Checkmark" color="primary" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--primary');
  });

  it('applies secondary color class', () => {
    render(<IconDisplay icon="Checkmark" color="secondary" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--secondary');
  });

  it('applies success color class', () => {
    render(<IconDisplay icon="Checkmark" color="success" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--success');
  });

  it('applies error color class', () => {
    render(<IconDisplay icon="Error" color="error" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--error');
  });

  it('applies warning color class', () => {
    render(<IconDisplay icon="Warning" color="warning" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--warning');
  });

  it('applies info color class', () => {
    render(<IconDisplay icon="Information" color="info" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('miq-icon-display--info');
  });

  it('applies custom className', () => {
    render(<IconDisplay icon="Checkmark" className="custom-icon" />);
    expect(screen.getByTestId('icon-display')).toHaveClass('custom-icon');
  });

  it('applies aria-label', () => {
    render(<IconDisplay icon="Checkmark" ariaLabel="Success icon" />);
    expect(screen.getByTestId('icon-display')).toHaveAttribute('aria-label', 'Success icon');
  });

  it('uses custom testId', () => {
    render(<IconDisplay icon="Checkmark" testId="custom-icon" />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders different icon types', () => {
    const icons: Array<keyof typeof import('@carbon/icons-react')> = [
      'Checkmark',
      'Error',
      'Warning',
      'Information',
      'Add',
      'Close',
    ];

    icons.forEach((icon) => {
      const { unmount } = render(<IconDisplay icon={icon} testId={`icon-${icon}`} />);
      expect(screen.getByTestId(`icon-${icon}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles invalid icon gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    // Use a string that's not a valid icon name to test error handling
    const invalidIcon = 'InvalidIcon' as keyof typeof import('@carbon/icons-react');
    const { container } = render(<IconDisplay icon={invalidIcon} />);
    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Icon "InvalidIcon" not found in Carbon icons');
    consoleSpy.mockRestore();
  });

  it('renders with all size options', () => {
    const sizes: Array<16 | 20 | 24 | 32> = [16, 20, 24, 32];

    sizes.forEach((size) => {
      const { unmount } = render(<IconDisplay icon="Checkmark" size={size} testId={`icon-${size}`} />);
      const icon = screen.getByTestId(`icon-${size}`);
      expect(icon).toHaveAttribute('width', size.toString());
      expect(icon).toHaveAttribute('height', size.toString());
      unmount();
    });
  });
});