export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ShippingMethod = 'standard' | 'express' | 'overnight';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  tax: number;
  discount?: number;
  paymentId?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 