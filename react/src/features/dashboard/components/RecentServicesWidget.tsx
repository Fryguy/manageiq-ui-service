/**
 * Recent services widget component
 */

import React from 'react';
import { Tile, SkeletonText, Tag } from '@carbon/react';
import { ArrowRight, Checkmark, StopOutline, Pause, Unknown } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import type { RecentService } from '../types';
import { __ } from '../../../i18n';
import { formatDistanceToNow } from '../../../utils/dateFormatting';
import './RecentServicesWidget.scss';

interface RecentServicesWidgetProps {
  services: RecentService[];
  loading?: boolean;
}

interface ServiceItemProps {
  service: RecentService;
  onClick: () => void;
}

const getPowerStateIcon = (powerState: string) => {
  switch (powerState) {
    case 'on':
      return Checkmark;
    case 'off':
      return StopOutline;
    case 'suspended':
      return Pause;
    default:
      return Unknown;
  }
};

const getPowerStateColor = (powerState: string): 'green' | 'red' | 'gray' | 'blue' => {
  switch (powerState) {
    case 'on':
      return 'green';
    case 'off':
      return 'red';
    case 'suspended':
      return 'gray';
    default:
      return 'blue';
  }
};

const ServiceItem: React.FC<ServiceItemProps> = ({ service, onClick }) => {
  return (
    <div
      className="recent-services-widget__item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="recent-services-widget__item-content">
        <div className="recent-services-widget__item-header">
          <h4 className="recent-services-widget__item-name">{service.name}</h4>
          <Tag
            type={getPowerStateColor(service.power_state)}
            size="sm"
            renderIcon={getPowerStateIcon(service.power_state)}
          >
            {service.power_state}
          </Tag>
        </div>
        {service.description && (
          <p className="recent-services-widget__item-description">
            {service.description}
          </p>
        )}
        <p className="recent-services-widget__item-time">
          {__('Created')} {formatDistanceToNow(service.created_at)}
        </p>
      </div>
      <div className="recent-services-widget__item-arrow">
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

/**
 * RecentServicesWidget displays a list of recently created services
 */
export const RecentServicesWidget: React.FC<RecentServicesWidgetProps> = ({
  services,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleViewAllClick = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <Tile className="recent-services-widget recent-services-widget--loading">
        <div className="recent-services-widget__header">
          <h3 className="recent-services-widget__title">
            {__('Recent Services')}
          </h3>
        </div>
        <div className="recent-services-widget__content">
          <SkeletonText paragraph lineCount={5} />
        </div>
      </Tile>
    );
  }

  if (services.length === 0) {
    return (
      <Tile className="recent-services-widget">
        <div className="recent-services-widget__header">
          <h3 className="recent-services-widget__title">
            {__('Recent Services')}
          </h3>
        </div>
        <div className="recent-services-widget__content">
          <div className="recent-services-widget__empty">
            <p>{__('No services found')}</p>
          </div>
        </div>
      </Tile>
    );
  }

  return (
    <Tile className="recent-services-widget">
      <div className="recent-services-widget__header">
        <h3 className="recent-services-widget__title">
          {__('Recent Services')}
        </h3>
        <button
          className="recent-services-widget__view-all"
          onClick={handleViewAllClick}
          type="button"
        >
          {__('View All')}
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="recent-services-widget__content">
        <div className="recent-services-widget__list">
          {services.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              onClick={() => handleServiceClick(service.id)}
            />
          ))}
        </div>
      </div>
    </Tile>
  );
};
