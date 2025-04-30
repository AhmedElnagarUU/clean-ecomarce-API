import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { IPaymentService } from './payment.types';

export const createPaymentRoutes = (paymentService: IPaymentService): Router => {
  const router = Router();
  const paymentController = new PaymentController(paymentService);

  // Initialize a new payment
  router.post('/initialize', paymentController.initializePayment);

  // Verify a payment status
  router.get('/verify/:paymentId', paymentController.verifyPayment);

  // Process a refund
  router.post('/refund/:paymentId', paymentController.refundPayment);

  return router;
}; 