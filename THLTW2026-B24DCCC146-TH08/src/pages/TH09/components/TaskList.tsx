import React, { useState } from 'react';
import { Table, Input, Select, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Task } from '../types';

const { Search } = Input;
const { Option } = Select;

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'success';
      case 'In Progress':
        return 'processing';
      case 'To Do':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a: Task, b: Task) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return moment(a.deadline).valueOf() - moment(b.deadline).valueOf();
      },
      render: (deadline: string) => deadline ? moment(deadline).format('YYYY-MM-DD HH:mm') : '',
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm công việc"
          allowClear
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          defaultValue="All"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="All">Tất cả trạng thái</Option>
          <Option value="To Do">To Do</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
      </Space>
      <Table 
        columns={columns} 
        dataSource={filteredTasks} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TaskList;
