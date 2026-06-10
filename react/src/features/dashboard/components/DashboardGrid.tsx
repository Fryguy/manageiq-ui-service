/**
 * Dashboard grid layout component
 */

import React from 'react';
import { Grid, Column } from '@carbon/react';
import './DashboardGrid.scss';

interface DashboardGridProps {
  children: React.ReactNode;
}

/**
 * DashboardGrid provides a responsive grid layout for dashboard widgets
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return (
    <Grid className="dashboard-grid" fullWidth>
      <Column lg={16} md={8} sm={4}>
        <div className="dashboard-grid__content">{children}</div>
      </Column>
    </Grid>
  );
};

interface DashboardRowProps {
  children: React.ReactNode;
}

/**
 * DashboardRow provides a row container for dashboard widgets
 */
export const DashboardRow: React.FC<DashboardRowProps> = ({ children }) => {
  return <div className="dashboard-grid__row">{children}</div>;
};

interface DashboardWidgetProps {
  children: React.ReactNode;
  span?: 'full' | 'half' | 'third' | 'quarter';
}

/**
 * DashboardWidget provides a container for individual dashboard widgets
 */
export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  children,
  span = 'half',
}) => {
  const spanClass = `dashboard-grid__widget--${span}`;

  return (
    <div className={`dashboard-grid__widget ${spanClass}`}>{children}</div>
  );
};
