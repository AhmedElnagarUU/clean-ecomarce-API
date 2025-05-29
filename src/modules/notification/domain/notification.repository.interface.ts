import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  findByType(type: NotificationType): Promise<Notification[]>;
  findByStatus(status: NotificationStatus): Promise<Notification[]>;
  update(id: string, notification: Partial<Notification>): Promise<Notification | null>;
  updateStatus(id: string, status: NotificationStatus): Promise<Notification | null>;
  markAsRead(id: string): Promise<Notification | null>;
  markAllAsRead(userId: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  deleteAllByUserId(userId: string): Promise<boolean>;
} 