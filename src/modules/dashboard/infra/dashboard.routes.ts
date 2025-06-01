import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { DashboardUseCase } from '../application/dashboard.usecase';
import { isAuthenticated, isAdmin } from '../../../middleware/auth.middleware';

const router = Router();
const dashboardRepository = new DashboardRepository();
const dashboardUseCase = new DashboardUseCase(dashboardRepository);
const dashboardController = new DashboardController(dashboardUseCase);

// All routes are protected and require admin access
router.use(isAuthenticated);
router.use(isAdmin);

// Get dashboard statistics
router.get('/stats', dashboardController.getStats);

// Get recent orders
router.get('/recent-orders', dashboardController.getRecentOrders);

// Get top selling products
router.get('/top-products', dashboardController.getTopProducts);

// Get sales analytics
router.get('/sales-analytics', dashboardController.getSalesAnalytics);

export default router; 