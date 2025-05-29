import { IPaymentRepository } from '../domain/payment.repository.interface';
import { Payment, PaymentStatus } from '../domain/entities/payment.entity';
import { CreatePaymentDto } from './DTO/create-payment.dto';
import { UpdatePaymentDto } from './DTO/update-payment.dto';

export class PaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const payment: Partial<Payment> = {
      ...dto,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.paymentRepository.create(payment as Payment);
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }

  async updatePayment(id: string, dto: UpdatePaymentDto): Promise<Payment | null> {
    const existingPayment = await this.paymentRepository.findById(id);
    if (!existingPayment) {
      return null;
    }

    const updateData: Partial<Payment> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.paymentRepository.update(id, updateData);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    return this.paymentRepository.updateStatus(id, status);
  }

  async deletePayment(id: string): Promise<boolean> {
    return this.paymentRepository.delete(id);
  }

  async processPayment(paymentId: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return null;
    }

    try {
      // TODO: Implement actual payment processing logic here
      // This would integrate with payment gateways like Stripe, PayPal, etc.
      
      const updatedPayment = await this.paymentRepository.updateStatus(paymentId, 'completed');
      return updatedPayment;
    } catch (error) {
      await this.paymentRepository.updateStatus(paymentId, 'failed');
      throw error;
    }
  }

  async refundPayment(paymentId: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return null;
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    try {
      // TODO: Implement actual refund logic here
      // This would integrate with payment gateways like Stripe, PayPal, etc.
      
      const updatedPayment = await this.paymentRepository.updateStatus(paymentId, 'refunded');
      return updatedPayment;
    } catch (error) {
      throw error;
    }
  }
} 