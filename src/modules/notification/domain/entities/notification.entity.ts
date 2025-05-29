export type NotificationType = 'order_status' | 'payment_status' | 'shipping_update' | 'system' | 'promotion';
export type NotificationPriority = 'low' | 'medium' | 'high';
export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 