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
  VirtualMachine,
  UserAvatar,
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

  // Navigation structure with RBAC requirements
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
    {
      id: 'vms',
      label: 'Virtual Machines',
      path: '/vms',
      icon: VirtualMachine,
      requiredFeature: 'vm_explorer',
    },
    {
      id: 'profile',
      label: 'My Profile',
      path: '/profile',
      icon: UserAvatar,
      // Profile is always accessible to authenticated users
    },
  ];

  /**
   * Check if a navigation item should be visible based on RBAC
   */
  const isItemVisible = (item: NavItem): boolean => {
    // If no feature requirement, item is always visible
    if (!item.requiredFeature && !item.requiredFeatures) {
      return true;
    }

    // Check single feature requirement
    if (item.requiredFeature) {
      return has(item.requiredFeature);
    }

    // Check multiple feature requirements (any match)
    if (item.requiredFeatures) {
      return hasAny(item.requiredFeatures);
    }

    return false;
  };

  /**
   * Check if current path matches the nav item
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  /**
   * Handle navigation click
   */
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  /**
   * Render a navigation item
   */
  const renderNavItem = (item: NavItem) => {
    if (!isItemVisible(item)) {
      return null;
    }

    const Icon = item.icon;

    // If item has children, render as menu
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

    // Render as simple link
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
