import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';
import { RootState } from '../store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

/**
 * Custom render function that wraps components with Redux Provider and Router
 * for testing purposes.
 *
 * @param ui - The React component to render
 * @param options - Optional render options including preloadedState and store
 * @returns The result of the render function with the store
 *
 * @example
 * ```tsx
 * const { getByText, store } = renderWithProviders(<MyComponent />);
 * ```
 *
 * @example
 * ```tsx
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   preloadedState: {
 *     auth: { user: mockUser, isAuthenticated: true }
 *   }
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
