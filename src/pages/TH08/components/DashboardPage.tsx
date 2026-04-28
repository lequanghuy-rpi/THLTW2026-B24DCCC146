import React, { useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Timeline,
  Tag,
} from 'antd';
import {
  FireOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  Workout,
  HealthMetric,
  Goal,
  calculateBMI,
  getBMICategory,
  formatDate,
} from '../data';

// Simple bar chart component
const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: 150, gap: 8, padding: '10px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              height: (item.value / maxValue) * 100,
              width: '100%',
              background: '#1890ff',
              borderRadius: '4px 4px 0 0',
              minHeight: 4,
            }}
          />
          <div style={{ fontSize: 10, marginTop: 4 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Simple line chart component
const LineChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 1);
  const range = maxValue - minValue || 1;

  return (
    <div style={{ position: 'relative', height: 150, padding: '10px 0' }}>
      <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#52c41a"
          strokeWidth="2"
          points={data
            .map((item, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 120 - ((item.value - minValue) / range) * 100;
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 400;
          const y = 120 - ((item.value - minValue) / range) * 100;
          return (
            <circle key={index} cx={x} cy={y} r="4" fill="#52c41a" />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {data.map((item, index) => (
          <div key={index} style={{ fontSize: 10 }}>{item.label}</div>
        ))}
      </div>
    </div>
  );
};

interface DashboardPageProps {
  workouts: Workout[];
  healthMetrics: HealthMetric[];
  goals: Goal[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  workouts,
  healthMetrics,
  goals,
}) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Total workouts in current month
    const monthlyWorkouts = workouts.filter((w) => {
      const date = new Date(w.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && w.status === 'completed';
    });
    const totalWorkouts = monthlyWorkouts.length;

    // Total calories burned
    const totalCalories = monthlyWorkouts.reduce((sum, w) => sum + w.calories, 0);

    // Calculate streak (consecutive days with workouts)
    let streak = 0;
    const sortedDates = [...new Set(workouts.filter(w => w.status === 'completed').map(w => w.date))].sort().reverse();
    if (sortedDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      let checkDate = new Date(today);
      for (const date of sortedDates) {
        const checkDateStr = checkDate.toISOString().split('T')[0];
        if (sortedDates.includes(checkDateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Goals completion percentage
    const activeGoals = goals.filter((g) => g.status === 'active');
    const avgCompletion = activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.currentValue / g.targetValue) * 100, 0) / activeGoals.length)
      : 0;

    return { totalWorkouts, totalCalories, streak, avgCompletion };
  }, [workouts, goals]);

  // Weekly workout data for bar chart
  const weeklyData = useMemo(() => {
    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const now = new Date();
    const currentMonth = now.getMonth();
    
    return weeks.map((week, index) => {
      const weekStart = new Date(now.getFullYear(), currentMonth, index * 7 + 1);
      const weekEnd = new Date(now.getFullYear(), currentMonth, (index + 1) * 7);
      const count = workouts.filter((w) => {
        const date = new Date(w.date);
        return date >= weekStart && date <= weekEnd && w.status === 'completed';
      }).length;
      return { label: week, value: count };
    });
  }, [workouts]);

  // Weight data for line chart
  const weightData = useMemo(() => {
    return healthMetrics
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((m) => ({
        label: formatDate(m.date).split('/')[0] + '/' + formatDate(m.date).split('/')[1],
        value: m.weight,
      }));
  }, [healthMetrics]);

  // Recent workouts for timeline
  const recentWorkouts = useMemo(() => {
    return [...workouts]
      .filter((w) => w.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [workouts]);

  const timelineColumns: ColumnsType<Workout> = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} phút`,
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
      key: 'calories',
      render: (calories) => <span style={{ color: '#ff4d4f' }}>{calories} kcal</span>,
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng buổi tập (tháng)"
              value={stats.totalWorkouts}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng calo đốt"
              value={stats.totalCalories}
              suffix="kcal"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ngày tập liên tiếp"
              value={stats.streak}
              prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
              suffix="ngày"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Mục tiêu hoàn thành"
              value={stats.avgCompletion}
              prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Số buổi tập theo tuần" bordered={false} style={{ background: '#fafafa' }}>
            <BarChart data={weeklyData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cân nặng theo thời gian" bordered={false} style={{ background: '#fafafa' }}>
            {weightData.length > 0 ? (
              <LineChart data={weightData} />
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                Chưa có dữ liệu cân nặng
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Workouts Timeline */}
      <Card title="📅 5 Buổi tập gần nhất" bordered={false}>
        <Table
          dataSource={recentWorkouts}
          columns={timelineColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DashboardPage;