import React from 'react';
import { Divider } from 'antd';
import Chart from 'react-apexcharts';
import type { Club, Registration } from '../types';

type Props = {
  clubs: Club[];
  registrations: Registration[];
};

const ReportsPanel: React.FC<Props> = ({ clubs, registrations }) => {
  const totalPending = registrations.filter((item) => item.status === 'Pending').length;
  const totalApproved = registrations.filter((item) => item.status === 'Approved').length;
  const totalRejected = registrations.filter((item) => item.status === 'Rejected').length;

  const chartSeries = [
    {
      name: 'Pending',
      data: clubs.map((club) => registrations.filter((item) => item.clubId === club.id && item.status === 'Pending').length),
    },
    {
      name: 'Approved',
      data: clubs.map((club) => registrations.filter((item) => item.clubId === club.id && item.status === 'Approved').length),
    },
    {
      name: 'Rejected',
      data: clubs.map((club) => registrations.filter((item) => item.clubId === club.id && item.status === 'Rejected').length),
    },
  ];

  const chartOptions: any = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: clubs.map((club) => club.name) },
    stroke: { curve: 'smooth' },
    legend: { position: 'top' },
    colors: ['#1890ff', '#52c41a', '#f5222d'],
    dataLabels: { enabled: false },
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, minWidth: 180 }}>
          <div style={{ color: '#8c8c8c' }}>Số CLB</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{clubs.length}</div>
        </div>
        <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, minWidth: 180 }}>
          <div style={{ color: '#8c8c8c' }}>Đơn Pending</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{totalPending}</div>
        </div>
        <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, minWidth: 180 }}>
          <div style={{ color: '#8c8c8c' }}>Đơn Approved</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{totalApproved}</div>
        </div>
        <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, minWidth: 180 }}>
          <div style={{ color: '#8c8c8c' }}>Đơn Rejected</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{totalRejected}</div>
        </div>
      </div>
      <Divider />
      <Chart options={chartOptions} series={chartSeries} type="bar" height={360} />
    </div>
  );
};

export default ReportsPanel;
