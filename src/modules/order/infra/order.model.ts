import mongoose, { Document } from 'mongoose';
import { CustomerDocument } from '../../customer/infra/customer.model';
import { IProduct } from '../../product/infra/product.model';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order, OrderStatus } from '../domain/entities/order.entity';

export type OrderItem = {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
};

export interface OrderDocument extends Document {
  orderNumber: string;
  _id: mongoose.Types.ObjectId;
  customer: CustomerDocument['_id'];
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);

export class OrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const newOrder = new OrderModel(order);
    await newOrder.save();
    return this.mapToDomain(newOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    return order ? this.mapToDomain(order) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ customer: userId })
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    return orders.map(this.mapToDomain);
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    return orders.map(this.mapToDomain);
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(id, data, { new: true })
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    return order ? this.mapToDomain(order) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await OrderModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('customer', 'name email')
     .populate('items.product', 'name price');
    return order ? this.mapToDomain(order) : null;
  }

  async updatePaymentStatus(id: string, status: 'pending' | 'paid' | 'failed'): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    ).populate('customer', 'name email')
     .populate('items.product', 'name price');
    return order ? this.mapToDomain(order) : null;
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await OrderModel.find({ status })
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    return orders.map(this.mapToDomain);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const orders = await OrderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('customer', 'name email')
      .populate('items.product', 'name price');
    return orders.map(this.mapToDomain);
  }

  private mapToDomain(orderDoc: OrderDocument): Order {
    return {
      id: orderDoc._id.toString(),
      userId: (orderDoc.customer as any).toString(),
      items: orderDoc.items.map(item => ({
        productId: item.product.toString(),
        quantity: item.quantity,
        price: item.price,
        name: (item.product as any).name || '',
        image: (item.product as any).image || ''
      })),
      totalAmount: orderDoc.totalAmount,
      status: orderDoc.status as OrderStatus,
      paymentStatus: orderDoc.paymentStatus,
      shippingAddress: {
        ...orderDoc.shippingAddress,
        phone: orderDoc.shippingAddress.phone || ''
      },
      shippingMethod: 'standard', // Default value
      shippingCost: 0, // Default value
      tax: 0, // Default value
      paymentId: undefined,
      trackingNumber: undefined,
      estimatedDeliveryDate: undefined,
      notes: undefined,
      createdAt: orderDoc.createdAt,
      updatedAt: orderDoc.updatedAt
    };
  }
} 