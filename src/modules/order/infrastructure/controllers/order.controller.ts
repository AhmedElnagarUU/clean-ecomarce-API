import { Request, Response } from 'express';
import { OrderUseCase } from '../../application/order.usecase';
import { CreateOrderDto } from '../../application/DTO/create-order.dto';
import { UpdateOrderDto } from '../../application/DTO/update-order.dto';

export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const createOrderDto: CreateOrderDto = req.body;
      const order = await this.orderUseCase.createOrder(createOrderDto);
      res.status(201).json(order);
    } catch (error) {
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
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const orders = await this.orderUseCase.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateOrderDto: UpdateOrderDto = req.body;
      const order = await this.orderUseCase.updateOrder(id, updateOrderDto);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const orders = await this.orderUseCase.getOrdersByStatus(status as any);
      res.json(orders);
    } catch (error) {
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
      res.json(orders);
    } catch (error) {
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
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
} 