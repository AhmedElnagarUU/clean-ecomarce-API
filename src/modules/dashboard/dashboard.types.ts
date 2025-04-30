export type DashboardStats = {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
};

export type SalesAnalytics = {
  _id: string; // Date
  totalSales: number;
  orderCount: number;
};

export type TopProduct = {
  _id: string;
  name: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
};

export type RecentOrder = {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
}; 