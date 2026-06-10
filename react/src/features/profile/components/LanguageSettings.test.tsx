/**
 * Tests for LanguageSettings component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSettings } from './LanguageSettings';

describe('LanguageSettings', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render language settings form', () => {
    render(<LanguageSettings onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId('language-settings-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });

  it('should display current locale', () => {
    render(<LanguageSettings currentLocale="de" onSubmit={mockOnSubmit} />);
    const select = screen.getByLabelText('Language') as HTMLSelectElement;
    expect(select.value).toBe('de');
  });

  it('should disable submit button when locale is not changed', () => {
    render(<LanguageSettings currentLocale="en" onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByText('Save Language Preference');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when locale is changed', async () => {
    const user = userEvent.setup();
    render(<LanguageSettings currentLocale="en" onSubmit={mockOnSubmit} />);

    const select = screen.getByLabelText('Language');
    await user.selectOptions(select, 'de');

    const submitButton = screen.getByText('Save Language Preference');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit with new locale', async () => {
    const user = userEvent.setup();
    render(<LanguageSettings currentLocale="en" onSubmit={mockOnSubmit} />);

    const select = screen.getByLabelText('Language');
    await user.selectOptions(select, 'de');

    const submitButton = screen.getByText('Save Language Preference');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ locale: 'de' });
    });
  });

  it('should display error message', () => {
    const errorMessage = 'Failed to update language';
    render(<LanguageSettings onSubmit={mockOnSubmit} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should disable form when loading', () => {
    render(<LanguageSettings onSubmit={mockOnSubmit} loading={true} />);
    const select = screen.getByLabelText('Language');
    const submitButton = screen.getByText('Save Language Preference');
    expect(select).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should display info notification', () => {
    render(<LanguageSettings onSubmit={mockOnSubmit} />);
    expect(screen.getByText('The application will reload after changing the language.')).toBeInTheDocument();
  });
});
