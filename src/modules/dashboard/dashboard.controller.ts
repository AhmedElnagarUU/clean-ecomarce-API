import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    console.log("getStats")
    try {
      const stats = await DashboardService.getStats();
      return res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRecentOrders(req: Request, res: Response) {
    try {
      const orders = await DashboardService.getRecentOrders();
      return res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTopProducts(req: Request, res: Response) {
    try {
      const products = await DashboardService.getTopProducts();
      return res.json({
        success: true,
        data: products
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getSalesAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await DashboardService.getSalesAnalytics(
        startDate as string,
        endDate as string
      );
      return res.json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
} 