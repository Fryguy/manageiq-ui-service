import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';
import PrivateRoutes from './PrivateRoutes';
import { LoginPage } from '../features/auth/components/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { AboutPage } from '../features/about/pages/AboutPage';

// Mock AppLayout to avoid complex layout dependencies
jest.mock('../features/layout/components/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

describe('Route Integration Tests', () => {
  const createAuthenticatedStore = () => {
    return configureStore({
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
  };

  const createUnauthenticatedStore = () => {
    return configureStore({
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
  };

  describe('Profile Route', () => {
    it('renders ProfilePage at /profile for authenticated users', async () => {
      const store = createAuthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      });

      // Verify it's wrapped in AppLayout
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('redirects to login when accessing /profile as unauthenticated user', async () => {
      const store = createUnauthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
    });
  });

  describe('About Route', () => {
    it('renders AboutPage at /about for authenticated users', async () => {
      const store = createAuthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/about']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });

      // Verify it's wrapped in AppLayout
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('redirects to login when accessing /about as unauthenticated user', async () => {
      const store = createUnauthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/about']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
    });
  });

  describe('Dashboard Route', () => {
    it('renders DashboardPage at / for authenticated users', async () => {
      const store = createAuthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      });

      // Verify it's wrapped in AppLayout
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });
  });

  describe('Login Route', () => {
    it('renders LoginPage at /login', async () => {
      const store = createUnauthenticatedStore();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });

      // Login page should not be wrapped in AppLayout
      expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
    });
  });

  describe('Authentication Protection', () => {
    it('protects all routes under PrivateRoutes', async () => {
      const store = createUnauthenticatedStore();

      const routes = ['/', '/profile', '/about'];

      for (const route of routes) {
        const { unmount } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
          </Provider>
        );

        await waitFor(() => {
          expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});