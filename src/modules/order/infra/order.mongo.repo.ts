import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/entities/order.entity';
import { OrderModel, OrderDocument } from './order.model';
import mongoose from 'mongoose';

export class OrderMongoRepository implements IOrderRepository {
  private mapToDomain(orderDoc: OrderDocument): Order {
    return {
      id: orderDoc._id.toString(),
      userId: (orderDoc.customer as mongoose.Types.ObjectId).toString(),
      items: orderDoc.items.map(item => ({
        productId: (item.product as mongoose.Types.ObjectId).toString(),
        quantity: item.quantity,
        price: item.price,
        name: '',
        image: ''
      })),
      totalAmount: orderDoc.totalAmount,
      status: orderDoc.status,
      paymentStatus: orderDoc.paymentStatus,
      shippingAddress: orderDoc.shippingAddress,
      shippingMethod: 'standard',
      shippingCost: 0,
      tax: 0,
      createdAt: orderDoc.createdAt,
      updatedAt: orderDoc.updatedAt
    };
  }

  async create(order: Order): Promise<Order> {
    const newOrder = await OrderModel.create(order);
    return this.mapToDomain(newOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id);
    return order ? this.mapToDomain(order) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ customer: userId });
    return orders.map(this.mapToDomain);
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.find();
    return orders.map(this.mapToDomain);
  }

  async update(id: string, order: Partial<Order>): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: order },
      { new: true }
    );
    return updatedOrder ? this.mapToDomain(updatedOrder) : null;
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
    return updatedOrder ? this.mapToDomain(updatedOrder) : null;
  }

  async updatePaymentStatus(id: string, status: Order['paymentStatus']): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: { paymentStatus: status, updatedAt: new Date() } },
      { new: true }
    );
    return updatedOrder ? this.mapToDomain(updatedOrder) : null;
  }

  async findByStatus(status: Order['status']): Promise<Order[]> {
    const orders = await OrderModel.find({ status });
    return orders.map(this.mapToDomain);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const orders = await OrderModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    return orders.map(this.mapToDomain);
  }
}