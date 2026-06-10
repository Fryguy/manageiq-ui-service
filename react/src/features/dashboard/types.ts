/**
 * Dashboard feature type definitions
 */

export interface ServiceSummary {
  total: number;
  running: number;
  stopped: number;
  suspended: number;
  retired: number;
}

export interface RecentService {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  power_state: 'on' | 'off' | 'suspended' | 'unknown';
}

export interface RecentOrder {
  id: string;
  description: string;
  state: string;
  created_on: string;
  updated_on: string;
  approval_state?: string;
  type?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: string;
  permissions?: string[];
}

export interface DashboardData {
  serviceSummary: ServiceSummary | null;
  recentServices: RecentService[];
  recentOrders: RecentOrder[];
  loading: boolean;
  error: string | null;
}

export interface DashboardState extends DashboardData {
  lastUpdated: string | null;
}
