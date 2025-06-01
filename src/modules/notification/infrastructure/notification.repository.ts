import { INotificationRepository } from '../domain/notification.repository.interface';
import { Notification, NotificationStatus, NotificationType } from '../domain/entities/notification.entity';
import { PrismaClient } from '@prisma/client';

export class NotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(notification: Notification): Promise<Notification> {
    return this.prisma.notification.create({
      data: notification,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
    return this.prisma.notification.update({
      where: { id },
      data: { status },
    });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          userId,
          status: 'unread',
        },
        data: {
          status: 'read',
          readAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteAllByUserId(userId: string): Promise<boolean> {
    try {
      await this.prisma.notification.deleteMany({
        where: { userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 