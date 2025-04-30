import { Request, Response } from 'express';
import { Order } from './order.model';

export class OrderController {
  static async getOrders(req: Request, res: Response) {
    try {
      const orders = await Order.find()
        .populate('customer', 'name email')
        .sort({ createdAt: -1 });
      return res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      console.log("create order");
      console.log(req.body);
      const order = new Order(req.body);
      await order.save();
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
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
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