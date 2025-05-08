import { Order, OrderDocument } from './order.model';
import { NotificationService } from '../notification/notification.service';
import { validateOrder } from './order.validation';

export class OrderService {
  static async createOrder(orderData: any): Promise<OrderDocument> {
    // Validate order data
    const validationError = validateOrder(orderData);
    if (validationError) {
      throw new Error(validationError);
    }

    const order = new Order(orderData);
    await order.save();

    // Create notification for new order
    await NotificationService.createOrderPlacedNotification(
      order as OrderDocument & {customer: {name: string, email: string}}
    );

    return order;
  }

  static async getOrders() {
    return Order.find()
      .populate('customer')
      .sort({ createdAt: -1 });
  }

  static async getOrderById(id: string) {
    return Order.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
  }

  static async updateOrderStatus(id: string, newStatus: string) {
    const order = await Order.findById(id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const oldStatus = order.status;
    order.status = newStatus;
    await order.save();

    // Create notification for status change
    await NotificationService.createOrderStatusChangeNotification(
      order as OrderDocument & {customer: {name: string, email: string}},
      oldStatus,
      newStatus
    );

    return order;
  }
} 