import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '../../auth/store/authSlice';

const createMockStore = (authState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'test-token',
          identity: { name: 'Test User', userid: 'testuser', role: 'user' },
          features: {},
        },
        loading: false,
        error: null,
        isAuthenticated: true,
        ...authState,
      },
    },
  });
};

const renderHeader = (props = {}, authState = {}) => {
  const store = createMockStore(authState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    </Provider>
  );
};

describe('Header', () => {
  it('renders the header with application name', () => {
    renderHeader();
    expect(screen.getByText('ManageIQ Service UI')).toBeInTheDocument();
  });

  it('renders navigation toggle button', () => {
    renderHeader();
    expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
  });

  it('calls onMenuClick when navigation toggle button is clicked', () => {
    const onMenuClick = jest.fn();
    renderHeader({ onMenuClick });

    fireEvent.click(screen.getByLabelText('Open navigation'));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('renders global action buttons for notifications and user profile', () => {
    renderHeader();

    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('User Profile')).toBeInTheDocument();
    expect(screen.queryByLabelText('Language')).not.toBeInTheDocument();
  });

  it('shows the user profile panel with identity details when profile button is clicked', () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText('User Profile'));

    expect(screen.getByLabelText('User profile panel')).toBeInTheDocument();
    expect(screen.getByText('Signed in as')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'User information' })).toBeInTheDocument();
  });

  it('keeps the user information action available after opening the profile panel', () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText('User Profile'));

    expect(screen.getByRole('button', { name: 'User information' })).toBeInTheDocument();
  });

  it('falls back to userid when name is unavailable', () => {
    renderHeader({}, {
      session: {
        token: 'test-token',
        identity: { userid: 'fallback-user', role: 'admin' },
        features: {},
      },
      loading: false,
      error: null,
      isAuthenticated: true,
    });

    fireEvent.click(screen.getByLabelText('User Profile'));

    expect(screen.getByText('fallback-user')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('applies active state to navigation toggle button when expanded', () => {
    renderHeader({ isSideNavExpanded: true });

    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
  });

  it('applies inactive state to navigation toggle button when collapsed', () => {
    renderHeader({ isSideNavExpanded: false });

    expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
  });

  it('hamburger menu button is always visible via CSS override', () => {
    const { container } = renderHeader();

    const menuButton = container.querySelector('.cds--header__menu-toggle');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton?.tagName).toBe('BUTTON');
  });
});