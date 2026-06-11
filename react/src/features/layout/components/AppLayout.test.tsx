import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AppLayout from './AppLayout';
import authReducer from '../../auth/store/authSlice';

// Mock child components
jest.mock('./Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('./Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('./Breadcrumbs', () => {
  return function MockBreadcrumbs() {
    return <div data-testid="breadcrumbs" className="app-layout__breadcrumbs">Breadcrumbs</div>;
  };
});

const createMockStore = () => {
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
        },
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    },
  });
};

const renderAppLayout = (children?: React.ReactNode) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout>{children}</AppLayout>
      </BrowserRouter>
    </Provider>
  );
};

describe('AppLayout', () => {
  it('renders all layout components', () => {
    renderAppLayout();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    renderAppLayout(<div data-testid="test-content">Test Content</div>);

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = renderAppLayout();

    expect(container.querySelector('.app-layout')).toBeInTheDocument();
    expect(container.querySelector('.app-layout__content')).toBeInTheDocument();
    expect(container.querySelector('.app-layout__breadcrumbs')).toBeInTheDocument();
    expect(container.querySelector('.app-layout__main')).toBeInTheDocument();
  });

  it('renders with Carbon Theme wrapper', () => {
    const { container } = renderAppLayout();

    // Carbon Theme component should be present
    expect(container.querySelector('[class*="cds--"]')).toBeInTheDocument();
  });
});
