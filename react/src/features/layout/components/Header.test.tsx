import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '../../auth/store/authSlice';
import aboutReducer from '../../about/store/aboutSlice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      about: aboutReducer,
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
          loading: false,
          error: null,
        },
      },
      about: {
        appInfo: null,
        modalInfo: {
          version: '1.0.0',
          suiVersion: '2.0.0',
          serverName: 'test-server',
          userName: 'test-user',
          userRole: 'admin',
          copyright: '© 2026 ManageIQ',
          supportWebsiteText: 'Support',
          supportWebsite: 'https://example.com/support',
          documentationUrl: '/docs',
        },
        loading: false,
        error: null,
      },
      ...initialState,
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

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the header with brand name', () => {
    renderHeader();
    expect(screen.getByText('ManageIQ Service UI')).toBeInTheDocument();
  });

  it('displays user name in profile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    await user.click(profileButton);

    expect(await screen.findByText('Test User')).toBeInTheDocument();
  });

  it('displays user role in profile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    await user.click(profileButton);

    expect(await screen.findByText('Administrator')).toBeInTheDocument();
  });

  it('has a help button that opens About modal', async () => {
    const user = userEvent.setup();
    renderHeader();

    const helpButton = screen.getByLabelText('Help');
    expect(helpButton).toBeInTheDocument();

    await user.click(helpButton);

    expect(await screen.findByText('About ManageIQ Service UI')).toBeInTheDocument();
  });

  it('has a language switcher in profile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    await user.click(profileButton);

    expect(await screen.findByText('Language')).toBeInTheDocument();
  });

  it('has a logout button in profile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    await user.click(profileButton);

    expect(await screen.findByText('Logout')).toBeInTheDocument();
  });

  it('calls logout and navigates to login when logout is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    const profileButton = screen.getByLabelText('User Profile');
    await user.click(profileButton);

    const logoutButton = await screen.findByText('Logout');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });

  it('has a notifications button', () => {
    renderHeader();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });
});
