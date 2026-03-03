import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Popconfirm } from 'antd';



const STORAGE_KEY = 'courseList';

const th01p2: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [mo, setmo]= useState(false);
  const [form]= Form.useForm();

  

  useEffect(() => setCourses(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')),[]);

  const capnhat = (dulieu: any[]) => {
    setCourses(dulieu)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dulieu));
    
  };

  const openModal = (course?: any) => {
    setEditing(course || null);
    course ? form.setFieldsValue(course):form.resetFields() ;
    setmo(true) };

  const handleSave = async () => {
    const values = await form.validateFields();
    const newData = editing
      ? courses.map((c: any) => (c.id === editing.id ? { ...c, ...values } : c))
      : [...courses, { id: Date.now().toString(), ...values }];
    
    capnhat(newData);
    setmo(false);

  };

  

  const columns = [
    { title: 'Tên môn', dataIndex: 'name' },
    { title: 'Tiến độ (h/target)', render: (text: any, record: any) => `${record.tgh}/${record.tgmt}` },
    {
      title: 'Trạng thái',render: (_: any, { tgh, tgmt}: any) => (tgh >= tgmt ? 'Hoàn thành' : 'Chưa hoàn thành'),
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <>
          <Button size="small" onClick={() => openModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa môn học?"
            onConfirm={() => capnhat(courses.filter((c: any)=> c.id !== record.id))}
          >
            <Button size="small" danger> Xóa </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card title="Quản lý môn học"> 
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Thêm môn học
      </Button>
      <Table rowKey="id" dataSource={courses} columns={columns} pagination={false} />
      <Modal visible={mo} title={editing ? 'Sửa môn' : 'Thêm môn'} onOk={handleSave} onCancel={() => setmo(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tgmt" label="Thời gian mục tiêu (h)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="tgh" label="Thời gian đã học (h)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default th01p2;
