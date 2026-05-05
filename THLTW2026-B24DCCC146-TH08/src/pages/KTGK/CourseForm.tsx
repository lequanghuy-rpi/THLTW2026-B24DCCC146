import React from 'react';
import { Button, Form, FormInstance, Input, InputNumber, Modal, Select, Space } from 'antd';
import { Course, CourseStatus } from './types';

const { TextArea } = Input;

interface CourseFormProps {
  visible: boolean;
  form: FormInstance<Omit<Course, 'id'>>;
  editingCourse: Course | null;
  instructorList: string[];
  onClose: () => void;
  onSave: (values: Omit<Course, 'id'>) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  form,
  editingCourse,
  instructorList,
  onClose,
  onSave,
}) => (
  <Modal
    title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
    visible={visible}
    onCancel={onClose}
    footer={null}
    destroyOnClose
  >
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        instructor: instructorList[0],
        studentCount: 0,
        status: CourseStatus.DangMo,
        descriptionHtml: '',
      }}
      onFinish={onSave}
    >
      <Form.Item
        label="Tên khóa học"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên khóa học.' },
          { max: 100, message: 'Tên khóa học tối đa 100 ký tự.' },
        ]}
      >
        <Input maxLength={100} />
      </Form.Item>

      <Form.Item
        label="Giảng viên"
        name="instructor"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên.' }]}
      >
        <Select>
          {instructorList.map((instructor) => (
            <Select.Option key={instructor} value={instructor}>
              {instructor}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Số lượng học viên"
        name="studentCount"
        rules={[
          { required: true, message: 'Vui lòng nhập số lượng học viên.' },
          { type: 'number', min: 0, message: 'Số lượng học viên phải là số nguyên không âm.' },
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Trạng thái khóa học"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái khóa học.' }]}
      >
        <Select>
          {Object.values(CourseStatus).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Mô tả khóa học (HTML)"
        name="descriptionHtml"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học.' }]}
      >
        <TextArea rows={6} placeholder="Nhập HTML cho mô tả khóa học" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {editingCourse ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  </Modal>
);

export default CourseForm;
