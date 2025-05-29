import { IPaymentRepository } from '../../domain/payment.repository.interface';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { PrismaClient } from '@prisma/client';

export class PaymentRepository implements IPaymentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(payment: Payment): Promise<Payment> {
    return this.prisma.payment.create({
      data: payment,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { orderId },
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
    });
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment | null> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    return this.prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.payment.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 