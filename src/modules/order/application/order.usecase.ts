import { IOrderRepository } from '../domain/order.repository.interface';
import { Order, OrderStatus } from '../domain/entities/order.entity';
import { CreateOrderDto } from './DTO/create-order.dto';
import { UpdateOrderDto } from './DTO/update-order.dto';

export class OrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
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
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order | null> {
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      return null;
    }

    const updateData: Partial<Order> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.orderRepository.update(id, updateData);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return this.orderRepository.updateStatus(id, status);
  }

  async updatePaymentStatus(id: string, status: Order['paymentStatus']): Promise<Order | null> {
    return this.orderRepository.updatePaymentStatus(id, status);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderRepository.findByDateRange(startDate, endDate);
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