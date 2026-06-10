import { useEffect } from 'react';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRouter from './routes';
import { store } from './store';
import { initializeSession } from './features/auth/store/authSlice';

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