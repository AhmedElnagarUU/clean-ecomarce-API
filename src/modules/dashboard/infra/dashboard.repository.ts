import { IDashboardRepository } from '../domain/dashboard.repository.interface';
import { DashboardStats, SalesAnalytics, TopProduct, RecentOrder } from '../domain/entities/dashboard.entity';
import { OrderModel } from '../../order/infra/order.model';
import { Product } from '../../product/infra/product.model';
import { CustomerModel } from '../../customer/infra/customer.model';

export class DashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const [totalOrders, totalProducts, totalCustomers, totalRevenue] = await Promise.all([
      OrderModel.countDocuments(),
      Product.countDocuments(),
      CustomerModel.countDocuments(),
      OrderModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: totalRevenue[0]?.total || 0
    };
  }

  async getRecentOrders(): Promise<RecentOrder[]> {
    return await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name email')
      .select('orderNumber totalAmount status createdAt');
  }

  async getTopProducts(): Promise<TopProduct[]> {
    return await OrderModel.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$product.name',
          price: '$product.price',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);
  }

  async getSalesAnalytics(startDate: string, endDate: string): Promise<SalesAnalytics[]> {
    return await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalSales: 1,
          orderCount: 1
        }
      }
    ]);
  }
} 