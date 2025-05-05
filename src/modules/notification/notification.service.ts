import { Notification, NotificationDocument, NotificationType } from './notification.model';
import { OrderDocument } from '../order/order.model';

export class NotificationService {
  /**
   * Create a notification for a new order
   */
  static async createOrderPlacedNotification(order: OrderDocument & {customer: {name: string, email: string}}): Promise<NotificationDocument> {
    return Notification.create({
      type: 'order_placed',
      title: 'New Order Placed',
      message: `A new order #${order.orderNumber} has been placed by ${order.customer.name}`,
      data: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email
      }
    });
  }

  /**
   * Create a notification for order status change
   */
  static async createOrderStatusChangeNotification(
    order: OrderDocument & {customer: {name: string, email: string}},
    oldStatus: string,
    newStatus: string
  ): Promise<NotificationDocument> {
    return Notification.create({
      type: 'order_status_changed',
      title: 'Order Status Updated',
      message: `Order #${order.orderNumber} status changed from ${oldStatus} to ${newStatus}`,
      data: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus,
        customerName: order.customer.name
      }
    });
  }

  /**
   * Create a notification for shipping status change
   */
  static async createShippingStatusChangeNotification(
    order: OrderDocument & {customer: {name: string, email: string}},
    oldStatus: string,
    newStatus: string
  ): Promise<NotificationDocument> {
    return Notification.create({
      type: 'shipping_status_changed',
      title: 'Shipping Status Updated',
      message: `Shipping status for order #${order.orderNumber} changed from ${oldStatus} to ${newStatus}`,
      data: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus,
        customerName: order.customer.name
      }
    });
  }

  /**
   * Get all notifications
   */
  static async getNotifications(limit: number = 50): Promise<NotificationDocument[]> {
    return Notification.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
    return Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    await Notification.updateMany(
      { read: false },
      { read: true }
    );
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<number> {
    return Notification.countDocuments({ read: false });
  }
} 