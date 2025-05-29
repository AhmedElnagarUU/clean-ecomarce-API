import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/entities/order.entity';
import { OrderModel } from './order.model';

export class OrderMongoRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const newOrder = await OrderModel.create(order);
    return newOrder.toObject();
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id);
    return order ? order.toObject() : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ userId });
    return orders.map(order => order.toObject());
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.find();
    return orders.map(order => order.toObject());
  }

  async update(id: string, order: Partial<Order>): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: order },
      { new: true }
    );
    return updatedOrder ? updatedOrder.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    );
    return updatedOrder ? updatedOrder.toObject() : null;
  }

  async updatePaymentStatus(id: string, status: Order['paymentStatus']): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: { paymentStatus: status, updatedAt: new Date() } },
      { new: true }
    );
    return updatedOrder ? updatedOrder.toObject() : null;
  }
} 