import { IDashboardRepository } from '../domain/dashboard.repository.interface';
import { DashboardStats, SalesAnalytics, TopProduct, RecentOrder } from '../domain/entities/dashboard.entity';
import { ApiError } from '../../../utils/ApiError';

export class DashboardUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async getStats(): Promise<DashboardStats> {
    try {
      return await this.dashboardRepository.getStats();
    } catch (error) {
      throw new ApiError(500, 'Error fetching dashboard statistics');
    }
  }

  async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      return await this.dashboardRepository.getRecentOrders();
    } catch (error) {
      throw new ApiError(500, 'Error fetching recent orders');
    }
  }

  async getTopProducts(): Promise<TopProduct[]> {
    try {
      return await this.dashboardRepository.getTopProducts();
    } catch (error) {
      throw new ApiError(500, 'Error fetching top products');
    }
  }

  async getSalesAnalytics(startDate: string, endDate: string): Promise<SalesAnalytics[]> {
    try {
      return await this.dashboardRepository.getSalesAnalytics(startDate, endDate);
    } catch (error) {
      throw new ApiError(500, 'Error fetching sales analytics');
    }
  }
} 