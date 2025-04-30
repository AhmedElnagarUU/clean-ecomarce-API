import mongoose, { Document } from 'mongoose';

export type NotificationType = 'order_placed' | 'order_status_changed' | 'shipping_status_changed';

export interface NotificationDocument extends Document {
  type: NotificationType;
  title: string;
  message: string;
  data: {
    orderId?: string;
    orderNumber?: string;
    oldStatus?: string;
    newStatus?: string;
    customerName?: string;
    customerEmail?: string;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order_placed', 'order_status_changed', 'shipping_status_changed'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    orderId: String,
    orderNumber: String,
    oldStatus: String,
    newStatus: String,
    customerName: String,
    customerEmail: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema); 