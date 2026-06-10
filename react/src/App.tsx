import { useEffect } from 'react';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRouter from './routes';
import { store } from './store';
import { initializeSession, clearSession } from './features/auth/store/authSlice';
import { initializeApiClient } from './api/client';

// Initialize API client with store integration
initializeApiClient({
  baseURL: '/api',
  getToken: () => {
    const state = store.getState();
    return state.auth.session.token;
  },
  onUnauthorized: () => {
    // Clear session on 401 response
    store.dispatch(clearSession());
  },
});

function App() {
  useEffect(() => {
    // Initialize session from localStorage on app mount
    store.dispatch(initializeSession());
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;