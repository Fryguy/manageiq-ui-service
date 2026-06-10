import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import AppLayout from '../features/layout/components/AppLayout';

export interface PrivateRoutesProps {
  redirectTo?: string;
}

export function PrivateRoutes({
  redirectTo = '/login',
}: PrivateRoutesProps) {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={redirectTo} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default PrivateRoutes;
