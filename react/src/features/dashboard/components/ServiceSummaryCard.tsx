/**
 * Service summary card component
 */

import React from 'react';
import { Tile, SkeletonText } from '@carbon/react';
import {
  Checkmark,
  StopOutline,
  Pause,
  Archive,
} from '@carbon/icons-react';
import type { ServiceSummary } from '../types';
import { __ } from '../../../i18n';
import './ServiceSummaryCard.scss';

interface ServiceSummaryCardProps {
  summary: ServiceSummary | null;
  loading?: boolean;
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  label,
  count,
  color,
}) => {
  return (
    <div className="service-summary-card__item">
      <div className={`service-summary-card__icon service-summary-card__icon--${color}`}>
        {icon}
      </div>
      <div className="service-summary-card__details">
        <div className="service-summary-card__count">{count}</div>
        <div className="service-summary-card__label">{label}</div>
      </div>
    </div>
  );
};

/**
 * ServiceSummaryCard displays a summary of service statistics
 */
export const ServiceSummaryCard: React.FC<ServiceSummaryCardProps> = ({
  summary,
  loading = false,
}) => {
  if (loading || !summary) {
    return (
      <Tile className="service-summary-card service-summary-card--loading">
        <h3 className="service-summary-card__title">
          {__('Service Summary')}
        </h3>
        <div className="service-summary-card__content">
          <SkeletonText paragraph lineCount={4} />
        </div>
      </Tile>
    );
  }

  return (
    <Tile className="service-summary-card">
      <h3 className="service-summary-card__title">
        {__('Service Summary')}
      </h3>
      <div className="service-summary-card__content">
        <div className="service-summary-card__total">
          <div className="service-summary-card__total-count">
            {summary.total}
          </div>
          <div className="service-summary-card__total-label">
            {__('Total Services')}
          </div>
        </div>
        <div className="service-summary-card__items">
          <SummaryItem
            icon={<Checkmark size={20} />}
            label={__('Running')}
            count={summary.running}
            color="success"
          />
          <SummaryItem
            icon={<StopOutline size={20} />}
            label={__('Stopped')}
            count={summary.stopped}
            color="error"
          />
          <SummaryItem
            icon={<Pause size={20} />}
            label={__('Suspended')}
            count={summary.suspended}
            color="warning"
          />
          <SummaryItem
            icon={<Archive size={20} />}
            label={__('Retired')}
            count={summary.retired}
            color="disabled"
          />
        </div>
      </div>
    </Tile>
  );
};
