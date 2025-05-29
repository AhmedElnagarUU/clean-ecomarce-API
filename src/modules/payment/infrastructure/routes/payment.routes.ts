import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentUseCase } from '../../application/payment.usecase';
import { PaymentRepository } from '../repositories/payment.repository';

const router = Router();
const paymentRepository = new PaymentRepository();
const paymentUseCase = new PaymentUseCase(paymentRepository);
const paymentController = new PaymentController(paymentUseCase);

// Create a new payment
router.post('/', (req, res) => paymentController.createPayment(req, res));

// Get payment by ID
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));

// Get payment by order ID
router.get('/order/:orderId', (req, res) => paymentController.getPaymentByOrderId(req, res));

// Get payments by user ID
router.get('/user/:userId', (req, res) => paymentController.getPaymentsByUserId(req, res));

// Update payment
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));

// Process payment
router.post('/:id/process', (req, res) => paymentController.processPayment(req, res));

// Refund payment
router.post('/:id/refund', (req, res) => paymentController.refundPayment(req, res));

// Delete payment
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));

export default router; 