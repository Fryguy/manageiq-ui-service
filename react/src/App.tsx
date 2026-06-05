import { Provider } from 'react-redux';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRouter from './routes';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;