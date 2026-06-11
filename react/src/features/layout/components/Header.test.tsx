import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '../../auth/store/authSlice';

// Mock the i18n config module
jest.mock('../../../i18n/config', () => ({
  AVAILABLE_LOCALES: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
  ],
  getStoredLocale: jest.fn(() => 'en'),
  switchLocale: jest.fn(() => Promise.resolve()),
  getLocaleName: jest.fn((code: string) => {
    const locales: Record<string, string> = {
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
    };
    return locales[code] || 'English';
  }),
}));

// Mock the i18n module
jest.mock('../../../i18n', () => ({
  __: (str: string) => str,
}));

// Mock window.location.reload
delete (window as { location?: Location }).location;
window.location = { reload: jest.fn() } as unknown as Location;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Header', () => {
  const createMockStore = (authState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          session: {
            token: 'test-token',
            identity: {
              name: 'Test User',
              userid: 'testuser',
              role: 'Administrator',
            },
            features: {},
            expiresOn: undefined,
          },
          loading: false,
          error: null,
          isAuthenticated: true,
          ...authState,
        },
      },
    });
  };

  const renderHeader = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with application name', () => {
    renderHeader();
    expect(screen.getByText('ManageIQ Service UI')).toBeInTheDocument();
  });

  it('renders the menu button', () => {
    renderHeader();
    const menuButton = screen.getByLabelText(/navigation/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('renders the notifications button', () => {
    renderHeader();
    const notificationsButton = screen.getByLabelText('Notifications');
    expect(notificationsButton).toBeInTheDocument();
  });

  it('renders the user profile button', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');
    expect(profileButton).toBeInTheDocument();
  });

  it('opens profile menu when profile button is clicked', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');

    fireEvent.click(profileButton);

    expect(screen.getByText('Signed in as')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('displays user information in profile menu', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');

    fireEvent.click(profileButton);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('displays language switcher in profile menu', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');

    fireEvent.click(profileButton);

    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('displays logout button in profile menu', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');

    fireEvent.click(profileButton);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', async () => {
    const store = createMockStore();
    renderHeader(store);

    const profileButton = screen.getByLabelText('User Profile');
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays language switcher in profile menu', async () => {
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    fireEvent.click(profileButton);

    // Verify the language label is present in the profile menu
    expect(screen.getByText('Language')).toBeInTheDocument();
    
    // Note: Full dropdown interaction testing would require more complex setup
    // This test verifies the language switcher is present in the profile menu
  });

  it('displays fallback name when identity has no name', () => {
    const store = createMockStore({
      session: {
        token: 'test-token',
        identity: {
          userid: 'testuser',
        },
        features: {},
        expiresOn: undefined,
      },
    });

    renderHeader(store);
    const profileButton = screen.getByLabelText('User Profile');
    fireEvent.click(profileButton);

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('displays "User" when no identity information is available', () => {
    const store = createMockStore({
      session: {
        token: 'test-token',
        identity: null,
        features: {},
        expiresOn: undefined,
      },
    });

    renderHeader(store);
    const profileButton = screen.getByLabelText('User Profile');
    fireEvent.click(profileButton);

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('does not display role when not available', () => {
    const store = createMockStore({
      session: {
        token: 'test-token',
        identity: {
          name: 'Test User',
          userid: 'testuser',
        },
        features: {},
        expiresOn: undefined,
      },
    });

    renderHeader(store);
    const profileButton = screen.getByLabelText('User Profile');
    fireEvent.click(profileButton);

    expect(screen.queryByText('Administrator')).not.toBeInTheDocument();
  });

  it('closes profile menu when user information button is clicked', () => {
    renderHeader();
    const profileButton = screen.getByLabelText('User Profile');

    fireEvent.click(profileButton);
    expect(screen.getByText('User information')).toBeInTheDocument();

    const userInfoButton = screen.getByText('User information');
    fireEvent.click(userInfoButton);

    // Profile menu should close (panel should not be expanded)
    // This is tested by checking if the panel is no longer visible
    waitFor(() => {
      expect(screen.queryByText('Signed in as')).not.toBeVisible();
    });
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <Header onMenuClick={onMenuClick} />
        </BrowserRouter>
      </Provider>
    );

    const menuButton = screen.getByLabelText(/navigation/i);
    fireEvent.click(menuButton);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('updates menu button label based on sidebar state', () => {
    const { rerender } = render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <Header isSideNavExpanded={false} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <Header isSideNavExpanded={true} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
  });
});
