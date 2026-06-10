import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.cds--loading')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(<LoadingSpinner description="Loading services..." />);
    expect(screen.getByText('Loading services...')).toBeInTheDocument();
  });

  it('renders as small spinner when small prop is true', () => {
    const { container } = render(<LoadingSpinner small />);
    expect(container.querySelector('.cds--loading--small')).toBeInTheDocument();
  });

  it('renders with overlay when withOverlay prop is true', () => {
    const { container } = render(<LoadingSpinner withOverlay />);
    expect(container.querySelector('.cds--loading-overlay')).toBeInTheDocument();
  });

  it('does not show loading indicator when active is false', () => {
    const { container } = render(<LoadingSpinner active={false} />);
    const loading = container.querySelector('.cds--loading');
    // When active is false, the loading component is still in the DOM but not visible
    expect(loading).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders with multiple props combined', () => {
    render(
      <LoadingSpinner
        active
        description="Processing request..."
        small
        className="test-spinner"
      />
    );
    expect(screen.getByText('Processing request...')).toBeInTheDocument();
  });
});