import { Request, Response } from 'express';
import { PaymentUseCase } from '../application/payment.usecase';
import { CreatePaymentDto } from '../application/DTO/create-payment.dto';
import { UpdatePaymentDto } from '../application/DTO/update-payment.dto';

export class PaymentController {
  constructor(private readonly paymentUseCase: PaymentUseCase) {}

  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const createPaymentDto: CreatePaymentDto = req.body;
      const payment = await this.paymentUseCase.createPayment(createPaymentDto);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentUseCase.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const payment = await this.paymentUseCase.getPaymentByOrderId(orderId);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const payments = await this.paymentUseCase.getPaymentsByUserId(userId);
      res.json(payments);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatePaymentDto: UpdatePaymentDto = req.body;
      const payment = await this.paymentUseCase.updatePayment(id, updatePaymentDto);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentUseCase.processPayment(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentUseCase.refundPayment(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.paymentUseCase.deletePayment(id);
      if (!success) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
} 