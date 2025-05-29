import { NotificationPriority, NotificationType } from '../../domain/entities/notification.entity';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data?: Record<string, any>;
} 