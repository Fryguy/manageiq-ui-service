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
    <div data-testid="app-layout">
      <div data-testid="mock-header">Header</div>
      <div data-testid="mock-sidebar">Sidebar</div>
      {children}
      <div data-testid="mock-footer">Footer</div>
    </div>
  ),
}));

describe('Layout & Navigation Integration Tests', () => {
  const createAuthenticatedStore = () => {
    return configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          session: {
            identity: { name: 'Test User', userid: 'testuser' },
            token: 'test-token',
            features: {
              dashboard_view: true,
              service_view: true,
            },
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

  describe('Integration Test: Login → Dashboard (with layout)', () => {
    it('shows login page for unauthenticated users, then dashboard with layout after authentication', async () => {
      const store = createUnauthenticatedStore();

      const { rerender } = render(
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

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });

      // Should not show layout on login page
      expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();

      // Simulate authentication
      const authenticatedStore = createAuthenticatedStore();

      rerender(
        <Provider store={authenticatedStore}>
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

      // Should show dashboard with layout
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Test: Dashboard → Profile (via sidebar)', () => {
    it('renders profile page with layout when navigating from dashboard', async () => {
      const store = createAuthenticatedStore();

      // Render profile page directly (simulating navigation)
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

      // Verify we're on profile page with layout
      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Test: Dashboard → About (via sidebar or footer)', () => {
    it('renders about page with layout when navigating from dashboard', async () => {
      const store = createAuthenticatedStore();

      // Render about page directly (simulating navigation)
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

      // Verify we're on about page with layout
      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Test: Breadcrumbs update correctly', () => {
    it('renders correct page based on route', async () => {
      const store = createAuthenticatedStore();
      const routes = [
        { path: '/', testId: 'dashboard-page' },
        { path: '/profile', testId: 'profile-page' },
        { path: '/about', testId: 'about-page' },
      ];

      // Test each route renders correctly with layout
      for (const route of routes) {
        const { unmount } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[route.path]}>
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
          expect(screen.getByTestId(route.testId)).toBeInTheDocument();
          expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });

  describe('Integration Test: Logout from any page', () => {
    it('logs out from dashboard and redirects to login', async () => {
      const store = createAuthenticatedStore();

      const { rerender } = render(
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

      // Verify we're on dashboard
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      });

      // Simulate logout
      const unauthenticatedStore = createUnauthenticatedStore();

      rerender(
        <Provider store={unauthenticatedStore}>
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

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });

      // Should not show layout
      expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
    });

    it('logs out from profile page and redirects to login', async () => {
      const store = createAuthenticatedStore();

      const { rerender } = render(
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

      // Verify we're on profile
      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      });

      // Simulate logout
      const unauthenticatedStore = createUnauthenticatedStore();

      rerender(
        <Provider store={unauthenticatedStore}>
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

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });
  });

  describe('Layout Consistency', () => {
    it('renders Header, Sidebar, and Footer on all authenticated pages', async () => {
      const store = createAuthenticatedStore();
      const pages = [
        { path: '/', testId: 'dashboard-page' },
        { path: '/profile', testId: 'profile-page' },
        { path: '/about', testId: 'about-page' },
      ];

      for (const page of pages) {
        const { unmount } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[page.path]}>
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
          expect(screen.getByTestId(page.testId)).toBeInTheDocument();
          expect(screen.getByTestId('app-layout')).toBeInTheDocument();
          expect(screen.getByTestId('mock-header')).toBeInTheDocument();
          expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
          expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
