import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '../../auth/store/authSlice';

// Mock the LanguageSwitcher component
jest.mock('./LanguageSwitcher', () => {
  return function MockLanguageSwitcher({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="language-switcher">
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

const createMockStore = (authState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'test-token',
          identity: { name: 'Test User', role: 'user' },
          features: {},
          loading: false,
          error: null,
        },
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

  it('renders menu button', () => {
    renderHeader();
    const menuButton = screen.getByLabelText(/menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();
    renderHeader({ onMenuClick });
    
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);
    
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('renders global action buttons', () => {
    renderHeader();
    
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('User Profile')).toBeInTheDocument();
  });

  it('shows language switcher when language button is clicked', () => {
    renderHeader();
    
    const languageButton = screen.getByLabelText('Language');
    fireEvent.click(languageButton);
    
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('hides language switcher when closed', () => {
    renderHeader();
    
    const languageButton = screen.getByLabelText('Language');
    fireEvent.click(languageButton);
    
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('language-switcher')).not.toBeInTheDocument();
  });

  it('applies active state to menu button when expanded', () => {
    renderHeader({ isSideNavExpanded: true });
    
    const menuButton = screen.getByLabelText(/close menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('applies inactive state to menu button when collapsed', () => {
    renderHeader({ isSideNavExpanded: false });
    
    const menuButton = screen.getByLabelText(/open menu/i);
    expect(menuButton).toBeInTheDocument();
  });
});
