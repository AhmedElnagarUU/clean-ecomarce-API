import { OrderItem, ShippingAddress, ShippingMethod } from '../../domain/entities/order.entity';

export interface CreateOrderDto {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  notes?: string;
} 