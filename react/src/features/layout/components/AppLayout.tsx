import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Content, Theme } from '@carbon/react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import './AppLayout.css';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout Component
 *
 * Main application layout that composes:
 * - Header with navigation and user actions
 * - Sidebar with RBAC-aware navigation menu
 * - Breadcrumbs for navigation context
 * - Content area for page content
 * - Footer with version and copyright info
 *
 * Uses Carbon Design System components and follows
 * the IBM Carbon layout patterns.
 */
const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);

  const handleMenuClick = () => {
    setIsSideNavExpanded(!isSideNavExpanded);
  };

  return (
    <Theme theme="white">
      <div className="app-layout">
        <Header
          onMenuClick={handleMenuClick}
          isSideNavExpanded={isSideNavExpanded}
        />
        <Sidebar
          isExpanded={isSideNavExpanded}
        />
        <Content className="app-layout__content">
          <Breadcrumbs />
          <div className="app-layout__main">
            {children || <Outlet />}
          </div>
        </Content>
        <Footer />
      </div>
    </Theme>
  );
};

export default AppLayout;
