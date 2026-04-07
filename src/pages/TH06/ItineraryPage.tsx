import React from 'react';
import { Row, Col, List, Button, Card, Alert, Progress } from 'antd';
import { DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import { ItineraryItem } from './type';

interface Props { 
  itinerary: ItineraryItem[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
}

const ItineraryPage: React.FC<Props> = ({ itinerary, setItinerary }) => {

  const budgetLimit = 3000000; 

  const totals = itinerary.reduce((acc, item) => {
    acc.food += item.costs.food;
    acc.transport += item.costs.transport;
    acc.lodging += item.costs.lodging;
    return acc;
  }, { food: 0, transport: 0, lodging: 0 });

  const totalSpent = totals.food + totals.transport + totals.lodging;
  const isOverBudget = totalSpent > budgetLimit;

  const removeDest = (id: string) => setItinerary(itinerary.filter(i => i.id !== id));

  const chartData = [
    { type: 'Ăn uống', value: totals.food },
    { type: 'Di chuyển', value: totals.transport },
    { type: 'Lưu trú', value: totals.lodging },
  ];

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={14}>
        <Card title="Các điểm đến đã chọn">
          <List
            itemLayout="horizontal"
            dataSource={itinerary}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button icon={<UpOutlined />} size="small" key="up" />,
                  <Button icon={<DownOutlined />} size="small" key="down" />,
                  <Button danger icon={<DeleteOutlined />} onClick={() => removeDest(item.id)} size="small" key="delete" />
                ]}
              >
                <List.Item.Meta
                  avatar={<img src={item.imageUrl} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />}
                  title={item.name}
                  description={`Chi phí ước tính: ${(item.costs.food + item.costs.transport + item.costs.lodging).toLocaleString()} VND`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} lg={10}>
        <Card title="Quản lý ngân sách">
          {isOverBudget && (
            <Alert message="Cảnh báo: Đã vượt ngân sách dự kiến!" type="error" showIcon style={{ marginBottom: 16 }} />
          )}
          <h4 style={{ marginBottom: 16 }}>Ngân sách cho phép: {budgetLimit.toLocaleString()} VND</h4>
          <Progress 
            percent={Math.min(Math.round((totalSpent / budgetLimit) * 100), 100)} 
            status={isOverBudget ? 'exception' : 'active'} 
            strokeColor={isOverBudget ? '#ff4d4f' : '#52c41a'}
          />
          <p style={{ marginTop: 8 }}>Đã tiêu: <strong>{totalSpent.toLocaleString()} VND</strong></p>
          
          <div style={{ height: 250, marginTop: 24 }}>
            <Pie data={chartData} angleField="value" colorField="type" radius={0.8} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ItineraryPage;