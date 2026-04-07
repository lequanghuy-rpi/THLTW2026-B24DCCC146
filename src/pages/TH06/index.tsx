import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { CompassOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import HomePage from './HomePage';
import ItineraryPage from './ItineraryPage';
import AdminPage from './AdminPage';
import { mockDestinations } from './data';
import { Destination, ItineraryItem } from './type';

const { Title } = Typography;

const TH06Page: React.FC = () => {
  const [destinations] = useState<Destination[]>(mockDestinations);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  const addToItinerary = (dest: Destination) => {
    const newItem: ItineraryItem = {
      ...dest,
      day: 1,
      order: itinerary.length
    };
    setItinerary([...itinerary, newItem]);
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Ứng dụng Lập kế hoạch Du lịch</Title>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane 
          key="1" 
          tab={<span><CompassOutlined /> Khám phá điểm đến</span>}
        >
          <HomePage destinations={destinations} onAddToItinerary={addToItinerary} />
        </Tabs.TabPane>

        <Tabs.TabPane 
          key="2" 
          tab={<span><CalendarOutlined /> Tạo & Quản lý Lịch trình</span>}
        >
          <ItineraryPage itinerary={itinerary} setItinerary={setItinerary} />
        </Tabs.TabPane>

        <Tabs.TabPane 
          key="3" 
          tab={<span><SettingOutlined /> Trang Quản trị</span>}
        >
          <AdminPage destinations={destinations} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TH06Page;