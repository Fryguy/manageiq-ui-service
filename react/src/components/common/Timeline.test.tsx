import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline, TimelineEvent } from './Timeline';

describe('Timeline', () => {
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Service Created',
      description: 'Service was successfully created',
      timestamp: '2024-01-01T10:00:00Z',
      type: 'success',
    },
    {
      id: '2',
      title: 'Service Started',
      description: 'Service startup initiated',
      timestamp: '2024-01-01T10:05:00Z',
      type: 'info',
    },
    {
      id: '3',
      title: 'Service Running',
      timestamp: '2024-01-01T10:10:00Z',
    },
  ];

  it('renders timeline with events', () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getByText('Service Created')).toBeInTheDocument();
    expect(screen.getByText('Service Started')).toBeInTheDocument();
    expect(screen.getByText('Service Running')).toBeInTheDocument();
  });

  it('renders event descriptions', () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getByText('Service was successfully created')).toBeInTheDocument();
    expect(screen.getByText('Service startup initiated')).toBeInTheDocument();
  });

  it('renders timestamps by default', () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getByTestId('timeline-timestamp-0')).toHaveTextContent('2024-01-01T10:00:00Z');
    expect(screen.getByTestId('timeline-timestamp-1')).toHaveTextContent('2024-01-01T10:05:00Z');
  });

  it('hides timestamps when showTimestamps is false', () => {
    render(<Timeline events={mockEvents} showTimestamps={false} />);
    expect(screen.queryByTestId('timeline-timestamp-0')).not.toBeInTheDocument();
  });

  it('displays empty message when no events', () => {
    render(<Timeline events={[]} />);
    expect(screen.getByTestId('timeline-empty')).toHaveTextContent('No events to display');
  });

  it('applies custom className', () => {
    render(<Timeline events={mockEvents} className="custom-timeline" />);
    expect(screen.getByTestId('timeline')).toHaveClass('custom-timeline');
  });

  it('applies success type class', () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getByTestId('timeline-event-0')).toHaveClass('miq-timeline__event--success');
  });

  it('applies info type class', () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getByTestId('timeline-event-1')).toHaveClass('miq-timeline__event--info');
  });

  it('renders event without type class', () => {
    render(<Timeline events={mockEvents} />);
    const event = screen.getByTestId('timeline-event-2');
    expect(event).not.toHaveClass('miq-timeline__event--success');
    expect(event).not.toHaveClass('miq-timeline__event--error');
  });

  it('renders custom icon', () => {
    const eventsWithIcon: TimelineEvent[] = [
      {
        id: '1',
        title: 'Event',
        timestamp: '2024-01-01',
        icon: <span data-testid="custom-icon">✓</span>,
      },
    ];

    render(<Timeline events={eventsWithIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders additional content', () => {
    const eventsWithContent: TimelineEvent[] = [
      {
        id: '1',
        title: 'Event',
        timestamp: '2024-01-01',
        content: <div data-testid="extra-content">Extra details</div>,
      },
    ];

    render(<Timeline events={eventsWithContent} />);
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
  });

  it('uses custom testId', () => {
    render(<Timeline events={mockEvents} testId="custom-timeline" />);
    expect(screen.getByTestId('custom-timeline')).toBeInTheDocument();
  });

  it('renders all event types correctly', () => {
    const allTypeEvents: TimelineEvent[] = [
      { id: '1', title: 'Default', timestamp: '2024-01-01', type: 'default' },
      { id: '2', title: 'Success', timestamp: '2024-01-02', type: 'success' },
      { id: '3', title: 'Error', timestamp: '2024-01-03', type: 'error' },
      { id: '4', title: 'Warning', timestamp: '2024-01-04', type: 'warning' },
      { id: '5', title: 'Info', timestamp: '2024-01-05', type: 'info' },
    ];

    render(<Timeline events={allTypeEvents} />);
    expect(screen.getByTestId('timeline-event-0')).toHaveClass('miq-timeline__event--default');
    expect(screen.getByTestId('timeline-event-1')).toHaveClass('miq-timeline__event--success');
    expect(screen.getByTestId('timeline-event-2')).toHaveClass('miq-timeline__event--error');
    expect(screen.getByTestId('timeline-event-3')).toHaveClass('miq-timeline__event--warning');
    expect(screen.getByTestId('timeline-event-4')).toHaveClass('miq-timeline__event--info');
  });

  it('renders event without description', () => {
    const eventsWithoutDesc: TimelineEvent[] = [
      { id: '1', title: 'Event', timestamp: '2024-01-01' },
    ];

    render(<Timeline events={eventsWithoutDesc} />);
    expect(screen.queryByTestId('timeline-description-0')).not.toBeInTheDocument();
  });

  it('renders all event components', () => {
    render(<Timeline events={mockEvents} />);
    
    mockEvents.forEach((_, index) => {
      expect(screen.getByTestId(`timeline-event-${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`timeline-marker-${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`timeline-content-${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`timeline-title-${index}`)).toBeInTheDocument();
    });
  });

  it('renders complex event with all features', () => {
    const complexEvent: TimelineEvent[] = [
      {
        id: '1',
        title: 'Complex Event',
        description: 'This is a complex event',
        timestamp: '2024-01-01T10:00:00Z',
        type: 'success',
        icon: <span data-testid="event-icon">✓</span>,
        content: <div data-testid="event-content">Additional content</div>,
      },
    ];

    render(<Timeline events={complexEvent} />);
    expect(screen.getByText('Complex Event')).toBeInTheDocument();
    expect(screen.getByText('This is a complex event')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-timestamp-0')).toBeInTheDocument();
    expect(screen.getByTestId('event-icon')).toBeInTheDocument();
    expect(screen.getByTestId('event-content')).toBeInTheDocument();
  });
});
