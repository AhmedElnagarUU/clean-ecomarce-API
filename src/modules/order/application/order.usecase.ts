import { IOrderRepository } from '../domain/order.repository.interface';
import { Order, OrderStatus } from '../domain/entities/order.entity';
import { CreateOrderDto } from './DTO/create-order.dto';
import { UpdateOrderDto } from './DTO/update-order.dto';
import { ApiError } from '../../../utils/ApiError';

export class OrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    try {
      const order: Partial<Order> = {
        ...dto,
        status: 'pending',
        totalAmount: this.calculateTotalAmount(dto.items),
        shippingCost: this.calculateShippingCost(dto.shippingMethod),
        tax: this.calculateTax(dto.items),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return this.orderRepository.create(order as Order);
    } catch (error) {
      throw new ApiError(500, 'Error creating order');
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order');
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.findByUserId(userId);
    } catch (error) {
      throw new ApiError(500, 'Error fetching user orders');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new ApiError(500, 'Error fetching orders');
    }
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    try {
      const existingOrder = await this.orderRepository.findById(id);
      if (!existingOrder) {
        throw new ApiError(404, 'Order not found');
      }

      const updateData: Partial<Order> = {
        ...dto,
        updatedAt: new Date(),
      };

      const updatedOrder = await this.orderRepository.update(id, updateData);
      if (!updatedOrder) {
        throw new ApiError(404, 'Order not found');
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order');
    }
  }

  async deleteOrder(id: string): Promise<any> {
    try {
      const success = await this.orderRepository.delete(id);
      if (!success) {
        throw new ApiError(404, 'Order not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting order');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const order = await this.orderRepository.updateStatus(id, status);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order status');
    }
  }

  async updatePaymentStatus(id: string, status: 'pending' | 'paid' | 'failed'): Promise<Order> {
    try {
      const order = await this.orderRepository.updatePaymentStatus(id, status);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating payment status');
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      return await this.orderRepository.findByStatus(status);
    } catch (error) {
      throw new ApiError(500, 'Error fetching orders by status');
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    try {
      return await this.orderRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      throw new ApiError(500, 'Error fetching orders by date range');
    }
  }

  private calculateTotalAmount(items: Order['items']): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private calculateShippingCost(method: Order['shippingMethod']): number {
    const shippingRates = {
      standard: 5.99,
      express: 12.99,
      overnight: 24.99,
    };
    return shippingRates[method];
  }

  private calculateTax(items: Order['items']): number {
    const subtotal = this.calculateTotalAmount(items);
    const taxRate = 0.08; // 8% tax rate
    return subtotal * taxRate;
  }
} 