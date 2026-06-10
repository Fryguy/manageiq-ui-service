import React from 'react';
import classNames from 'classnames';
import './Timeline.scss';

export interface TimelineEvent {
  /** Unique identifier for the event */
  id: string;
  /** Event title */
  title: string;
  /** Event description */
  description?: string;
  /** Event timestamp */
  timestamp: string;
  /** Event type for styling */
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  /** Icon to display */
  icon?: React.ReactNode;
  /** Additional content */
  content?: React.ReactNode;
}

export interface TimelineProps {
  /** Array of timeline events */
  events: TimelineEvent[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to show timestamps */
  showTimestamps?: boolean;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Timeline component for displaying chronological events.
 * Useful for order history, service lifecycle, audit logs, etc.
 */
export const Timeline: React.FC<TimelineProps> = ({
  events,
  className,
  showTimestamps = true,
  testId = 'timeline',
}) => {
  const timelineClasses = classNames('miq-timeline', className);

  if (events.length === 0) {
    return (
      <div className="miq-timeline__empty" data-testid={`${testId}-empty`}>
        No events to display
      </div>
    );
  }

  return (
    <div className={timelineClasses} data-testid={testId}>
      {events.map((event, index) => {
        const eventClasses = classNames(
          'miq-timeline__event',
          {
            [`miq-timeline__event--${event.type}`]: event.type,
          }
        );

        return (
          <div
            key={event.id}
            className={eventClasses}
            data-testid={`${testId}-event-${index}`}
          >
            <div className="miq-timeline__marker" data-testid={`${testId}-marker-${index}`}>
              {event.icon && (
                <div className="miq-timeline__icon" data-testid={`${testId}-icon-${index}`}>
                  {event.icon}
                </div>
              )}
            </div>
            <div className="miq-timeline__content" data-testid={`${testId}-content-${index}`}>
              <div className="miq-timeline__header">
                <h4 className="miq-timeline__title" data-testid={`${testId}-title-${index}`}>
                  {event.title}
                </h4>
                {showTimestamps && (
                  <time
                    className="miq-timeline__timestamp"
                    dateTime={event.timestamp}
                    data-testid={`${testId}-timestamp-${index}`}
                  >
                    {event.timestamp}
                  </time>
                )}
              </div>
              {event.description && (
                <p
                  className="miq-timeline__description"
                  data-testid={`${testId}-description-${index}`}
                >
                  {event.description}
                </p>
              )}
              {event.content && (
                <div
                  className="miq-timeline__extra"
                  data-testid={`${testId}-extra-${index}`}
                >
                  {event.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
