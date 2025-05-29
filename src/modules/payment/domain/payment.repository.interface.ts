import { Payment } from './entities/payment.entity';

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  update(id: string, payment: Partial<Payment>): Promise<Payment | null>;
  updateStatus(id: string, status: Payment['status']): Promise<Payment | null>;
  delete(id: string): Promise<boolean>;
} 