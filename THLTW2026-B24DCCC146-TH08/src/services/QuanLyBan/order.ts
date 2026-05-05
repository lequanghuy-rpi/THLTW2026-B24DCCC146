import { Order, OrderFormData, OrderProduct, OrderStats } from '@/models/quanlyban';

const ORDER_STORAGE_KEY = 'qlb_orders';

// Helper to generate order ID
const generateOrderId = (): string => {
  const orders = getOrders();
  const maxNum = Math.max(
    ...orders
      .map(o => parseInt(o.id.replace('DH', ''), 10))
      .filter(n => !isNaN(n)),
    0
  );
  return `DH${String(maxNum + 1).padStart(3, '0')}`;
};

// Get all orders from localStorage
const getOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
  }
  
  // Initialize with sample order if empty
  const sampleOrders: Order[] = [
    {
      id: 'DH001',
      customerName: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      products: [
        {
          productId: 1,
          productName: 'Laptop Dell XPS 13',
          quantity: 1,
          price: 25000000,
        },
      ],
      totalAmount: 25000000,
      status: 'Chờ xử lý',
      createdAt: '2024-01-15',
    },
  ];
  
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(sampleOrders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
  
  return sampleOrders;
};

// Save orders to localStorage
const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

// Get all orders
export const queryOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getOrders());
    }, 100);
  });
};

// Get order by ID
export const queryOrderById = async (id: string): Promise<Order | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getOrders();
      resolve(orders.find(o => o.id === id) || null);
    }, 100);
  });
};

// Create new order
export const createOrder = async (data: OrderFormData & { products: OrderProduct[] }): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getOrders();
      const newOrder: Order = {
        id: generateOrderId(),
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        products: data.products,
        totalAmount: data.products.reduce((sum, p) => sum + p.price * p.quantity, 0),
        status: 'Chờ xử lý',
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      orders.push(newOrder);
      saveOrders(orders);
      resolve(newOrder);
    }, 100);
  });
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy'
): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orders = getOrders();
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        reject(new Error('Order not found'));
        return;
      }
      
      order.status = status;
      saveOrders(orders);
      resolve(order);
    }, 100);
  });
};

// Delete order
export const removeOrder = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getOrders().filter(o => o.id !== id);
      saveOrders(orders);
      resolve();
    }, 100);
  });
};

// Get order statistics
export const queryOrderStats = async (): Promise<OrderStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getOrders();
      const stats: OrderStats = {
        totalOrders: orders.length,
        totalRevenue: orders
          .filter(o => o.status === 'Hoàn thành')
          .reduce((sum, o) => sum + o.totalAmount, 0),
        byStatus: {
          'Chờ xử lý': orders.filter(o => o.status === 'Chờ xử lý').length,
          'Đang giao': orders.filter(o => o.status === 'Đang giao').length,
          'Hoàn thành': orders.filter(o => o.status === 'Hoàn thành').length,
          'Đã hủy': orders.filter(o => o.status === 'Đã hủy').length,
        },
      };
      resolve(stats);
    }, 100);
  });
};
