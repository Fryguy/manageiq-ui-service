import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

function DashboardPage() {
  return <div>Dashboard</div>;
}

function LoginPage() {
  return <div>Login</div>;
}

function NotFoundPage() {
  return <div>Page not found</div>;
}

export const appRoutes = [
  {
    path: '/',
    element: <PrivateRoutes isAuthenticated={false} />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(appRoutes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
