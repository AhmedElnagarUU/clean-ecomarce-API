import { Request, Response } from 'express';
import { DashboardUseCase } from '../application/dashboard.usecase';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/ApiResponse';

export class DashboardController {
  constructor(private readonly dashboardUseCase: DashboardUseCase) {}

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.dashboardUseCase.getStats();
    return res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats retrieved successfully'));
  });

  getRecentOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await this.dashboardUseCase.getRecentOrders();
    return res.status(200).json(new ApiResponse(200, orders, 'Recent orders retrieved successfully'));
  });

  getTopProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await this.dashboardUseCase.getTopProducts();
    return res.status(200).json(new ApiResponse(200, products, 'Top products retrieved successfully'));
  });

  getSalesAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const analytics = await this.dashboardUseCase.getSalesAnalytics(
      startDate as string,
      endDate as string
    );
    return res.status(200).json(new ApiResponse(200, analytics, 'Sales analytics retrieved successfully'));
  });
} 