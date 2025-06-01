import { Request, Response } from 'express';
import { OrderUseCase } from '../application/order.usecase';
import { CreateOrderDto } from '../application/DTO/create-order.dto';
import { UpdateOrderDto } from '../application/DTO/update-order.dto';
import { ApiResponse } from '../../../utils/ApiResponse';

export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateOrderDto = req.body;
      const order = await this.orderUseCase.createOrder(dto);
      res.status(201).json(new ApiResponse(201, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderUseCase.getOrderById(id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const orders = await this.orderUseCase.getOrdersByUserId(userId);
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderUseCase.getAllOrders();
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateOrderDto = req.body;
      const order = await this.orderUseCase.updateOrder(id, dto);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.orderUseCase.deleteOrder(id);
      if (!success) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      // Ensure status is correctly typed for orderUseCase.getOrdersByStatus
      const orders = await this.orderUseCase.getOrdersByStatus(status as any); 
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        res.status(400).json({ message: 'Start date and end date are required' });
        return;
      }
      const orders = await this.orderUseCase.getOrdersByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(new ApiResponse(200, orders));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderUseCase.updateOrderStatus(id, status);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderUseCase.updatePaymentStatus(id, status);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(new ApiResponse(200, order));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 