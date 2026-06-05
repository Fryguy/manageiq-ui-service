import { Navigate, Outlet, useLocation } from 'react-router-dom';

export interface PrivateRoutesProps {
  isAuthenticated?: boolean;
  redirectTo?: string;
}

export function PrivateRoutes({
  isAuthenticated = false,
  redirectTo = '/login',
}: PrivateRoutesProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={redirectTo} />;
  }

  return <Outlet />;
}

export default PrivateRoutes;
