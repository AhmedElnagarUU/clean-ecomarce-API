import express from 'express';
import adminRoutes from '../../modules/admin/infra/admin.routes';
import dashboardRoutes from '../../modules/dashboard/infra/dashboard.routes';
import productRoutes from '../../modules/product/infra/product.routes';
import orderRoutes from '../../modules/order/infra/order.routes';
import categoryRoutes from '../../modules/category/infra/category.routes';
import cleanupRoutes from '../../modules/cleanup/infra/cleanup.routes';

const router = express.Router();

// Auth routes
// router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Cleanup routes
router.use('/cleanup', cleanupRoutes);

export default router; 