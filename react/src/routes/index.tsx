import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { LoginPage } from '../features/auth/components/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';

function NotFoundPage() {
  return <div>Page not found</div>;
}

export const appRoutes = [
  {
    path: '/',
    element: <PrivateRoutes />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
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