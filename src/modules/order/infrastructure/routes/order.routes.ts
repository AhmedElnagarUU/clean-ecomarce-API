import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { OrderUseCase } from '../../application/order.usecase';
import { OrderRepository } from '../repositories/order.repository';

const router = Router();
const orderRepository = new OrderRepository();
const orderUseCase = new OrderUseCase(orderRepository);
const orderController = new OrderController(orderUseCase);

// Create a new order
router.post('/', (req, res) => orderController.createOrder(req, res));

// Get order by ID
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

// Get orders by user ID
router.get('/user/:userId', (req, res) => orderController.getOrdersByUserId(req, res));

// Update order
router.put('/:id', (req, res) => orderController.updateOrder(req, res));

// Get orders by status
router.get('/status/:status', (req, res) => orderController.getOrdersByStatus(req, res));

// Get orders by date range
router.get('/date-range', (req, res) => orderController.getOrdersByDateRange(req, res));

// Delete order
router.delete('/:id', (req, res) => orderController.deleteOrder(req, res));

export default router; 