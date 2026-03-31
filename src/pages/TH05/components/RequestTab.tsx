import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HistoryOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { Club, Registration } from '../types';
import { currentClubName } from '../utils';

type Props = {
  registrations: Registration[];
  clubs: Club[];
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  onCreate: () => void;
  onEdit: (request: Registration) => void;
  onDelete: (request: Registration) => void;
  onApprove: (keys: React.Key[]) => void;
  onReject: (keys: React.Key[]) => void;
  onOpenHistory: () => void;
};

const RequestTab: React.FC<Props> = ({
  registrations,
  clubs,
  selectedKeys,
  setSelectedKeys,
  onCreate,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onOpenHistory,
}) => {
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
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Registration['status']) => {
        const color = status === 'Pending' ? 'geekblue' : status === 'Approved' ? 'green' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => onEdit(record)}>
            Xem/Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa đơn đăng ký này?"
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
          {record.status === 'Pending' && (
            <>
              <Button type="link" onClick={() => onApprove([record.id])}>
                Duyệt
              </Button>
              <Button type="link" danger onClick={() => onReject([record.id])}>
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
    getCheckboxProps: (record: Registration) => ({ disabled: record.status !== 'Pending' }),
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Thêm đơn đăng ký
          </Button>
          <Button icon={<CheckOutlined />} disabled={!selectedKeys.length} onClick={() => onApprove(selectedKeys)}>
            Duyệt {selectedKeys.length ? `${selectedKeys.length} đơn` : ''}
          </Button>
          <Button danger icon={<CloseOutlined />} disabled={!selectedKeys.length} onClick={() => onReject(selectedKeys)}>
            Từ chối {selectedKeys.length ? `${selectedKeys.length} đơn` : ''}
          </Button>
          <Button icon={<HistoryOutlined />} onClick={onOpenHistory}>
            Xem lịch sử thao tác
          </Button>
        </Space>
        <div>
          <strong>Đang chọn: </strong> {selectedKeys.length}
        </div>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={registrations} rowKey="id" pagination={{ pageSize: 6 }} />
    </div>
  );
};

export default RequestTab;
