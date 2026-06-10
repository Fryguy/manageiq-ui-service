import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';
import PrivateRoutes from './PrivateRoutes';

describe('PrivateRoutes', () => {
  it('renders nested routes for authenticated users', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          session: {
            identity: null,
            token: 'test-token',
            features: {},
          },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<div>Protected content</div>} path="/" />
            </Route>
            <Route element={<div>Login page</div>} path="/login" />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('renders AppLayout with Header, Sidebar, and Footer for authenticated users', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          session: {
            identity: { name: 'Test User', userid: 'testuser' },
            token: 'test-token',
            features: {},
          },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<div>Protected content</div>} path="/" />
            </Route>
            <Route element={<div>Login page</div>} path="/login" />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Verify AppLayout components are rendered
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('navigation', { name: 'Side navigation' })).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to the login route', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          session: {
            identity: null,
            token: null,
            features: {},
          },
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<div>Protected content</div>} path="/" />
            </Route>
            <Route element={<div>Login page</div>} path="/login" />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
