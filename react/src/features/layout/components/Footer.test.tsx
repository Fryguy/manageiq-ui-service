import { render, screen, waitFor } from '@testing-library/react';
import Footer from './Footer';

// Mock fetch
global.fetch = jest.fn();

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders footer with copyright', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ server_info: {} }),
    });

    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} ManageIQ. All rights reserved.`)).toBeInTheDocument();
  });

  it('displays default version text when API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Footer />);
    
    await waitFor(() => {
      expect(screen.getByText('ManageIQ')).toBeInTheDocument();
    });
  });

  it('displays version information when available', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        server_info: {
          version: '1.2.3',
          build: 'abc123',
        },
      }),
    });

    render(<Footer />);
    
    await waitFor(() => {
      expect(screen.getByText(/ManageIQ 1\.2\.3/)).toBeInTheDocument();
      expect(screen.getByText(/\(abc123\)/)).toBeInTheDocument();
    });
  });

  it('displays version without build when build is not available', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        server_info: {
          version: '1.2.3',
        },
      }),
    });

    render(<Footer />);
    
    await waitFor(() => {
      expect(screen.getByText('ManageIQ 1.2.3')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ server_info: {} }),
    });

    const { container } = render(<Footer className="custom-class" />);
    
    expect(container.querySelector('.app-footer')).toHaveClass('custom-class');
  });
});
