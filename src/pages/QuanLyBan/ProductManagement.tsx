import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Select,
  Slider,
  Row,
  Col,
  Card,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Product, ProductFormData } from '@/models/quanlyban';
import {
  queryProducts,
  updateProduct,
  removeProduct,
  queryCategories,
} from '@/services/QuanLyBan';
import ProductFormModal from '@/components/QuanLyBan/ProductFormModal';

interface ProductManagementProps {
  onProductsChange?: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onProductsChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          queryProducts(),
          queryCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchText) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Status filter
    if (selectedStatus) {
      result = result.filter(p => p.status === selectedStatus);
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'quantity-asc') {
      result.sort((a, b) => a.quantity - b.quantity);
    } else if (sortBy === 'quantity-desc') {
      result.sort((a, b) => b.quantity - a.quantity);
    }

    return result;
  }, [products, searchText, selectedCategory, priceRange, selectedStatus, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, pageNum, pageSize]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getStatusTag = (status: string) => {
    const colors: Record<string, string> = {
      'Còn hàng': 'green',
      'Sắp hết': 'orange',
      'Hết hàng': 'red',
    };
    return <Tag color={colors[status] || 'default'}>{status}</Tag>;
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await removeProduct(id);
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      message.success('Xóa sản phẩm thành công!');
      onProductsChange?.();
    } catch (error) {
      message.error('Lỗi khi xóa sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        const newProducts = products.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...data, status: p.status }
            : p
        );
        setProducts(newProducts);
      }
      onProductsChange?.();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (_: any, __: any, index: number) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => formatCurrency(price),
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa sản phẩm này?"
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
          <Col xs={24} sm={12} lg={6}>
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value);
                setPageNum(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Chọn danh mục"
              value={selectedCategory}
              onChange={val => {
                setSelectedCategory(val);
                setPageNum(1);
              }}
              allowClear
              style={{ width: '100%' }}
              options={categories.map(cat => ({ label: cat, value: cat }))}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={val => {
                setSelectedStatus(val);
                setPageNum(1);
              }}
              allowClear
              style={{ width: '100%' }}
              options={[
                { label: 'Còn hàng', value: 'Còn hàng' },
                { label: 'Sắp hết', value: 'Sắp hết' },
                { label: 'Hết hàng', value: 'Hết hàng' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Sắp xếp"
              value={sortBy}
              onChange={setSortBy}
              allowClear
              style={{ width: '100%' }}
              options={[
                { label: 'Tên (A-Z)', value: 'name-asc' },
                { label: 'Tên (Z-A)', value: 'name-desc' },
                { label: 'Giá (thấp-cao)', value: 'price-asc' },
                { label: 'Giá (cao-thấp)', value: 'price-desc' },
                { label: 'Số lượng (tăng)', value: 'quantity-asc' },
                { label: 'Số lượng (giảm)', value: 'quantity-desc' },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ lineHeight: '32px' }}>Khoảng giá:</span>
              <Slider
                range
                min={0}
                max={100000000}
                step={1000000}
                value={priceRange}
                onChange={(val: any) => {
                  setPriceRange(val);
                  setPageNum(1);
                }}
                style={{ flex: 1, minWidth: '200px' }}
              />
              <span style={{ lineHeight: '32px', minWidth: '200px', textAlign: 'right' }}>
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingProduct(undefined);
            setModalVisible(true);
          }}>
            Thêm sản phẩm
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => {
            setSearchText('');
            setSelectedCategory(undefined);
            setSelectedStatus(undefined);
            setSortBy('');
            setPriceRange([0, 100000000]);
            setPageNum(1);
          }}>
            Đặt lại
          </Button>
          <span>
            {filteredProducts.length} sản phẩm
          </span>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={paginatedProducts}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredProducts.length,
          pageSize: pageSize,
          current: pageNum,
          pageSizeOptions: ['5', '10', '20'],
          onChange: (page, size) => {
            setPageNum(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
      />

      <ProductFormModal
        visible={modalVisible}
        product={editingProduct}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingProduct(undefined);
        }}
      />
    </div>
  );
};

export default ProductManagement;
