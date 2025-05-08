interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customer: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function validateOrder(orderData: OrderData): string | null {
  // Required fields validation
  if (!orderData.customer) {
    return 'Customer ID is required';
  }

  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return 'Order must contain at least one item';
  }

  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    return 'Total amount must be greater than 0';
  }

  // Validate each order item
  for (const item of orderData.items) {
    if (!item.product) {
      return 'Product ID is required for each item';
    }
    if (!item.quantity || item.quantity <= 0) {
      return 'Quantity must be greater than 0 for each item';
    }
    if (!item.price || item.price <= 0) {
      return 'Price must be greater than 0 for each item';
    }
  }

  // Validate shipping address if provided
  if (orderData.shippingAddress) {
    const { street, city, state, zipCode, country } = orderData.shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      return 'All shipping address fields are required if shipping address is provided';
    }
  }

  return null;
} 