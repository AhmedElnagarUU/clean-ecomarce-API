import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { Customer } from '../customer/customer.model';

export class DashboardService {
  
  static async getStats() {
    console.log("getStats from service")
    try {
      const [totalOrders, totalProducts, totalCustomers, totalRevenue] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Customer.countDocuments(),
        Order.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
      ]);
console.log(totalOrders, totalProducts, totalCustomers, totalRevenue)
      return {
        totalOrders,
        totalProducts,
        totalCustomers,
        // totalRevenue: totalRevenue[0]?.total || 0
      };
    } catch (error) {
      throw error;
    }
  }

  static async getRecentOrders() {
    try {
      return await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('customer', 'name email')
        .select('orderNumber totalAmount status createdAt');
    } catch (error) {
      throw error;
    }
  }

  static async getTopProducts() {
    try {
      return await Product.aggregate([
        {
          $lookup: {
            from: 'orderitems',
            localField: '_id',
            foreignField: 'product',
            as: 'orderItems'
          }
        },
        {
          $project: {
            name: 1,
            price: 1,
            totalSold: { $size: '$orderItems' },
            totalRevenue: {
              $multiply: ['$price', { $size: '$orderItems' }]
            }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);
    } catch (error) {
      throw error;
    }
  }

  static async getSalesAnalytics(startDate: string, endDate: string) {
    try {
      return await Order.aggregate([
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
        { $sort: { '_id': 1 } }
      ]);
    } catch (error) {
      throw error;
    }
  }
} 