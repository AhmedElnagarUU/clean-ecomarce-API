import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderUseCase } from '../application/order.usecase';
import { OrderMongoRepository } from './order.mongo.repo';
import { isAuthenticated } from '../../../middleware/auth.middleware';
import { isAdmin } from '../../../middleware/auth.middleware';

const router = Router();

const orderRepository = new OrderMongoRepository();
const orderUseCase = new OrderUseCase(orderRepository);
const orderController = new OrderController(orderUseCase);

// Public routes
router.use(isAuthenticated);

// User routes
router.post('/', (req, res) => orderController.createOrder(req, res));
router.get('/user/:userId', (req, res) => orderController.getOrdersByUserId(req, res));
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

// Admin routes
router.use(isAdmin);
router.get('/', (req, res) => orderController.getAllOrders(req, res));
router.get('/status/:status', (req, res) => orderController.getOrdersByStatus(req, res));
router.get('/date-range', (req, res) => orderController.getOrdersByDateRange(req, res));
router.put('/:id', (req, res) => orderController.updateOrder(req, res));
router.delete('/:id', (req, res) => orderController.deleteOrder(req, res));
router.patch('/:id/status', (req, res) => orderController.updateOrderStatus(req, res));
router.patch('/:id/payment-status', (req, res) => orderController.updatePaymentStatus(req, res));

export default router; 