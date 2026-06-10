/**
 * Recent orders widget component
 */

import React from 'react';
import { Tile, SkeletonText, Tag } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import type { RecentOrder } from '../types';
import { __ } from '../../../i18n';
import { formatDistanceToNow } from '../../../utils/dateFormatting';
import './RecentOrdersWidget.scss';

interface RecentOrdersWidgetProps {
  orders: RecentOrder[];
  loading?: boolean;
}

interface OrderItemProps {
  order: RecentOrder;
  onClick: () => void;
}

const getStateColor = (state: string): 'green' | 'red' | 'gray' | 'blue' => {
  const lowerState = state.toLowerCase();
  if (lowerState.includes('finished') || lowerState.includes('approved')) {
    return 'green';
  }
  if (lowerState.includes('failed') || lowerState.includes('denied')) {
    return 'red';
  }
  if (lowerState.includes('pending') || lowerState.includes('queued')) {
    return 'blue';
  }
  return 'gray';
};

const OrderItem: React.FC<OrderItemProps> = ({ order, onClick }) => {
  return (
    <div
      className="recent-orders-widget__item"
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
      <div className="recent-orders-widget__item-content">
        <div className="recent-orders-widget__item-header">
          <h4 className="recent-orders-widget__item-description">
            {order.description}
          </h4>
          <Tag type={getStateColor(order.state)} size="sm">
            {order.state}
          </Tag>
        </div>
        {order.type && (
          <p className="recent-orders-widget__item-type">
            {__('Type')}: {order.type}
          </p>
        )}
        {order.approval_state && (
          <p className="recent-orders-widget__item-approval">
            {__('Approval')}: {order.approval_state}
          </p>
        )}
        <p className="recent-orders-widget__item-time">
          {__('Created')} {formatDistanceToNow(order.created_on)}
        </p>
      </div>
      <div className="recent-orders-widget__item-arrow">
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

/**
 * RecentOrdersWidget displays a list of recently created orders
 */
export const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({
  orders,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleViewAllClick = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <Tile className="recent-orders-widget recent-orders-widget--loading">
        <div className="recent-orders-widget__header">
          <h3 className="recent-orders-widget__title">
            {__('Recent Orders')}
          </h3>
        </div>
        <div className="recent-orders-widget__content">
          <SkeletonText paragraph lineCount={5} />
        </div>
      </Tile>
    );
  }

  if (orders.length === 0) {
    return (
      <Tile className="recent-orders-widget">
        <div className="recent-orders-widget__header">
          <h3 className="recent-orders-widget__title">
            {__('Recent Orders')}
          </h3>
        </div>
        <div className="recent-orders-widget__content">
          <div className="recent-orders-widget__empty">
            <p>{__('No orders found')}</p>
          </div>
        </div>
      </Tile>
    );
  }

  return (
    <Tile className="recent-orders-widget">
      <div className="recent-orders-widget__header">
        <h3 className="recent-orders-widget__title">
          {__('Recent Orders')}
        </h3>
        <button
          className="recent-orders-widget__view-all"
          onClick={handleViewAllClick}
          type="button"
        >
          {__('View All')}
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="recent-orders-widget__content">
        <div className="recent-orders-widget__list">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onClick={() => handleOrderClick(order.id)}
            />
          ))}
        </div>
      </div>
    </Tile>
  );
};
