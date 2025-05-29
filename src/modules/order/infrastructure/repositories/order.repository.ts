import { IOrderRepository } from '../../domain/order.repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { PrismaClient } from '@prisma/client';

export class OrderRepository implements IOrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(order: Order): Promise<Order> {
    return this.prisma.order.create({
      data: order,
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
} 