import { Router } from 'express';
import * as DashboardController from './dashboard.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

// All routes are protected and require admin access
router.use(isAuthenticated);

// Get dashboard statistics
router.get('/stats', DashboardController.getStats);

// Get recent orders
router.get('/recent-orders', DashboardController.getRecentOrders);

// Get top selling products
router.get('/top-products', DashboardController.getTopProducts);

// Get sales analytics
router.get('/sales-analytics', DashboardController.getSalesAnalytics);

export default router; 