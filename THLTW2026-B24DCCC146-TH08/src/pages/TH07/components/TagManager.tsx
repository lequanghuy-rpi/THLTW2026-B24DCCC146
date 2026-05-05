import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag as TagType } from '../data';

const colors = [
  'magenta', 'red', 'volcano', 'orange', 'gold', 
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
];

interface TagManagerProps {
  tags: TagType[];
  onAddTag: (tag: TagType) => void;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (id: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null); 
  const [form] = Form.useForm();

  const handleAddClick = () => {
    setEditingTag(null); 
    form.resetFields();  
    setIsModalOpen(true);
  };

  const handleEditClick = (tag: TagType) => {
    setEditingTag(tag); 
    form.setFieldsValue(tag); 
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingTag) {
       
        const updatedTag: TagType = {
          ...editingTag, 
          name: values.name, 
          color: values.color, 
        };
        onUpdateTag(updatedTag);
        message.success('Cập nhật thẻ thành công!');
      } else {
        const newTag: TagType = {
          id: Date.now().toString(),
          name: values.name,
          color: values.color,
        };
        onAddTag(newTag);
        message.success('Thêm thẻ thành công!');
      }
      
      setIsModalOpen(false);
      form.resetFields();
    }).catch((info) => {
      console.log('Lỗi điền form:', info);
    });
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <span
          style={{
            display: 'inline-block', width: 16, height: 16,
            borderRadius: '50%', backgroundColor: color, marginRight: 8,
          }}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TagType) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEditClick(record)} 
          />
          <Popconfirm
            title={
                <div>
                    <div style={{ fontWeight: 'bold' }}>Xác nhận xóa</div>
                    <div>Bạn có chắc muốn xóa thẻ này?</div>
                </div>
            }
            onConfirm={() => {
                onDeleteTag(record.id);
                message.success('Đã xóa thẻ!');
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm thẻ mới
        </Button>
      </div>

      <Table
        dataSource={tags}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? "Sửa thẻ" : "Thêm thẻ mới"} 
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingTag ? "Cập nhật" : "Thêm mới"} 
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="Nhập tên thẻ" />
          </Form.Item>

          <Form.Item
            label="Màu sắc"
            name="color"
            rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
            initialValue="blue"
          >
            <Select placeholder="Chọn màu sắc">
              {colors.map((color) => (
                <Select.Option key={color} value={color}>
                  <span
                    style={{
                      display: 'inline-block', width: 12, height: 12,
                      borderRadius: '50%', backgroundColor: color, marginRight: 8,
                    }}
                  />
                  {color}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManager;