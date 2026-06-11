import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Sidebar from './Sidebar';
import authReducer from '../../auth/store/authSlice';

const createMockStore = (features = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        session: {
          token: 'test-token',
          identity: { name: 'Test User', role: 'user' },
          features,
        },
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    },
  });
};

const renderSidebar = (props = {}, features = {}) => {
  const store = createMockStore(features);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar isExpanded={true} {...props} />
      </BrowserRouter>
    </Provider>
  );
};

describe('Sidebar', () => {
  it('renders sidebar navigation', () => {
    renderSidebar();
    expect(screen.getByLabelText('Side navigation')).toBeInTheDocument();
  });

  it('shows only items user has permission for', () => {
    const features = {
      dashboard_view: true,
      service_view: true,
    };

    renderSidebar({}, features);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Services')).toBeInTheDocument();
    expect(screen.queryByText('Service Catalog')).not.toBeInTheDocument();
  });

  it('shows all items when user has all permissions', () => {
    const features = {
      dashboard_view: true,
      svc_catalog_provision: true,
      service_view: true,
      miq_request_view: true,
      vm_explorer: true,
    };

    renderSidebar({}, features);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Service Catalog')).toBeInTheDocument();
    expect(screen.getByText('My Services')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('Virtual Machines')).toBeInTheDocument();
  });

  it('always shows profile link regardless of permissions', () => {
    renderSidebar({}, {});
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('hides items when user lacks permissions', () => {
    const features = {
      dashboard_view: true,
    };

    renderSidebar({}, features);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Service Catalog')).not.toBeInTheDocument();
    expect(screen.queryByText('My Services')).not.toBeInTheDocument();
    expect(screen.queryByText('My Orders')).not.toBeInTheDocument();
  });

  it('respects isExpanded prop', () => {
    const { container } = renderSidebar({ isExpanded: false });
    const sideNav = container.querySelector('.cds--side-nav');
    expect(sideNav).not.toHaveClass('cds--side-nav--expanded');
  });

  it('renders with isFixedNav for persistent visibility', () => {
    const { container } = renderSidebar();
    const sideNav = container.querySelector('.cds--side-nav');
    // Verify sidebar is rendered (isFixedNav makes it always present in DOM)
    expect(sideNav).toBeInTheDocument();
    // When expanded, it should have the expanded class
    expect(sideNav).toHaveClass('cds--side-nav--expanded');
  });
});
