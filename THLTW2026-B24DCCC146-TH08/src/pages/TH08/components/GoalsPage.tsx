import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Popconfirm,
  Tag,
  Drawer,
  Form,
  Select,
  DatePicker,
  Progress,
  Row,
  Col,
  Segmented,
  message,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Goal, formatDate } from '../data';

interface GoalsPageProps {
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onUpdate: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form] = Form.useForm();

  const goalTypes = [
    { value: 'weight_loss', label: 'Giảm cân' },
    { value: 'muscle_gain', label: 'Tăng cơ' },
    { value: 'endurance', label: 'Cải thiện sức bền' },
    { value: 'other', label: 'Khác' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Đang thực hiện', color: 'blue' },
    { value: 'achieved', label: 'Đã đạt', color: 'green' },
    { value: 'cancelled', label: 'Đã hủy', color: 'default' },
  ];

  // Filter goals
  const filteredGoals = useMemo(() => {
    if (filterStatus === 'all') return goals;
    return goals.filter((g) => g.status === filterStatus);
  }, [goals, filterStatus]);

  const handleSubmit = (values: any) => {
    const goal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: values.name,
      type: values.type,
      targetValue: values.targetValue,
      currentValue: editingGoal?.currentValue || 0,
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: values.status,
    };

    if (editingGoal) {
      onUpdate(goal);
      message.success('Cập nhật mục tiêu thành công!');
    } else {
      onAdd(goal);
      message.success('Thêm mục tiêu mới thành công!');
    }
    
    setIsDrawerVisible(false);
    form.resetFields();
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      ...goal,
      deadline: goal.deadline ? new Date(goal.deadline) : null,
    });
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    message.success('Xóa mục tiêu thành công!');
  };

  const handleUpdateCurrentValue = (goal: Goal, newValue: number) => {
    onUpdate({ ...goal, currentValue: newValue });
    message.success('Cập nhật giá trị thành công!');
  };

  const getProgress = (goal: Goal): number => {
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return '#52c41a';
    if (progress >= 70) return '#1890ff';
    if (progress >= 40) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div>
      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        <Segmented
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đang thực hiện', value: 'active' },
            { label: 'Đã đạt', value: 'achieved' },
            { label: 'Đã hủy', value: 'cancelled' },
          ]}
          value={filterStatus}
          onChange={(value) => setFilterStatus(value as string)}
        />
      </div>

      {/* Goals Grid */}
      <Row gutter={[16, 16]}>
        {filteredGoals.map((goal) => {
          const progress = getProgress(goal);
          const typeLabel = goalTypes.find((t) => t.value === goal.type)?.label || goal.type;
          const statusInfo = statusOptions.find((s) => s.value === goal.status);

          return (
            <Col xs={24} sm={12} md={8} key={goal.id}>
              <Card
                hoverable
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(goal);
                    }}
                  />,
                  <Popconfirm
                    title={
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Xác nhận xóa</div>
                        <div>Bạn có chắc muốn xóa mục tiêu này?</div>
                      </div>
                    }
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDelete(goal.id);
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <Space>
                      {goal.name}
                      <Tag color={statusInfo?.color}>{statusInfo?.label}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Loại:</strong> {typeLabel}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Deadline:</strong> {formatDate(goal.deadline)}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <Space align="center">
                          <span>Giá trị hiện tại:</span>
                          <InputNumber
                            min={0}
                            value={goal.currentValue}
                            onChange={(value) => handleUpdateCurrentValue(goal, value || 0)}
                            style={{ width: 80 }}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span>/ {goal.targetValue}</span>
                        </Space>
                      </div>
                      <Progress
                        percent={progress}
                        strokeColor={getProgressColor(progress)}
                        size="small"
                      />
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredGoals.length === 0 && (
        <Card style={{ textAlign: 'center', marginTop: 16 }}>
          Chưa có mục tiêu nào. Hãy thêm mục tiêu mới!
        </Card>
      )}

      {/* Add Button */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGoal(null);
            form.resetFields();
            setIsDrawerVisible(true);
          }}
          size="large"
        >
          Thêm mục tiêu mới
        </Button>
      </div>

      {/* Drawer Form */}
      <Drawer
        title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
        width={400}
        visible={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
          form.resetFields();
          setEditingGoal(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'weight_loss',
            targetValue: 10,
            currentValue: 0,
            status: 'active',
          }}
        >
          <Form.Item
            name="name"
            label="Tên mục tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}
          >
            <Input placeholder="Ví dụ: Giảm 5kg" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại mục tiêu"
            rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}
          >
            <Select options={goalTypes} />
          </Form.Item>

          <Form.Item
            name="targetValue"
            label="Giá trị mục tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsDrawerVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingGoal ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default GoalsPage;