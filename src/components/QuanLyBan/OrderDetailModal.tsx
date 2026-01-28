import React from 'react';
import {
  Modal,
  Button,
} from 'antd';
import { Order } from '@/models/quanlyban';

interface OrderDetailModalProps {
  visible: boolean;
  order?: Order;
  onCancel: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, order, onCancel }) => {
  if (!order) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Chờ xử lý': '#faad14',
      'Đang giao': '#1890ff',
      'Hoàn thành': '#52c41a',
      'Đã hủy': '#f5222d',
    };
    return colors[status] || '#1890ff';
  };

  return (
    <Modal
      title={`Chi tiết đơn hàng ${order.id}`}
      visible={visible}
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>Đóng</Button>}
      width={700}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Mã đơn hàng:</strong> {order.id}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Khách hàng:</strong> {order.customerName}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Số điện thoại:</strong> {order.phone}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Địa chỉ:</strong> {order.address}
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Ngày tạo:</strong> {order.createdAt}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Trạng thái:</strong>
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: getStatusColor(order.status),
                color: '#fff',
                fontSize: '12px',
              }}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <h4>Danh sách sản phẩm:</h4>
      <div style={{ marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>
                Sản phẩm
              </th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'center' }}>
                SL
              </th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'right' }}>
                Giá
              </th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'right' }}>
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {order.products.map(product => (
              <tr key={product.productId}>
                <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
                  {product.productName}
                </td>
                <td style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'center' }}>
                  {product.quantity}
                </td>
                <td style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'right' }}>
                  {formatCurrency(product.price)}
                </td>
                <td style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'right' }}>
                  {formatCurrency(product.price * product.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '16px',
          borderTop: '1px solid #d9d9d9',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Tổng cộng: {formatCurrency(order.totalAmount)}
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
