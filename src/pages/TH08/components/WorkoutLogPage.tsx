import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
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
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Workout, formatDate } from '../data';

interface WorkoutLogPageProps {
  workouts: Workout[];
  onAdd: (workout: Workout) => void;
  onUpdate: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

const WorkoutLogPage: React.FC<WorkoutLogPageProps> = ({
  workouts,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [form] = Form.useForm();

  const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];

  // Filter workouts
  const filteredWorkouts = useMemo(() => {
    let result = workouts;
    
    if (searchTitle) {
      result = result.filter((w) =>
        w.type.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    
    if (filterType) {
      result = result.filter((w) => w.type === filterType);
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      result = result.filter((w) => {
        const workoutDate = new Date(w.date);
        return workoutDate >= new Date(dateRange[0]) && workoutDate <= new Date(dateRange[1]);
      });
    }
    
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts, searchTitle, filterType, dateRange]);

  const handleSubmit = (values: any) => {
    const workout: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      date: values.date.format('YYYY-MM-DD'),
      type: values.type,
      duration: values.duration,
      calories: values.calories,
      note: values.note || '',
      status: values.status,
    };

    if (editingWorkout) {
      onUpdate(workout);
      message.success('Cập nhật buổi tập thành công!');
    } else {
      onAdd(workout);
      message.success('Thêm buổi tập mới thành công!');
    }
    
    setIsModalVisible(false);
    form.resetFields();
    setEditingWorkout(null);
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    form.setFieldsValue({
      ...workout,
      date: workout.date ? new Date(workout.date) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    message.success('Xóa buổi tập thành công!');
  };

  const columns: ColumnsType<Workout> = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => formatDate(date),
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colorMap: Record<string, string> = {
          Cardio: 'orange',
          Strength: 'red',
          Yoga: 'green',
          HIIT: 'purple',
          Other: 'blue',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
      key: 'calories',
      sorter: (a, b) => a.calories - b.calories,
      render: (calories) => <span style={{ color: '#ff4d4f', fontWeight: 500 }}>{calories}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'success' : 'default'}>
          {status === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
        </Tag>
      ),
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
                <div>Bạn có chắc muốn xóa buổi tập này?</div>
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

  return (
    <div>
      {/* Filters */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo loại bài tập..."
              prefix={<SearchOutlined />}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo loại bài tập"
              value={filterType}
              onChange={(value) => setFilterType(value)}
              allowClear
              style={{ width: '100%' }}
            >
              {workoutTypes.map((type) => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <DatePicker.RangePicker
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format('YYYY-MM-DD') || '',
                    dates[1]?.format('YYYY-MM-DD') || '',
                  ]);
                } else {
                  setDateRange(null);
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingWorkout(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
              block
            >
              Thêm buổi tập
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        dataSource={filteredWorkouts}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Form */}
      <Modal
        title={editingWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingWorkout(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'completed',
            type: 'Cardio',
            duration: 30,
            calories: 200,
          }}
        >
          <Form.Item
            name="date"
            label="Ngày tập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại bài tập"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}
          >
            <Select>
              {workoutTypes.map((type) => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời lượng (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="calories"
                label="Calo đốt"
                rules={[{ required: true, message: 'Vui lòng nhập calo' }]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="missed">Bỏ lỡ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingWorkout ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLogPage;