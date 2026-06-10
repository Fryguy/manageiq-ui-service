/**
 * DashboardGrid component tests
 */

import { render, screen } from '@testing-library/react';
import { DashboardGrid, DashboardRow, DashboardWidget } from './DashboardGrid';

describe('DashboardGrid', () => {
  it('renders children correctly', () => {
    render(
      <DashboardGrid>
        <div data-testid="test-child">Test Content</div>
      </DashboardGrid>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <DashboardGrid>
        <div>Content</div>
      </DashboardGrid>
    );

    expect(container.querySelector('.dashboard-grid')).toBeInTheDocument();
  });
});

describe('DashboardRow', () => {
  it('renders children correctly', () => {
    render(
      <DashboardRow>
        <div data-testid="test-child">Test Content</div>
      </DashboardRow>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <DashboardRow>
        <div>Content</div>
      </DashboardRow>
    );

    expect(container.querySelector('.dashboard-grid__row')).toBeInTheDocument();
  });
});

describe('DashboardWidget', () => {
  it('renders children correctly', () => {
    render(
      <DashboardWidget>
        <div data-testid="test-child">Test Content</div>
      </DashboardWidget>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies default span class', () => {
    const { container } = render(
      <DashboardWidget>
        <div>Content</div>
      </DashboardWidget>
    );

    const widget = container.querySelector('.dashboard-grid__widget');
    expect(widget).toHaveClass('dashboard-grid__widget--half');
  });

  it('applies custom span class', () => {
    const { container } = render(
      <DashboardWidget span="full">
        <div>Content</div>
      </DashboardWidget>
    );

    const widget = container.querySelector('.dashboard-grid__widget');
    expect(widget).toHaveClass('dashboard-grid__widget--full');
  });

  it('supports all span options', () => {
    const spans = ['full', 'half', 'third', 'quarter'] as const;

    spans.forEach((span) => {
      const { container } = render(
        <DashboardWidget span={span}>
          <div>Content</div>
        </DashboardWidget>
      );

      const widget = container.querySelector('.dashboard-grid__widget');
      expect(widget).toHaveClass(`dashboard-grid__widget--${span}`);
    });
  });
});
