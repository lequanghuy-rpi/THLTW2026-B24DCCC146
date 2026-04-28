import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Tag,
  Modal,
  Row,
  Col,
  message,
  Form,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Exercise } from '../data';

interface ExerciseLibraryPageProps {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
}

const ExerciseLibraryPage: React.FC<ExerciseLibraryPageProps> = ({
  exercises,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [searchName, setSearchName] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [form] = Form.useForm();

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const difficultyColors: Record<string, string> = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red',
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    let result = exercises;
    
    if (searchName) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    if (filterMuscleGroup) {
      result = result.filter((e) => e.muscleGroup === filterMuscleGroup);
    }
    
    if (filterDifficulty) {
      result = result.filter((e) => e.difficulty === filterDifficulty);
    }
    
    return result;
  }, [exercises, searchName, filterMuscleGroup, filterDifficulty]);

  const handleSubmit = (values: any) => {
    const exercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: values.name,
      muscleGroup: values.muscleGroup,
      difficulty: values.difficulty,
      description: values.description,
      instructions: values.instructions,
      caloriesPerHour: values.caloriesPerHour,
    };

    if (editingExercise) {
      onUpdate(exercise);
      message.success('Cập nhật bài tập thành công!');
    } else {
      onAdd(exercise);
      message.success('Thêm bài tập mới thành công!');
    }
    
    setIsModalVisible(false);
    form.resetFields();
    setEditingExercise(null);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    form.setFieldsValue(exercise);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    message.success('Xóa bài tập thành công!');
  };

  const handleViewDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDetailModalVisible(true);
  };

  const columns: ColumnsType<Exercise> = [
    {
      title: 'Tên bài tập',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <a onClick={() => handleViewDetail(record)}>{name}</a>
      ),
    },
    {
      title: 'Nhóm cơ',
      dataIndex: 'muscleGroup',
      key: 'muscleGroup',
      filters: muscleGroups.map((mg) => ({ text: mg, value: mg })),
      onFilter: (value, record) => record.muscleGroup === value,
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => (
        <Tag color={difficultyColors[difficulty]}>{difficulty}</Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Calo/giờ',
      dataIndex: 'caloriesPerHour',
      key: 'caloriesPerHour',
      render: (calories) => <span style={{ color: '#ff4d4f' }}>{calories} kcal</span>,
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
                    <div>Bạn có chắc muốn xóa bài tập này?</div>
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
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm theo tên bài tập..."
              prefix={<SearchOutlined />}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo nhóm cơ"
              value={filterMuscleGroup}
              onChange={(value) => setFilterMuscleGroup(value)}
              allowClear
              style={{ width: '100%' }}
            >
              {muscleGroups.map((mg) => (
                <Select.Option key={mg} value={mg}>{mg}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Lọc theo mức độ"
              value={filterDifficulty}
              onChange={(value) => setFilterDifficulty(value)}
              allowClear
              style={{ width: '100%' }}
            >
              {difficulties.map((d) => (
                <Select.Option key={d} value={d}>{d}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingExercise(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
              block
            >
              Thêm bài tập
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        dataSource={filteredExercises}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập mới'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingExercise(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: 'Medium',
            caloriesPerHour: 300,
          }}
        >
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}
          >
            <Input placeholder="Ví dụ: Chạy bộ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="muscleGroup"
                label="Nhóm cơ"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}
              >
                <Select options={muscleGroups.map((mg) => ({ value: mg, label: mg }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="Mức độ khó"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
              >
                <Select options={difficulties.map((d) => ({ value: d, label: d }))} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="instructions"
            label="Hướng dẫn thực hiện"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="caloriesPerHour"
            label="Calo đốt trung bình/giờ"
            rules={[{ required: true, message: 'Vui lòng nhập calo' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingExercise ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={selectedExercise?.name || 'Chi tiết bài tập'}
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedExercise(null);
        }}
        footer={
          <Button type="primary" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        }
        width={600}
      >
        {selectedExercise && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>Nhóm cơ:</strong> {selectedExercise.muscleGroup}</p>
              </Col>
              <Col span={12}>
                <p><strong>Mức độ:</strong> <Tag color={difficultyColors[selectedExercise.difficulty]}>{selectedExercise.difficulty}</Tag></p>
              </Col>
            </Row>
            <p><strong>Calo đốt/giờ:</strong> <span style={{ color: '#ff4d4f', fontWeight: 500 }}>{selectedExercise.caloriesPerHour} kcal</span></p>
            <p><strong>Mô tả:</strong></p>
            <p style={{ background: '#fafafa', padding: 12, borderRadius: 6 }}>{selectedExercise.description}</p>
            <p><strong>Hướng dẫn thực hiện:</strong></p>
            <pre style={{ background: '#fafafa', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
              {selectedExercise.instructions}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExerciseLibraryPage;