import { Order } from './entities/order.entity';

export interface IOrderRepository {
  findByDateRange(startDate: Date, endDate: Date): Order[] | PromiseLike<Order[]>;
  findByStatus(status: string): Order[] | PromiseLike<Order[]>;
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  update(id: string, order: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  updateStatus(id: string, status: Order['status']): Promise<Order | null>;
  updatePaymentStatus(id: string, status: Order['paymentStatus']): Promise<Order | null>;
} 