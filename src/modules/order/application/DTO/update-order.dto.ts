import { OrderItem, OrderStatus } from '../../domain/entities/order.entity';

export interface UpdateOrderDto {
  items?: OrderItem[];
  status?: OrderStatus;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  notes?: string;
  paymentId?: string;
} 