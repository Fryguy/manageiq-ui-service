import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Card title="Test Title">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Title');
  });

  it('renders subtitle when provided', () => {
    render(
      <Card subtitle="Test Subtitle">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card-subtitle')).toHaveTextContent('Test Subtitle');
  });

  it('renders both title and subtitle', () => {
    render(
      <Card title="Title" subtitle="Subtitle">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card-title')).toHaveTextContent('Title');
    expect(screen.getByTestId('card-subtitle')).toHaveTextContent('Subtitle');
  });

  it('renders footer when provided', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('applies clickable class when clickable prop is true', () => {
    render(
      <Card clickable>
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('miq-card--clickable');
  });

  it('applies clickable class when onClick is provided', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('miq-card--clickable');
  });

  it('applies selected class when selected prop is true', () => {
    render(
      <Card selected>
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('miq-card--selected');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    );
    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('uses custom testId', () => {
    render(
      <Card testId="custom-card">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });

  it('renders without header when no title or subtitle', () => {
    render(
      <Card>
        <p>Content</p>
      </Card>
    );
    expect(screen.queryByTestId('card-header')).not.toBeInTheDocument();
  });

  it('renders complex content', () => {
    render(
      <Card
        title="Service Card"
        subtitle="Running"
        footer={
          <div>
            <button>Start</button>
            <button>Stop</button>
          </div>
        }
      >
        <div>
          <p>CPU: 50%</p>
          <p>Memory: 2GB</p>
        </div>
      </Card>
    );
    expect(screen.getByText('Service Card')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('CPU: 50%')).toBeInTheDocument();
    expect(screen.getByText('Memory: 2GB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
  });
});
