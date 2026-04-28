import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  Tag,
  DatePicker,
  message,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { HealthMetric, calculateBMI, getBMICategory, formatDate } from '../data';

interface HealthMetricsPageProps {
  metrics: HealthMetric[];
  onAdd: (metric: HealthMetric) => void;
  onUpdate: (metric: HealthMetric) => void;
  onDelete: (id: string) => void;
}

const HealthMetricsPage: React.FC<HealthMetricsPageProps> = ({
  metrics,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const bmi = calculateBMI(values.weight, values.height);
    
    const metric: HealthMetric = {
      id: editingMetric?.id || Date.now().toString(),
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      height: values.height,
      restingHeartRate: values.restingHeartRate,
      sleepHours: values.sleepHours,
    };

    if (editingMetric) {
      onUpdate(metric);
      message.success('Cập nhật chỉ số thành công!');
    } else {
      onAdd(metric);
      message.success('Thêm chỉ số mới thành công!');
    }
    
    setIsModalVisible(false);
    form.resetFields();
    setEditingMetric(null);
  };

  const handleEdit = (metric: HealthMetric) => {
    setEditingMetric(metric);
    form.setFieldsValue({
      ...metric,
      date: metric.date ? new Date(metric.date) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    message.success('Xóa chỉ số thành công!');
  };

  const columns: ColumnsType<HealthMetric> = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => formatDate(date),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      sorter: (a, b) => a.weight - b.weight,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      key: 'bmi',
      sorter: (a, b) => calculateBMI(a.weight, a.height) - calculateBMI(b.weight, b.height),
      render: (_, record) => {
        const bmi = calculateBMI(record.weight, record.height);
        const category = getBMICategory(bmi);
        return (
          <Tag color={category.color}>
            {bmi} - {category.label}
          </Tag>
        );
      },
    },
    {
      title: 'Nhịp tim nghỉ (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
      sorter: (a, b) => a.restingHeartRate - b.restingHeartRate,
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
      sorter: (a, b) => a.sleepHours - b.sleepHours,
      render: (hours) => `${hours} giờ`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={
              <div>
                <div style={{ fontWeight: 'bold' }}>Xác nhận xóa</div>
                <div>Bạn có chắc muốn xóa chỉ số này?</div>
              </div>
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [metrics]);

  return (
    <div>
      {/* Add Button */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMetric(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm chỉ số sức khỏe
        </Button>
      </div>

      {/* BMI Legend */}
      <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
        <Row gutter={16}>
          <Col>
            <span style={{ marginRight: 16 }}><strong>Phân loại BMI:</strong></span>
          </Col>
          <Col>
            <Tag color="blue">Thiếu cân: &lt; 18.5</Tag>
            <Tag color="green">Bình thường: 18.5 – 24.9</Tag>
            <Tag color="gold">Thừa cân: 25 – 29.9</Tag>
            <Tag color="red">Béo phì: ≥ 30</Tag>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        dataSource={sortedMetrics}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Form */}
      <Modal
        title={editingMetric ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe mới'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingMetric(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            weight: 70,
            height: 170,
            restingHeartRate: 70,
            sleepHours: 7,
          }}
        >
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
              >
                <Input type="number" min={1} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="height"
                label="Chiều cao (cm)"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="restingHeartRate"
                label="Nhịp tim lúc nghỉ (bpm)"
                rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sleepHours"
                label="Giờ ngủ"
                rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}
              >
                <Input type="number" min={0} max={24} step={0.5} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingMetric ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthMetricsPage;