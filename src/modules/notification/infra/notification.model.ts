import mongoose, { Schema, Document } from 'mongoose';
import { Notification, NotificationStatus, NotificationType, NotificationPriority } from '../domain/entities/notification.entity';

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
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

const notificationSchema = new Schema<NotificationDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true, default: 'unread' },
  data: { type: Schema.Types.Mixed },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', notificationSchema); 