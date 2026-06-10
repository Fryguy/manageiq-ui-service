import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="An error occurred" />);
    
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders default title for error severity', () => {
    render(<ErrorState message="Error occurred" severity="error" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders default title for warning severity', () => {
    render(<ErrorState message="Warning message" severity="warning" />);
    
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<ErrorState title="Custom Error" message="Error occurred" />);
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('renders React node as message', () => {
    render(
      <ErrorState
        message={
          <div>
            <p>First line</p>
            <p>Second line</p>
          </div>
        }
      />
    );
    
    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();
  });

  it('renders action button and calls onAction', () => {
    const onAction = jest.fn();
    render(
      <ErrorState
        message="Error occurred"
        actionText="Retry"
        onAction={onAction}
      />
    );
    
    const actionButton = screen.getByText('Retry');
    fireEvent.click(actionButton);
    
    expect(onAction).toHaveBeenCalled();
  });

  it('renders secondary action button', () => {
    const onSecondaryAction = jest.fn();
    render(
      <ErrorState
        message="Error occurred"
        secondaryActionText="Go Back"
        onSecondaryAction={onSecondaryAction}
      />
    );
    
    const secondaryButton = screen.getByText('Go Back');
    fireEvent.click(secondaryButton);
    
    expect(onSecondaryAction).toHaveBeenCalled();
  });

  it('shows error details when showDetails is true', () => {
    const error = new Error('Test error message');
    render(
      <ErrorState
        message="Error occurred"
        error={error}
        showDetails
      />
    );
    
    const showDetailsButton = screen.getByText(/show details/i);
    expect(showDetailsButton).toBeInTheDocument();
  });

  it('toggles error details visibility', () => {
    const error = new Error('Test error message');
    render(
      <ErrorState
        message="Error occurred"
        error={error}
        showDetails
      />
    );
    
    const showDetailsButton = screen.getByText(/show details/i);
    fireEvent.click(showDetailsButton);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText(/hide details/i)).toBeInTheDocument();
  });

  it('does not show details section when showDetails is false', () => {
    const error = new Error('Test error message');
    render(
      <ErrorState
        message="Error occurred"
        error={error}
        showDetails={false}
      />
    );
    
    expect(screen.queryByText(/show details/i)).not.toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(
      <ErrorState message="Error occurred" size="lg" />
    );
    
    expect(container.querySelector('.error-state--lg')).toBeInTheDocument();
  });

  it('applies severity class', () => {
    const { container } = render(
      <ErrorState message="Warning message" severity="warning" />
    );
    
    expect(container.querySelector('.error-state--warning')).toBeInTheDocument();
  });

  it('renders stack trace in details when available', () => {
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.js:1:1';
    
    render(
      <ErrorState
        message="Error occurred"
        error={error}
        showDetails
      />
    );
    
    const showDetailsButton = screen.getByText(/show details/i);
    fireEvent.click(showDetailsButton);
    
    expect(screen.getByText(/stack trace/i)).toBeInTheDocument();
  });
});