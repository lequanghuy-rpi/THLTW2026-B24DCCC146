// Models cho Đơn hàng

export type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderFormData {
  productIds: number[];
  productQuantities: Record<number, number>;
  customerName: string;
  phone: string;
  address: string;
}

export interface OrderFilter {
  searchText?: string;
  status?: OrderStatus;
  dateRange?: [string, string];
  sortBy?: 'date-newest' | 'date-oldest' | 'amount';
  pageNum?: number;
  pageSize?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  byStatus: Record<OrderStatus, number>;
}
