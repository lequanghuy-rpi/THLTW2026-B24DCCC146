import React, { useState } from 'react';
import { Card, Row, Col, Rate, Tag, Select, Space, Button } from 'antd';
import { Destination } from './type';

const { Meta } = Card;

interface Props { 
  destinations: Destination[];
  onAddToItinerary: (dest: Destination) => void;
}

const HomePage: React.FC<Props> = ({ destinations, onAddToItinerary }) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterPrice, setFilterPrice] = useState<string | null>(null);

  const filtered = destinations.filter(d => {
    const matchType = filterType ? d.type === filterType : true;
    const matchPrice = filterPrice ? d.priceLevel === filterPrice : true;
    return matchType && matchPrice;
  });

  return (
    <div>
      <Space style={{ marginBottom: 24 }} wrap>
        <Select placeholder="Lọc loại hình" style={{ width: 150 }} allowClear onChange={setFilterType}>
          <Select.Option value="biển">Biển</Select.Option>
          <Select.Option value="núi">Núi</Select.Option>
          <Select.Option value="thành phố">Thành phố</Select.Option>
        </Select>
        <Select placeholder="Lọc mức giá" style={{ width: 150 }} allowClear onChange={setFilterPrice}>
          <Select.Option value="rẻ">Rẻ</Select.Option>
          <Select.Option value="trung bình">Trung bình</Select.Option>
          <Select.Option value="cao">Cao</Select.Option>
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {filtered.map(dest => (
          <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
            <Card
              hoverable
              cover={<img alt={dest.name} src={dest.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[<Button type="primary" key="add" onClick={() => onAddToItinerary(dest)}>Thêm lịch trình</Button>]}
            >
              <Meta 
                title={dest.name} 
                description={
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{dest.type}</Tag>
                      <Tag color="green">{dest.priceLevel}</Tag>
                    </div>
                    <Rate disabled defaultValue={dest.rating} allowHalf style={{ fontSize: 14 }} />
                  </>
                } 
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;