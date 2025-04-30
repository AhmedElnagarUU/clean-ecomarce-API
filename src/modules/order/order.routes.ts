import { Router } from 'express';
import { OrderController } from './order.controller';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin privileges
router.use(isAuthenticated, isAdmin);

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.put('/:id/status', OrderController.updateOrderStatus);

export default router; 