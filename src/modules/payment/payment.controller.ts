import { Request, Response } from 'express';
import { IPaymentService, PaymentDetails, PaymentResult } from './payment.types';
import logger from '../../config/logger';

export class PaymentController {
  constructor(private paymentService: IPaymentService) {}

  public initializePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentDetails: PaymentDetails = {
        amount: req.body.amount,
        currency: req.body.currency,
        description: req.body.description,
        metadata: req.body.metadata
      };

      const result = await this.paymentService.initializePayment(paymentDetails);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Payment initialization error:', error);
      res.status(500).json({ 
        error: 'Failed to initialize payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  public verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const result = await this.paymentService.verifyPayment(paymentId);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Payment verification error:', error);
      res.status(500).json({ 
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  public refundPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;
      const result = await this.paymentService.refundPayment(paymentId, amount);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Payment refund error:', error);
      res.status(500).json({ 
        error: 'Failed to process refund',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 