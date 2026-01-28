import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShoppingCartOutlined,
  ShopOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

interface DashboardStatsProps {
  totalProducts: number;
  inventoryValue: number;
  totalOrders: number;
  totalRevenue: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalProducts,
  inventoryValue,
  totalOrders,
  totalRevenue,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <Row gutter={16} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng sản phẩm"
            value={totalProducts}
            prefix={<ShopOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Giá trị tồn kho"
            value={inventoryValue}
            prefix={<DollarOutlined />}
            formatter={(value: any) => formatCurrency(value as number).replace('₫', '').trim()}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng đơn hàng"
            value={totalOrders}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Doanh thu"
            value={totalRevenue}
            prefix={<ThunderboltOutlined />}
            formatter={(value: any) => formatCurrency(value as number).replace('₫', '').trim()}
            valueStyle={{ color: '#f5222d' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
