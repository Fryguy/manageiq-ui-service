import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from '@carbon/react';
import {
  Dashboard,
  Catalog,
  Application,
  ShoppingCart,
} from '@carbon/icons-react';
import { usePermissions } from '../../auth/hooks/usePermissions';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isExpanded: boolean;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  requiredFeature?: string;
  requiredFeatures?: string[];
  children?: NavItem[];
}

const Sidebar = ({ isExpanded }: SidebarProps) => {
  const { has, hasAny } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: Dashboard,
      requiredFeature: 'dashboard_view',
    },
    {
      id: 'catalogs',
      label: 'Service Catalog',
      path: '/catalogs',
      icon: Catalog,
      requiredFeature: 'svc_catalog_provision',
    },
    {
      id: 'services',
      label: 'My Services',
      path: '/services',
      icon: Application,
      requiredFeature: 'service_view',
    },
    {
      id: 'orders',
      label: 'My Orders',
      path: '/orders',
      icon: ShoppingCart,
      requiredFeature: 'miq_request_view',
    },
  ];

  const isItemVisible = (item: NavItem): boolean => {
    if (!item.requiredFeature && !item.requiredFeatures) {
      return true;
    }

    if (item.requiredFeature) {
      return has(item.requiredFeature);
    }

    if (item.requiredFeatures) {
      return hasAny(item.requiredFeatures);
    }

    return false;
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const renderNavItem = (item: NavItem) => {
    if (!isItemVisible(item)) {
      return null;
    }

    const Icon = item.icon;

    if (item.children && item.children.length > 0) {
      const visibleChildren = item.children.filter(isItemVisible);

      if (visibleChildren.length === 0) {
        return null;
      }

      return (
        <SideNavMenu
          key={item.id}
          renderIcon={Icon}
          title={item.label}
          defaultExpanded={visibleChildren.some((child) => isActive(child.path))}
        >
          {visibleChildren.map((child) => {
            const ChildIcon = child.icon;
            return (
              <SideNavMenuItem
                key={child.id}
                isActive={isActive(child.path)}
                onClick={() => handleNavClick(child.path)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChildIcon size={16} />
                  {child.label}
                </div>
              </SideNavMenuItem>
            );
          })}
        </SideNavMenu>
      );
    }

    return (
      <SideNavLink
        key={item.id}
        renderIcon={Icon}
        isActive={isActive(item.path)}
        onClick={() => handleNavClick(item.path)}
      >
        {item.label}
      </SideNavLink>
    );
  };

  return (
    <SideNav
      aria-label="Side navigation"
      expanded={isExpanded}
      isRail
    >
      <SideNavItems>
        {navItems.map(renderNavItem)}
      </SideNavItems>
    </SideNav>
  );
};

export default Sidebar;