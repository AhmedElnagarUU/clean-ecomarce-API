import { NotificationStatus } from '../../domain/entities/notification.entity';

export interface UpdateNotificationDto {
  status?: NotificationStatus;
  title?: string;
  message?: string;
  data?: Record<string, any>;
} 