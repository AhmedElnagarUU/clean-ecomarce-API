import { Request, Response } from 'express';
import { Order } from './order.model';
import { NotificationService } from '../notification/notification.service';

export class OrderController {
  static async getOrders(req: Request, res: Response) {
    try {
      const orders = await Order.find()
        .populate('customer')
        .sort({ createdAt: -1 });
      return res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const order = new Order(req.body);
      await order.save();

      // Create notification for new order
      await NotificationService.createOrderPlacedNotification(order);

      return res.status(201).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const oldStatus = order.status;
      const newStatus = req.body.status;

      // Update order status
      order.status = newStatus;
      await order.save();

      // Create notification for status change
      await NotificationService.createOrderStatusChangeNotification(
        order,
        oldStatus,
        newStatus
      );

      return res.json({
        success: true,
        data: order
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('customer', 'name email')
        .populate('items.product', 'name price');
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.json({
        success: true,
        data: order
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
} 