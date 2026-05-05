import React from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Club, Registration } from '../types';
import { currentClubName } from '../utils';

type Props = {
  members: Registration[];
  clubs: Club[];
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  onEdit: (member: Registration) => void;
  onOpenTransfer: () => void;
};

const MemberTab: React.FC<Props> = ({ members, clubs, selectedKeys, setSelectedKeys, onEdit, onOpenTransfer }) => {
  const columns: ColumnsType<Registration> = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'skill', key: 'skill' },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => currentClubName(clubs, clubId),
      filters: clubs.map((club) => ({ text: club.name, value: club.id })),
      onFilter: (value, record) => record.clubId === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => onEdit(record)}>
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Space wrap>
          <Button type="primary" onClick={onOpenTransfer} disabled={!selectedKeys.length}>
            Chuyển CLB {selectedKeys.length ? `${selectedKeys.length} thành viên` : ''}
          </Button>
        </Space>
        <div>
          <strong>Đang chọn: </strong> {selectedKeys.length}
        </div>
      </div>
      <Table rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }} columns={columns} dataSource={members} rowKey="id" pagination={{ pageSize: 6 }} />
    </div>
  );
};

export default MemberTab;
