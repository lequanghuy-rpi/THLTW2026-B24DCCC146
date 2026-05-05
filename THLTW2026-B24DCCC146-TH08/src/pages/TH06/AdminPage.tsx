import React from 'react';
import { Tabs, Table, Button, Space, Card } from 'antd';
import { Column } from '@ant-design/plots';
import { Destination } from './type';

interface Props { 
  destinations: Destination[];
}

const AdminPage: React.FC<Props> = ({ destinations }) => {
  const columns = [
    { title: 'Tên địa điểm', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Mức giá', dataIndex: 'priceLevel', key: 'priceLevel' },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">Sửa</Button>
          <Button type="link" danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  const statsData = [
    { month: 'Tháng 1', count: 120 },
    { month: 'Tháng 2', count: 200 },
    { month: 'Tháng 3', count: 150 },
    { month: 'Tháng 4', count: 320 },
  ];

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Quản lý điểm đến" key="1">
          <Button type="primary" style={{ marginBottom: 16 }}>+ Thêm điểm đến mới</Button>
          <Table dataSource={destinations} columns={columns} rowKey="id" scroll={{ x: 600 }} />
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Thống kê hệ thống" key="2">
          <h3>Số lượt lịch trình được tạo theo tháng</h3>
          <div style={{ height: 350, marginTop: 24 }}>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default AdminPage;