import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Done') return false;
    if (!t.deadline) return false;
    return moment(t.deadline).isBefore(moment());
  }).length;

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card
            bordered={false}
            bodyStyle={{ padding: '16px' }}
            style={{
              background: '#e6f7ff',
              borderRadius: '8px',
            }}
          >
            <Statistic
              title={<span style={{ color: '#595959', fontSize: '14px' }}>Tổng số công việc</span>}
              value={totalTasks}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<UnorderedListOutlined style={{ color: '#1890ff', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            bodyStyle={{ padding: '16px' }}
            style={{
              background: '#f6ffed',
              borderRadius: '8px',
            }}
          >
            <Statistic
              title={<span style={{ color: '#595959', fontSize: '14px' }}>Đã hoàn thành</span>}
              value={completedTasks}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            bodyStyle={{ padding: '16px' }}
            style={{
              background: '#fff1f0',
              borderRadius: '8px',
            }}
          >
            <Statistic
              title={<span style={{ color: '#595959', fontSize: '14px' }}>Quá hạn</span>}
              value={overdueTasks}
              valueStyle={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: '#f5222d', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
