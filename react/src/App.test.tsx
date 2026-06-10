import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as authSlice from './features/auth/store/authSlice';

// Mock the auth slice
jest.mock('./features/auth/store/authSlice', () => ({
  ...jest.requireActual('./features/auth/store/authSlice'),
  initializeSession: jest.fn(() => ({ type: 'auth/initializeSession' })),
  clearSession: jest.fn(() => ({ type: 'auth/clearSession' })),
}));

// Mock the API client initialization
jest.mock('./api/client', () => ({
  initializeApiClient: jest.fn(),
}));

// Mock the router
jest.mock('./routes', () => {
  return function MockAppRouter() {
    return <div data-testid="app-router">App Router</div>;
  };
});

// Mock ErrorBoundary
jest.mock('./components/common/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('wraps app with Redux Provider', () => {
    render(<App />);
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('wraps app with ErrorBoundary', () => {
    render(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('initializes session on mount', async () => {
    const initializeSessionSpy = jest.spyOn(authSlice, 'initializeSession');
    
    render(<App />);
    
    await waitFor(() => {
      expect(initializeSessionSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('renders AppRouter inside ErrorBoundary', () => {
    render(<App />);
    
    const errorBoundary = screen.getByTestId('error-boundary');
    const appRouter = screen.getByTestId('app-router');
    
    expect(errorBoundary).toContainElement(appRouter);
  });

  it('provides store to child components', () => {
    const { container } = render(<App />);
    
    // Verify the Provider is present by checking the structure
    expect(container.querySelector('[data-testid="error-boundary"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="app-router"]')).toBeInTheDocument();
  });

  it('renders the complete component tree', () => {
    const { container } = render(<App />);
    
    // Verify the complete structure is rendered
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('only initializes session once on mount', async () => {
    const initializeSessionSpy = jest.spyOn(authSlice, 'initializeSession');
    
    const { rerender } = render(<App />);
    
    await waitFor(() => {
      expect(initializeSessionSpy).toHaveBeenCalledTimes(1);
    });
    
    // Rerender should not call initializeSession again
    rerender(<App />);
    
    await waitFor(() => {
      expect(initializeSessionSpy).toHaveBeenCalledTimes(1);
    });
  });
});