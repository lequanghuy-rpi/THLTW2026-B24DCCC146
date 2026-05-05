import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, message } from 'antd';
import { Product, ProductFormData } from '@/models/quanlyban';

interface ProductFormModalProps {
  visible: boolean;
  product?: Product;
  categories: string[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (product) {
        form.setFieldsValue({
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, product, form]);

  const handleSubmit = async (values: ProductFormData) => {
    try {
      setLoading(true);
      await onSubmit(values);
      message.success(product ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
      form.resetFields();
      onCancel();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {product ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Input placeholder="Nhập danh mục" list="categories" />
          <datalist id="categories">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </Form.Item>

        <Form.Item
          label="Giá (đồng)"
          name="price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá!' },
            { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá" />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', min: 0, message: 'Số lượng không được âm!' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
