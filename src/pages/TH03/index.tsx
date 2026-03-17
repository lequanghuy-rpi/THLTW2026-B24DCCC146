import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker, Rate, message } from 'antd';
import axios from 'axios';
import { Employee, Service, Appointment, Rating } from '../../models/repair';

const { TabPane } = Tabs;
const { Option } = Select;

const th03: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [empModal, setEmpModal] = useState(false);
  const [servModal, setServModal] = useState(false);
  const [appModal, setAppModal] = useState(false);
  const [ratModal, setRatModal] = useState(false);
  const [currentApp, setCurrentApp] = useState('');

  const [empForm] = Form.useForm();
  const [servForm] = Form.useForm();
  const [appForm] = Form.useForm();
  const [ratForm] = Form.useForm();

  const fetchData = async () => {
    try {
      const [emps, servs, apps, rats] = await Promise.all([
        axios.get('/api/repair/employees').then(res => res.data),
        axios.get('/api/repair/services').then(res => res.data),
        axios.get('/api/repair/appointments').then(res => res.data),
        axios.get('/api/repair/ratings').then(res => res.data),
      ]);
      setEmployees(emps);
      setServices(servs);
      setAppointments(apps);
      setRatings(rats);
    } catch {
      
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (endpoint: string, id: string) => {
    try {
      await axios.delete(`/api/repair/${endpoint}/${id}`);
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(`/api/repair/appointments/${id}`, { status });
      fetchData();
    } catch {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleEmpSubmit = async () => {
    try {
      const values = await empForm.validateFields();
      await axios.post('/api/repair/employees', values);
      setEmpModal(false);
      fetchData();
    } catch {
      message.error('Thêm nhân viên thất bại');
    }
  };

  const handleServSubmit = async () => {
    try {
      const values = await servForm.validateFields();
      await axios.post('/api/repair/services', values);
      setServModal(false);
      fetchData();
    } catch {
      message.error('Thêm dịch vụ thất bại');
    }
  };

  const handleAppSubmit = async () => {
    try {
      const values = await appForm.validateFields();
      const data = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
      };
      await axios.post('/api/repair/appointments', data);
      setAppModal(false);
      fetchData();
    } catch {
      message.error('Đặt lịch thất bại');
    }
  };

  const handleRatSubmit = async () => {
    try {
      const values = await ratForm.validateFields();
      await axios.post('/api/repair/ratings', { ...values, appointmentId: currentApp });
      setRatModal(false);
      fetchData();
    } catch {
      message.error('Thêm đánh giá thất bại');
    }
  };

  const empColumns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Khách tối đa/Ngày', dataIndex: 'maxCustomersPerDay' },
    { title: 'Lịch trình', dataIndex: 'schedule' },
    { title: 'Hành động', render: (record: Employee) => <Button danger onClick={() => handleDelete('employees', record.id)}>Xóa</Button> },
  ];

  const servColumns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price', render: (p: number) => `${p} VND` },
    { title: 'Thời gian (phút)', dataIndex: 'duration' },
    { title: 'Hành động', render: (record: Service) => <Button danger onClick={() => handleDelete('services', record.id)}>Xóa</Button> },
  ];

  const appColumns = [
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Nhân viên', dataIndex: 'employeeId', render: (id: string) => employees.find(e => e.id === id)?.name },
    { title: 'Dịch vụ', dataIndex: 'serviceId', render: (id: string) => services.find(s => s.id === id)?.name },
    { title: 'Ngày', dataIndex: 'date' },
    { title: 'Giờ', dataIndex: 'time' },
    { title: 'Trạng thái', render: (record: Appointment) => (
      <Select value={record.status} onChange={(v) => handleStatusChange(record.id, v)}>
        <Option value="pending">Chờ xử lý</Option>
        <Option value="confirmed">Đã xác nhận</Option>
        <Option value="completed">Hoàn thành</Option>
        <Option value="cancelled">Đã hủy</Option>
      </Select>
    )},
  ];

  const ratColumns = [
    { title: 'Khách hàng', render: (record: Rating) => appointments.find(a => a.id === record.appointmentId)?.customerName },
    { title: 'Điểm', dataIndex: 'rating', render: (r: number) => <Rate disabled defaultValue={r} /> },
    { title: 'Bình luận', dataIndex: 'comment' },
  ];

  const completedApps = appointments.filter(a => a.status === 'completed');
  const revenue = completedApps.reduce((sum, a) => sum + (services.find(s => s.id === a.serviceId)?.price || 0), 0);
  const avgRating = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Dịch vụ Sửa chữa</h2>
      <Tabs defaultActiveKey="1">
        
        <TabPane tab="Nhân viên" key="1">
          <Button type="primary" onClick={() => { empForm.resetFields(); setEmpModal(true); }}>Thêm Nhân viên</Button>
          <Table columns={empColumns} dataSource={employees} rowKey="id" style={{ marginTop: 16 }} />
          <Modal title="Thêm Nhân viên" visible={empModal} onOk={handleEmpSubmit} onCancel={() => setEmpModal(false)}>
            <Form form={empForm} layout="vertical">
              <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="maxCustomersPerDay" label="Khách tối đa/Ngày" rules={[{ required: true }]}><InputNumber /></Form.Item>
              <Form.Item name="schedule" label="Lịch trình" rules={[{ required: true }]}><Input /></Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Dịch vụ" key="2">
          <Button type="primary" onClick={() => { servForm.resetFields(); setServModal(true); }}>Thêm Dịch vụ</Button>
          <Table columns={servColumns} dataSource={services} rowKey="id" style={{ marginTop: 16 }} />
          <Modal title="Thêm Dịch vụ" visible={servModal} onOk={handleServSubmit} onCancel={() => setServModal(false)}>
            <Form form={servForm} layout="vertical">
              <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber /></Form.Item>
              <Form.Item name="duration" label="Thời lượng" rules={[{ required: true }]}><InputNumber /></Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Lịch hẹn" key="3">
          <Button type="primary" onClick={() => { appForm.resetFields(); setAppModal(true); }}>Đặt lịch hẹn</Button>
          <Table columns={appColumns} dataSource={appointments} rowKey="id" style={{ marginTop: 16 }} />
          <Modal title="Đặt lịch hẹn" visible={appModal} onOk={handleAppSubmit} onCancel={() => setAppModal(false)}>
            <Form form={appForm} layout="vertical">
              <Form.Item name="customerName" label="Khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
                <Select>{employees.map(e => <Option key={e.id} value={e.id}>{e.name}</Option>)}</Select>
              </Form.Item>
              <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
                <Select>{services.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}</Select>
              </Form.Item>
              <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker /></Form.Item>
              <Form.Item name="time" label="Giờ" rules={[{ required: true }]}><TimePicker format="HH:mm" /></Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Đánh giá" key="4">
          <div style={{ marginBottom: 16 }}>
            {completedApps.filter(a => !ratings.find(r => r.appointmentId === a.id)).map(a => (
              <Button key={a.id} onClick={() => { setCurrentApp(a.id); ratForm.resetFields(); setRatModal(true); }} style={{ marginRight: 8 }}>
                Đánh giá {a.customerName}
              </Button>
            ))}
          </div>
          <Table columns={ratColumns} dataSource={ratings} rowKey="id" />
          <Modal title="Thêm Đánh giá" visible={ratModal} onOk={handleRatSubmit} onCancel={() => setRatModal(false)}>
            <Form form={ratForm} layout="vertical">
              <Form.Item name="rating" label="Điểm" rules={[{ required: true }]}><Rate /></Form.Item>
              <Form.Item name="comment" label="Bình luận" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Thống kê" key="5">
          <div style={{ fontSize: '16px', lineHeight: '2' }}>
            <p><strong>Tổng số lịch hẹn:</strong> {appointments.length}</p>
            <p><strong>Đã hoàn thành:</strong> {completedApps.length}</p>
            <p><strong>Doanh thu:</strong> {revenue.toLocaleString()} VND</p>
            <p><strong>Điểm đánh giá trung bình:</strong> {avgRating.toFixed(1)} / 5</p>
          </div>
        </TabPane>

      </Tabs>
    </div>
  );
};

export default th03;