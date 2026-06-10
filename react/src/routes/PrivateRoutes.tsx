import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

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

  return <Outlet />;
}

export default PrivateRoutes;
