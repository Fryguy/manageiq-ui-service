import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  it('renders confirm dialog when open', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
      />
    );
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        confirmButtonText="Yes"
      />
    );
    
    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        cancelButtonText="No"
      />
    );
    
    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders as danger dialog when danger prop is true', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="This action cannot be undone."
        danger
      />
    );
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('disables confirm button when loading is true', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        loading
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toBeDisabled();
  });

  it('renders custom button text', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        confirmButtonText="Proceed"
        cancelButtonText="Go Back"
      />
    );
    
    expect(screen.getByText('Proceed')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('renders React node as message', () => {
    render(
      <ConfirmDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message={
          <div>
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </div>
        }
      />
    );
    
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });
});