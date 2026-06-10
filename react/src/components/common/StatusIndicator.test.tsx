import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusIndicator } from './StatusIndicator';

describe('StatusIndicator', () => {
  it('renders success status', () => {
    render(<StatusIndicator status="success" />);
    expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Success');
  });

  it('renders error status', () => {
    render(<StatusIndicator status="error" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Error');
  });

  it('renders warning status', () => {
    render(<StatusIndicator status="warning" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Warning');
  });

  it('renders info status', () => {
    render(<StatusIndicator status="info" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Info');
  });

  it('renders in-progress status', () => {
    render(<StatusIndicator status="in-progress" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('In Progress');
  });

  it('renders unknown status', () => {
    render(<StatusIndicator status="unknown" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Unknown');
  });

  it('renders custom label', () => {
    render(<StatusIndicator status="success" label="Completed" />);
    expect(screen.getByTestId('status-indicator-label')).toHaveTextContent('Completed');
  });

  it('renders icon by default', () => {
    render(<StatusIndicator status="success" />);
    expect(screen.getByTestId('status-indicator-icon')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<StatusIndicator status="success" showIcon={false} />);
    expect(screen.queryByTestId('status-indicator-icon')).not.toBeInTheDocument();
  });

  it('applies small size class', () => {
    render(<StatusIndicator status="success" size="sm" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--sm');
  });

  it('applies medium size class by default', () => {
    render(<StatusIndicator status="success" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--md');
  });

  it('applies large size class', () => {
    render(<StatusIndicator status="success" size="lg" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--lg');
  });

  it('applies success status class', () => {
    render(<StatusIndicator status="success" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--success');
  });

  it('applies error status class', () => {
    render(<StatusIndicator status="error" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--error');
  });

  it('applies warning status class', () => {
    render(<StatusIndicator status="warning" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--warning');
  });

  it('applies info status class', () => {
    render(<StatusIndicator status="info" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--info');
  });

  it('applies in-progress status class', () => {
    render(<StatusIndicator status="in-progress" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--in-progress');
  });

  it('applies unknown status class', () => {
    render(<StatusIndicator status="unknown" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('miq-status-indicator--unknown');
  });

  it('applies custom className', () => {
    render(<StatusIndicator status="success" className="custom-status" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('custom-status');
  });

  it('uses custom testId', () => {
    render(<StatusIndicator status="success" testId="custom-status-indicator" />);
    expect(screen.getByTestId('custom-status-indicator')).toBeInTheDocument();
  });

  it('renders all status types correctly', () => {
    const statuses: Array<'success' | 'error' | 'warning' | 'info' | 'in-progress' | 'unknown'> = [
      'success',
      'error',
      'warning',
      'info',
      'in-progress',
      'unknown',
    ];

    statuses.forEach((status) => {
      const { unmount } = render(<StatusIndicator status={status} testId={`status-${status}`} />);
      expect(screen.getByTestId(`status-${status}`)).toBeInTheDocument();
      expect(screen.getByTestId(`status-${status}-icon`)).toBeInTheDocument();
      expect(screen.getByTestId(`status-${status}-label`)).toBeInTheDocument();
      unmount();
    });
  });
});
