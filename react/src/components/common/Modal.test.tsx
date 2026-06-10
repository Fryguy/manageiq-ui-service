import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const mockOnPrimaryClick = jest.fn();
  const mockOnSecondaryClick = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnPrimaryClick.mockClear();
    mockOnSecondaryClick.mockClear();
  });

  it('renders modal when open', () => {
    render(
      <Modal open onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onPrimaryClick when primary button is clicked', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Test Modal"
        onPrimaryClick={mockOnPrimaryClick}
        primaryButtonText="Save"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const primaryButton = screen.getByText('Save');
    fireEvent.click(primaryButton);
    
    expect(mockOnPrimaryClick).toHaveBeenCalled();
  });

  it('calls onSecondaryClick when secondary button is clicked', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Test Modal"
        onSecondaryClick={mockOnSecondaryClick}
        secondaryButtonText="Cancel"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const secondaryButton = screen.getByText('Cancel');
    fireEvent.click(secondaryButton);
    
    expect(mockOnSecondaryClick).toHaveBeenCalled();
  });

  it('calls onClose when secondary button is clicked without onSecondaryClick', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Test Modal"
        secondaryButtonText="Cancel"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const secondaryButton = screen.getByText('Cancel');
    fireEvent.click(secondaryButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables primary button when primaryButtonDisabled is true', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Test Modal"
        primaryButtonDisabled
        primaryButtonText="Save"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const primaryButton = screen.getByText('Save');
    expect(primaryButton).toBeDisabled();
  });

  it('disables primary button when loading is true', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Test Modal"
        loading
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const primaryButton = screen.getByText('Save');
    expect(primaryButton).toBeDisabled();
  });

  it('renders as danger modal when danger prop is true', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Delete Item"
        danger
        primaryButtonText="Delete"
      >
        <p>Are you sure?</p>
      </Modal>
    );
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
  });

  it('renders passive modal without buttons', () => {
    render(
      <Modal
        open
        onClose={mockOnClose}
        title="Information"
        passiveModal
      >
        <p>Information content</p>
      </Modal>
    );
    
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });
});