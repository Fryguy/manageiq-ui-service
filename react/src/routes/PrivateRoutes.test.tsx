import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

describe('PrivateRoutes', () => {
  it('renders nested routes for authenticated users', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PrivateRoutes isAuthenticated />}>
            <Route element={<div>Protected content</div>} path="/" />
          </Route>
          <Route element={<div>Login page</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to the login route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PrivateRoutes isAuthenticated={false} />}>
            <Route element={<div>Protected content</div>} path="/" />
          </Route>
          <Route element={<div>Login page</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
