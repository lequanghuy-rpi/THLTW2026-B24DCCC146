import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Card,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Order, OrderFormData, OrderProduct } from '@/models/quanlyban';
import {
  queryOrders,
  queryProducts,
  updateOrderStatus,
  removeOrder,
  createOrder,
  updateProductQuantity,
} from '@/services/QuanLyBan';
import {
  OrderDetailModal,
  OrderCreateModal,
} from '@/components/QuanLyBan';
import { Product } from '@/models/quanlyban';

interface OrderManagementProps {
  onOrdersChange?: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ onOrdersChange }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const [sortBy, setSortBy] = useState<string>('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch orders and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          queryOrders(),
          queryProducts(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search by customer name or order ID
    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter(o => o.status === selectedStatus);
    }

    // Date range filter
    if (dateRange) {
      result = result.filter(o => {
        const orderDate = o.createdAt;
        return orderDate >= dateRange[0] && orderDate <= dateRange[1];
      });
    }

    // Sort
    if (sortBy === 'date-newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'date-oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'amount-desc') {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === 'amount-asc') {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return result;
  }, [orders, searchText, selectedStatus, dateRange, sortBy]);

  // Pagination
  const paginatedOrders = useMemo(() => {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, pageNum, pageSize]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };


  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);
      
      // Find the order
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Handle inventory changes based on status transition
      if (newStatus === 'Hoàn thành' && order.status !== 'Hoàn thành') {
        // Reduce inventory when order is completed
        for (const product of order.products) {
          await updateProductQuantity(product.productId, -product.quantity);
        }
      } else if (newStatus === 'Đã hủy' && order.status !== 'Đã hủy') {
        // Return inventory when order is cancelled
        for (const product of order.products) {
          await updateProductQuantity(product.productId, product.quantity);
        }
      } else if (order.status === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
        // Restore inventory if reverting from completed
        for (const product of order.products) {
          await updateProductQuantity(product.productId, product.quantity);
        }
      } else if (order.status === 'Đã hủy' && newStatus !== 'Đã hủy') {
        // Reduce inventory again if reverting from cancelled
        for (const product of order.products) {
          await updateProductQuantity(product.productId, -product.quantity);
        }
      }

      await updateOrderStatus(orderId, newStatus as any);
      
      const newOrders = orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus as any } : o
      );
      setOrders(newOrders);
      
      message.success('Cập nhật trạng thái thành công!');
      onOrdersChange?.();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await removeOrder(id);
      const newOrders = orders.filter(o => o.id !== id);
      setOrders(newOrders);
      message.success('Xóa đơn hàng thành công!');
      onOrdersChange?.();
    } catch (error) {
      message.error('Lỗi khi xóa đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (data: OrderFormData & { products: OrderProduct[] }) => {
    try {
      setLoading(true);
      const newOrder = await createOrder(data);
      setOrders([newOrder, ...orders]);
      message.success('Tạo đơn hàng thành công!');
      setCreateModalVisible(false);
      onOrdersChange?.();
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi tạo đơn hàng!');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Số SP',
      key: 'productCount',
      width: 80,
      render: (_: any, record: Order) => record.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      render: (_: any, record: Order) => (
        <Select
          value={record.status}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { label: 'Chờ xử lý', value: 'Chờ xử lý' },
            { label: 'Đang giao', value: 'Đang giao' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Input.Search
              placeholder="Tìm mã đơn hoặc tên khách hàng..."
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value);
                setPageNum(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              placeholder="Chọn trạng thái"
              value={selectedStatus}
              onChange={val => {
                setSelectedStatus(val);
                setPageNum(1);
              }}
              allowClear
              style={{ width: '100%' }}
              options={[
                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                { label: 'Đang giao', value: 'Đang giao' },
                { label: 'Hoàn thành', value: 'Hoàn thành' },
                { label: 'Đã hủy', value: 'Đã hủy' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              placeholder="Sắp xếp"
              value={sortBy}
              onChange={setSortBy}
              allowClear
              style={{ width: '100%' }}
              options={[
                { label: 'Ngày tạo (mới-cũ)', value: 'date-newest' },
                { label: 'Ngày tạo (cũ-mới)', value: 'date-oldest' },
                { label: 'Tổng tiền (cao-thấp)', value: 'amount-desc' },
                { label: 'Tổng tiền (thấp-cao)', value: 'amount-asc' },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <span style={{ lineHeight: '32px', marginRight: '8px' }}>Khoảng ngày:</span>
            <DatePicker.RangePicker
              value={
                dateRange
                  ? [dayjs(dateRange[0]) as any, dayjs(dateRange[1]) as any]
                  : undefined
              }
              onChange={(dates: any) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                  ]);
                  setPageNum(1);
                } else {
                  setDateRange(undefined);
                  setPageNum(1);
                }
              }}
              format="YYYY-MM-DD"
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            Tạo đơn hàng
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText('');
              setSelectedStatus(undefined);
              setDateRange(undefined);
              setSortBy('');
              setPageNum(1);
            }}
          >
            Đặt lại
          </Button>
          <span>{filteredOrders.length} đơn hàng</span>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={paginatedOrders}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredOrders.length,
          pageSize: pageSize,
          current: pageNum,
          pageSizeOptions: ['5', '10', '20'],
          onChange: (page, size) => {
            setPageNum(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
      />

      <OrderDetailModal
        visible={detailModalVisible}
        order={selectedOrder}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedOrder(undefined);
        }}
      />

      <OrderCreateModal
        visible={createModalVisible}
        products={products}
        onSubmit={handleCreateOrder}
        onCancel={() => setCreateModalVisible(false)}
      />
    </div>
  );
};

export default OrderManagement;
