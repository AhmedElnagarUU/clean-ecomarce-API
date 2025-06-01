import { DashboardStats, SalesAnalytics, TopProduct, RecentOrder } from './entities/dashboard.entity';

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
  getRecentOrders(): Promise<RecentOrder[]>;
  getTopProducts(): Promise<TopProduct[]>;
  getSalesAnalytics(startDate: string, endDate: string): Promise<SalesAnalytics[]>;
} 