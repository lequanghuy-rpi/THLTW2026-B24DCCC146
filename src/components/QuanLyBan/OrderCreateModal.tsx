import React, { useState, useMemo } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Button,
  message,
  Select,
  Table,
  Divider,
} from 'antd';
import { Product, OrderProduct, OrderFormData } from '@/models/quanlyban';
import { DeleteOutlined } from '@ant-design/icons';

interface OrderCreateModalProps {
  visible: boolean;
  products: Product[];
  onSubmit: (data: OrderFormData & { products: OrderProduct[] }) => Promise<void>;
  onCancel: () => void;
}

const OrderCreateModal: React.FC<OrderCreateModalProps> = ({
  visible,
  products,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.price * (quantities[p.productId] || p.quantity), 0);
  }, [selectedProducts, quantities]);

  const handleProductSelect = (productIds: number[]) => {
    const newSelected = productIds.map(id => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      
      const existing = selectedProducts.find(p => p.productId === id);
      return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: existing?.quantity || 1,
      } as OrderProduct;
    }).filter((p): p is OrderProduct => p !== null);

    setSelectedProducts(newSelected);

    // Initialize quantities
    const newQuantities: Record<number, number> = {};
    newSelected.forEach(p => {
      newQuantities[p.productId] = quantities[p.productId] || p.quantity;
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (productId: number, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (qty > product.quantity) {
      message.error(`Số lượng không thể vượt quá tồn kho (${product.quantity})`);
      return;
    }

    if (qty <= 0) {
      message.error('Số lượng phải lớn hơn 0');
      return;
    }

    setQuantities({
      ...quantities,
      [productId]: qty,
    });
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const handleSubmit = async (values: any) => {
    if (selectedProducts.length === 0) {
      message.error('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(values.phone)) {
      message.error('Số điện thoại phải có từ 10-11 chữ số!');
      return;
    }

    try {
      setLoading(true);
      const orderData: OrderFormData & { products: OrderProduct[] } = {
        customerName: values.customerName,
        phone: values.phone,
        address: values.address,
        productIds: selectedProducts.map(p => p.productId),
        productQuantities: quantities,
        products: selectedProducts.map(p => ({
          ...p,
          quantity: quantities[p.productId] || p.quantity,
        })),
      };

      await onSubmit(orderData);
      form.resetFields();
      setSelectedProducts([]);
      setQuantities({});
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const tableColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 120,
      render: (_: any, record: OrderProduct) => (
        <InputNumber
          min={1}
          max={products.find(p => p.id === record.productId)?.quantity || 999}
          value={quantities[record.productId] || record.quantity}
          onChange={(val) => handleQuantityChange(record.productId, val || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: OrderProduct) => 
        formatCurrency(record.price * (quantities[record.productId] || record.quantity)),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 50,
      render: (_: any, record: OrderProduct) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveProduct(record.productId)}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Tạo đơn hàng mới"
      visible={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Tạo đơn
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Chọn sản phẩm"
          required
        >
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm"
            value={selectedProducts.map(p => p.productId)}
            onChange={handleProductSelect}
            options={products.map(p => ({
              label: `${p.name} (Tồn: ${p.quantity})`,
              value: p.id,
              disabled: p.quantity === 0,
            }))}
          />
        </Form.Item>

        {selectedProducts.length > 0 && (
          <>
            <Divider />
            <h4>Danh sách sản phẩm đã chọn:</h4>
            <Table
              columns={tableColumns}
              dataSource={selectedProducts}
              rowKey="productId"
              pagination={false}
              size="small"
              style={{ marginBottom: '16px' }}
            />
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Tổng tiền: {formatCurrency(totalAmount)}
              </span>
            </div>
            <Divider />
          </>
        )}

        <Form.Item
          label="Tên khách hàng"
          name="customerName"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Nhập số điện thoại (10-11 chữ số)" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderCreateModal;
