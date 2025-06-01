export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
}

export interface SalesAnalytics {
  date: string;
  totalSales: number;
  orderCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
}

export interface RecentOrder {
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  customer: {
    name: string;
    email: string;
  };
} 