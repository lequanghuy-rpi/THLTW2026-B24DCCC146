import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, message } from 'antd';
import {
  ShoppingCartOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import { DashboardStats } from '@/components/QuanLyBan';
import {
  queryProductStats,
  queryOrderStats,
} from '@/services/QuanLyBan';

const QuanLyBanPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productStats, orderStats] = await Promise.all([
        queryProductStats(),
        queryOrderStats(),
      ]);

      setStats({
        totalProducts: (productStats as any).totalProducts,
        inventoryValue: (productStats as any).totalInventoryValue,
        totalOrders: (orderStats as any).totalOrders,
        totalRevenue: (orderStats as any).totalRevenue,
      });
    } catch (error) {
      message.error('Lỗi khi tải thống kê!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const items: any = [
    {
      key: 'products',
      label: (
        <span>
          <ShopOutlined />
          Quản lý Sản phẩm
        </span>
      ),
      children: <ProductManagement onProductsChange={handleDataChange} />,
    },
    {
      key: 'orders',
      label: (
        <span>
          <ShoppingCartOutlined />
          Quản lý Đơn hàng
        </span>
      ),
      children: <OrderManagement onOrdersChange={handleDataChange} />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 24px 0' }}>Quản lý Đơn hàng và Sản phẩm</h1>
        <Spin spinning={loading}>
          <DashboardStats
            totalProducts={stats.totalProducts}
            inventoryValue={stats.inventoryValue}
            totalOrders={stats.totalOrders}
            totalRevenue={stats.totalRevenue}
          />
        </Spin>
      </Card>

      <Card>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          type="card"
        >
          {items.map((item: any) => (
            <Tabs.TabPane key={item.key} tab={item.label}>
              {item.children}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default QuanLyBanPage;
