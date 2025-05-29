import { INotificationRepository } from '../domain/notification.repository.interface';
import { Notification, NotificationStatus, NotificationType } from '../domain/entities/notification.entity';
import { CreateNotificationDto } from './DTO/create-notification.dto';
import { UpdateNotificationDto } from './DTO/update-notification.dto';

export class NotificationUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification: Partial<Notification> = {
      ...dto,
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.notificationRepository.create(notification as Notification);
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return this.notificationRepository.findById(id);
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async getNotificationsByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationRepository.findByType(type);
  }

  async getNotificationsByStatus(status: NotificationStatus): Promise<Notification[]> {
    return this.notificationRepository.findByStatus(status);
  }

  async updateNotification(id: string, dto: UpdateNotificationDto): Promise<Notification | null> {
    const existingNotification = await this.notificationRepository.findById(id);
    if (!existingNotification) {
      return null;
    }

    const updateData: Partial<Notification> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.notificationRepository.update(id, updateData);
  }

  async updateNotificationStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
    return this.notificationRepository.updateStatus(id, status);
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notificationRepository.delete(id);
  }

  async deleteAllNotificationsByUserId(userId: string): Promise<boolean> {
    return this.notificationRepository.deleteAllByUserId(userId);
  }

  async createOrderStatusNotification(userId: string, orderId: string, status: string): Promise<Notification> {
    const dto: CreateNotificationDto = {
      userId,
      type: 'order_status',
      title: 'Order Status Update',
      message: `Your order #${orderId} has been ${status}`,
      priority: 'medium',
      data: { orderId, status },
    };

    return this.createNotification(dto);
  }

  async createPaymentStatusNotification(userId: string, orderId: string, status: string): Promise<Notification> {
    const dto: CreateNotificationDto = {
      userId,
      type: 'payment_status',
      title: 'Payment Status Update',
      message: `Payment for order #${orderId} has been ${status}`,
      priority: 'high',
      data: { orderId, status },
    };

    return this.createNotification(dto);
  }

  async createShippingUpdateNotification(userId: string, orderId: string, trackingNumber: string): Promise<Notification> {
    const dto: CreateNotificationDto = {
      userId,
      type: 'shipping_update',
      title: 'Shipping Update',
      message: `Your order #${orderId} has been shipped. Tracking number: ${trackingNumber}`,
      priority: 'medium',
      data: { orderId, trackingNumber },
    };

    return this.createNotification(dto);
  }
} 