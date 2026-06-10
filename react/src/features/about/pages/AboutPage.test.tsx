/**
 * Tests for AboutPage component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AboutPage } from './AboutPage';
import aboutReducer from '../store/aboutSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      about: aboutReducer,
    },
    preloadedState: {
      about: {
        appInfo: null,
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

describe('AboutPage', () => {
  it('renders about page with tabs', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AboutPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
      expect(screen.getByText('About ManageIQ Service UI')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Version' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'License' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Help & Support' })).toBeInTheDocument();
    });
  });

  it('displays version information in first tab', async () => {
    const store = createMockStore({
      appInfo: {
        version: '1.0.0',
        buildDate: '2026-06-10',
        gitCommit: 'abc123',
      },
      loading: false,
    });

    render(
      <Provider store={store}>
        <AboutPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Version Information')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    const store = createMockStore({
      error: 'Failed to load',
      loading: false,
    });

    // Mock the dispatch to prevent fetchAppInfo from being called
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    dispatchSpy.mockImplementation(() => {});

    render(
      <Provider store={store}>
        <AboutPage />
      </Provider>
    );

    // Since error is set, the error UI should be shown
    expect(screen.getByText('Error loading application information')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    
    dispatchSpy.mockRestore();
  });

  it('fetches app info on mount', async () => {
    const store = createMockStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <AboutPage />
      </Provider>
    );

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('renders all three tab panels', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <AboutPage />
      </Provider>
    );

    await waitFor(() => {
      // Carbon renders all tab panels but only the active one is visible
      const tabPanels = container.querySelectorAll('[role="tabpanel"]');
      expect(tabPanels).toHaveLength(3);

      // Only the first tab panel should be visible (not hidden)
      expect(tabPanels[0]).not.toHaveAttribute('hidden');
      expect(tabPanels[1]).toHaveAttribute('hidden');
      expect(tabPanels[2]).toHaveAttribute('hidden');
    });
  });
});
