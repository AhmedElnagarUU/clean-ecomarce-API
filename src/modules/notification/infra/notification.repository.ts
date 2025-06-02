import { INotificationRepository } from '../domain/notification.repository.interface';
import { Notification, NotificationStatus, NotificationType } from '../domain/entities/notification.entity';
import { NotificationModel, NotificationDocument } from './notification.model';
import mongoose from 'mongoose';

export class NotificationRepository implements INotificationRepository {
  private mapToDomain(notificationDoc: NotificationDocument): Notification {
    return {
      id: (notificationDoc._id as mongoose.Types.ObjectId).toString(),
      userId: (notificationDoc.userId as mongoose.Types.ObjectId).toString(),
      type: notificationDoc.type,
      title: notificationDoc.title,
      message: notificationDoc.message,
      priority: notificationDoc.priority,
      status: notificationDoc.status,
      data: notificationDoc.data,
      readAt: notificationDoc.readAt,
      createdAt: notificationDoc.createdAt,
      updatedAt: notificationDoc.updatedAt
    };
  }

  async create(notification: Notification): Promise<Notification> {
    const newNotification = await NotificationModel.create(notification);
    return this.mapToDomain(newNotification);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await NotificationModel.findById(id);
    return notification ? this.mapToDomain(notification) : null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 });
    return notifications.map(this.mapToDomain);
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ type })
      .sort({ createdAt: -1 });
    return notifications.map(this.mapToDomain);
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ status })
      .sort({ createdAt: -1 });
    return notifications.map(this.mapToDomain);
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { $set: { ...data, updatedAt: new Date() } },
      { new: true }
    );
    return updatedNotification ? this.mapToDomain(updatedNotification) : null;
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status,
          updatedAt: new Date(),
          ...(status === 'read' ? { readAt: new Date() } : {})
        } 
      },
      { new: true }
    );
    return updatedNotification ? this.mapToDomain(updatedNotification) : null;
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: 'read',
          readAt: new Date(),
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    return updatedNotification ? this.mapToDomain(updatedNotification) : null;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await NotificationModel.updateMany(
        { userId, status: 'unread' },
        { 
          $set: { 
            status: 'read',
            readAt: new Date(),
            updatedAt: new Date()
          } 
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await NotificationModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteAllByUserId(userId: string): Promise<boolean> {
    try {
      await NotificationModel.deleteMany({ userId });
      return true;
    } catch (error) {
      return false;
    }
  }
} 