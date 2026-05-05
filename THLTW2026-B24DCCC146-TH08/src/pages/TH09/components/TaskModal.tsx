import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import { Task } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (task: Task) => void;
  initialData?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          deadline: initialData.deadline ? moment(initialData.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTask: Task = {
        id: initialData ? initialData.id : Date.now().toString(),
        name: values.name,
        description: values.description || '',
        deadline: values.deadline ? values.deadline.toISOString() : '',
        priority: values.priority,
        status: initialData ? initialData.status : 'To Do',
        tags: values.tags || [],
      };
      onSave(newTask);
    });
  };

  return (
    <Modal
      title={initialData ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ priority: 'Medium' }}>
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Hạn chót"
          rules={[{ required: true, message: 'Vui lòng chọn hạn chót!' }]}
        >
          <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
        >
          <Select>
            <Option value="High">Cao (High)</Option>
            <Option value="Medium">Trung bình (Medium)</Option>
            <Option value="Low">Thấp (Low)</Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Nhập tag và nhấn Enter" style={{ width: '100%' }}>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
