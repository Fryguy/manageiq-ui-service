/**
 * Dashboard page component
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDashboardData } from '../store/dashboardSlice';
import { DashboardGrid, DashboardRow, DashboardWidget } from '../components/DashboardGrid';
import { ServiceSummaryCard } from '../components/ServiceSummaryCard';
import { RecentServicesWidget } from '../components/RecentServicesWidget';
import { RecentOrdersWidget } from '../components/RecentOrdersWidget';
import { QuickActionsWidget } from '../components/QuickActionsWidget';
import { ErrorState } from '../../../components/common/ErrorState';
import { __ } from '../../../i18n';
import './DashboardPage.scss';

/**
 * DashboardPage displays the main dashboard with service summary,
 * recent services, recent orders, and quick actions
 */
export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    serviceSummary,
    recentServices,
    recentOrders,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page__header">
          <h1 className="dashboard-page__title">{__('Dashboard')}</h1>
        </div>
        <ErrorState
          title={__('Failed to load dashboard')}
          message={error}
          actionText={__('Retry')}
          onAction={() => dispatch(fetchDashboardData())}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{__('Dashboard')}</h1>
      </div>
      <DashboardGrid>
        <DashboardRow>
          <DashboardWidget span="third">
            <ServiceSummaryCard summary={serviceSummary} loading={loading} />
          </DashboardWidget>
          <DashboardWidget span="third">
            <QuickActionsWidget />
          </DashboardWidget>
        </DashboardRow>
        <DashboardRow>
          <DashboardWidget span="half">
            <RecentServicesWidget services={recentServices} loading={loading} />
          </DashboardWidget>
          <DashboardWidget span="half">
            <RecentOrdersWidget orders={recentOrders} loading={loading} />
          </DashboardWidget>
        </DashboardRow>
      </DashboardGrid>
    </div>
  );
};
