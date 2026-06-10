import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import * as useAuthHook from '../hooks/useAuth';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockClearError = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

jest.mock('../hooks/useAuth');

describe('LoginPage', () => {
  const defaultAuthState = {
    login: mockLogin,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    clearError: mockClearError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthHook.useAuth as jest.Mock).mockReturnValue(defaultAuthState);
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'ManageIQ Service UI' })).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles username input change', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(usernameInput.value).toBe('testuser');
  });

  it('handles password input change', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(passwordInput.value).toBe('testpass');
  });

  it('submits form with valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });
  });

  it('trims username before submission', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: '  testuser  ' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });
  });

  it('displays loading state during login', () => {
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      ...defaultAuthState,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    expect(screen.getByLabelText('Username')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
  });

  it('displays authentication error', () => {
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      ...defaultAuthState,
      error: 'Invalid credentials',
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Login Failed')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('clears auth error when typing in username', () => {
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      ...defaultAuthState,
      error: 'Invalid credentials',
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

    const usernameInput = screen.getByLabelText('Username');
    fireEvent.change(usernameInput, { target: { value: 'test' } });

    expect(mockClearError).toHaveBeenCalled();
  });

  it('clears auth error when typing in password', () => {
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      ...defaultAuthState,
      error: 'Invalid credentials',
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'test' } });

    expect(mockClearError).toHaveBeenCalled();
  });

  it('redirects to root when authenticated', () => {
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({
      ...defaultAuthState,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('clears error on unmount', () => {
    const { unmount } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    unmount();

    expect(mockClearError).toHaveBeenCalled();
  });

  it('handles login failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockLogin.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Login failed:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('has required attributes on form inputs', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(usernameInput).toHaveAttribute('autocomplete', 'username');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  it('has correct input types', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});