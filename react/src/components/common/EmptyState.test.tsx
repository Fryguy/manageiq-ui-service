import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from './EmptyState';
import { Add } from '@carbon/icons-react';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No items found"
        description="Try adjusting your filters"
      />
    );
    
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState
        title="No items found"
        icon={<Add data-testid="add-icon" />}
      />
    );
    
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
  });

  it('renders action button and calls onAction', () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        title="No items found"
        actionText="Create New"
        onAction={onAction}
      />
    );
    
    const actionButton = screen.getByText('Create New');
    fireEvent.click(actionButton);
    
    expect(onAction).toHaveBeenCalled();
  });

  it('renders secondary action button and calls onSecondaryAction', () => {
    const onSecondaryAction = jest.fn();
    render(
      <EmptyState
        title="No items found"
        secondaryActionText="Learn More"
        onSecondaryAction={onSecondaryAction}
      />
    );
    
    const secondaryButton = screen.getByText('Learn More');
    fireEvent.click(secondaryButton);
    
    expect(onSecondaryAction).toHaveBeenCalled();
  });

  it('renders both action buttons', () => {
    const onAction = jest.fn();
    const onSecondaryAction = jest.fn();
    render(
      <EmptyState
        title="No items found"
        actionText="Create New"
        onAction={onAction}
        secondaryActionText="Learn More"
        onSecondaryAction={onSecondaryAction}
      />
    );
    
    expect(screen.getByText('Create New')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(
      <EmptyState title="No items found" size="lg" />
    );
    
    expect(container.querySelector('.empty-state--lg')).toBeInTheDocument();
  });

  it('does not render actions section when no actions provided', () => {
    render(<EmptyState title="No items found" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
