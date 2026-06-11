import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { LoginPage } from '../features/auth/components/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { AboutPage } from '../features/about/pages/AboutPage';

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
      {
        path: 'about',
        element: <AboutPage />,
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
