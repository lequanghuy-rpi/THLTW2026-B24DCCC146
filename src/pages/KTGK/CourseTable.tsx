import React from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Course, CourseStatus } from './types';

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'ID khóa học',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      sorter: (a: Course, b: Course) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: CourseStatus) => {
        const color =
          value === CourseStatus.DangMo
            ? 'green'
            : value === CourseStatus.DaKetThuc
            ? 'blue'
            : 'orange';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      render: (_: any, record: Course) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa khóa học này?"
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={courses}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 8 }}
      bordered
    />
  );
};

export default CourseTable;
