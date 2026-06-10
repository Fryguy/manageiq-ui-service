/**
 * Quick actions widget component with RBAC
 */

import React from 'react';
import { Tile, Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Catalog,
  Application,
  RequestQuote,
} from '@carbon/icons-react';
import { usePermissions } from '../../auth/hooks/usePermissions';
import type { QuickAction } from '../types';
import { __ } from '../../../i18n';
import './QuickActionsWidget.scss';

interface QuickActionsWidgetProps {
  className?: string;
}

/**
 * QuickActionsWidget displays quick action buttons with RBAC filtering
 */
export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const { has, hasAny } = usePermissions();

  // Define available quick actions with permissions
  const allActions: QuickAction[] = [
    {
      id: 'browse-catalog',
      label: __('Browse Catalog'),
      icon: 'Catalog',
      path: '/catalogs',
      permission: 'svc_catalog_provision',
    },
    {
      id: 'view-services',
      label: __('View Services'),
      icon: 'Application',
      path: '/services',
      permissions: ['service', 'service_view'],
    },
    {
      id: 'view-orders',
      label: __('View Orders'),
      icon: 'RequestQuote',
      path: '/orders',
      permissions: ['miq_request_show_list', 'miq_request_show'],
    },
    {
      id: 'shopping-cart',
      label: __('Shopping Cart'),
      icon: 'ShoppingCart',
      path: '/cart',
      permission: 'svc_catalog_provision',
    },
  ];

  // Filter actions based on permissions
  const visibleActions = allActions.filter((action) => {
    if (action.permission) {
      return has(action.permission);
    }
    if (action.permissions) {
      return hasAny(action.permissions);
    }
    return true;
  });

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Catalog':
        return <Catalog size={24} />;
      case 'Application':
        return <Application size={24} />;
      case 'RequestQuote':
        return <RequestQuote size={24} />;
      case 'ShoppingCart':
        return <ShoppingCart size={24} />;
      default:
        return null;
    }
  };

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Tile className={`quick-actions-widget ${className}`}>
      <h3 className="quick-actions-widget__title">
        {__('Quick Actions')}
      </h3>
      <div className="quick-actions-widget__content">
        <div className="quick-actions-widget__grid">
          {visibleActions.map((action) => (
            <Button
              key={action.id}
              kind="tertiary"
              size="lg"
              className="quick-actions-widget__button"
              onClick={() => handleActionClick(action.path)}
              renderIcon={() => getIcon(action.icon)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Tile>
  );
};
