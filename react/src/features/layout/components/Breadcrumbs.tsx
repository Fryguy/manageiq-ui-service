import { Breadcrumb, BreadcrumbItem } from '@carbon/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

interface BreadcrumbSegment {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  className?: string;
}

/**
 * Breadcrumbs component that automatically generates breadcrumb navigation
 * based on the current route path.
 *
 * Maps route segments to human-readable labels and provides navigation.
 */
const Breadcrumbs = ({ className = '' }: BreadcrumbsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Route segment to label mapping
   * This can be extended as new routes are added
   */
  const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    catalogs: 'Service Catalog',
    services: 'My Services',
    orders: 'My Orders',
    vms: 'Virtual Machines',
    profile: 'My Profile',
    about: 'About',
    settings: 'Settings',
    details: 'Details',
    edit: 'Edit',
    new: 'New',
  };

  /**
   * Generate breadcrumb segments from current path
   */
  const breadcrumbs = useMemo((): BreadcrumbSegment[] => {
    const pathSegments = location.pathname
      .split('/')
      .filter((segment) => segment !== '');

    if (pathSegments.length === 0) {
      return [{ label: 'Home', path: '/' }];
    }

    const segments: BreadcrumbSegment[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Try to get a human-readable label, fallback to segment itself
      const label = routeLabels[segment] || segment;

      // For ID segments (numeric or UUID-like), use a generic label
      const isId = /^[0-9a-f-]+$/i.test(segment);
      const displayLabel = isId ? 'Details' : label;

      segments.push({
        label: displayLabel,
        path: currentPath,
      });
    });

    return segments;
  }, [location.pathname]);

  /**
   * Handle breadcrumb click navigation
   */
  const handleClick = (path: string) => {
    navigate(path);
  };

  // Don't render breadcrumbs on login page or if only home
  if (location.pathname === '/login' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className={className}>
      <Breadcrumb noTrailingSlash aria-label="Breadcrumb navigation">
        {breadcrumbs.map((crumb, index) => {
          const isCurrentPage = index === breadcrumbs.length - 1;

          return (
            <BreadcrumbItem
              key={crumb.path}
              isCurrentPage={isCurrentPage}
              onClick={() => !isCurrentPage && handleClick(crumb.path)}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {crumb.label}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
