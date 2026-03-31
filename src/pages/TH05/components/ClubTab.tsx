import React from 'react';
import { Table, Button, Space, Avatar, Tag, Input, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import type { Club } from '../types';

type Props = {
  clubs: Club[];
  onCreate: () => void;
  onEdit: (club: Club) => void;
  onDelete: (club: Club) => void;
  onViewMembers: (clubId: string) => void;
};

const ClubTab: React.FC<Props> = ({ clubs, onCreate, onEdit, onDelete, onViewMembers }) => {
  const columns: ColumnsType<Club> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <Avatar src={avatar} size="large" />,
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên CLB..."
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">
              Tìm
            </Button>
            <Button onClick={() => clearFilters && clearFilters()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      sorter: (a, b) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
      key: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Có' : 'Không'}</Tag>,
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, club) => (
        <Space>
          <Button type="text" icon={<TeamOutlined />} onClick={() => onViewMembers(club.id)}>
            Thành viên
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(club)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa CLB này?"
            onConfirm={() => onDelete(club)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Thêm mới CLB
        </Button>
      </div>
      <Table columns={columns} dataSource={clubs} rowKey="id" pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ClubTab;
