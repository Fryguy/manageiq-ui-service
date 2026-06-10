import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderBreadcrumbs = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Breadcrumbs />
    </MemoryRouter>
  );
};

describe('Breadcrumbs', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('does not render on home page', () => {
    const { container } = renderBreadcrumbs('/');
    expect(container.querySelector('.cds--breadcrumb')).not.toBeInTheDocument();
  });

  it('does not render on login page', () => {
    const { container } = renderBreadcrumbs('/login');
    expect(container.querySelector('.cds--breadcrumb')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs for single level path', () => {
    renderBreadcrumbs('/dashboard');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders breadcrumbs for multi-level path', () => {
    renderBreadcrumbs('/services/123/details');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Services')).toBeInTheDocument();
    expect(screen.getAllByText('Details')).toHaveLength(2); // One for ID, one for details
  });

  it('marks current page as non-clickable', () => {
    renderBreadcrumbs('/services/details');

    const detailsLink = screen.getByText('Details');

    expect(detailsLink).toHaveAttribute('aria-current', 'page');
  });

  it('navigates when clicking non-current breadcrumb', () => {
    renderBreadcrumbs('/services/123/details');

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('uses route labels for known segments', () => {
    renderBreadcrumbs('/catalogs');

    expect(screen.getByText('Service Catalog')).toBeInTheDocument();
  });

  it('handles ID segments by showing generic label', () => {
    renderBreadcrumbs('/services/abc-123-def');

    expect(screen.getByText('My Services')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Breadcrumbs className="custom-class" />
      </MemoryRouter>
    );

    // The custom className is applied to the wrapper div
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.querySelector('.cds--breadcrumb')).toBeInTheDocument();
  });
});
