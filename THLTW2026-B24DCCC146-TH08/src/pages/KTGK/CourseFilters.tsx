import React from 'react';
import { Button, Card, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CourseStatus } from './types';


interface CourseFiltersProps {
  searchName: string;
  instructorFilter?: string;
  statusFilter?: CourseStatus;
  sortOrder?: 'asc' | 'desc'| 'vesc';
  instructorList: string[];
  onSearchNameChange: (value: string) => void;
  onInstructorFilterChange: (value?: string) => void;
  onStatusFilterChange: (value?: CourseStatus) => void;
  onSortOrderChange: (value?: 'asc' | 'desc'| 'vesc') => void;
  onOpenCreate: () => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchName,
  instructorFilter,
  statusFilter,
  sortOrder,
  instructorList,
  onSearchNameChange,
  onInstructorFilterChange,
  onStatusFilterChange,
  onSortOrderChange,
  onOpenCreate,
}) => (
  <Card style={{ marginBottom: 20 }}>
    <Space wrap>
      <Input
        allowClear
        value={searchName}
        onChange={(event) => onSearchNameChange(event.target.value)}
        placeholder="Tìm kiếm theo tên khóa học"
        prefix={<SearchOutlined />}
        style={{ minWidth: 260 }}
      />

      <Select
        allowClear
        placeholder="Lọc theo giảng viên"
        value={instructorFilter}
        onChange={(value) => onInstructorFilterChange(value)}
        style={{ width: 220 }}
      >
        <Select.Option value={undefined}>Lọc theo giảng viên </Select.Option>
        {instructorList.map((instructor) => (
          <Select.Option key={instructor} value={instructor}>
            {instructor}
          </Select.Option>
        ))}
      </Select>

      <Select
        allowClear
        placeholder="Lọc theo trạng thái"
        value={statusFilter}
        onChange={(value) => onStatusFilterChange(value as CourseStatus | undefined)}
        style={{ width: 200 }}
      >
        <Select.Option value={undefined}>Lọc theo trạng thái</Select.Option>
        {Object.values(CourseStatus).map((status) => (
          <Select.Option key={status} value={status}>
            {status}
          </Select.Option>
          
        ))}
      </Select>

      <Select
        allowClear
        placeholder="Sắp xếp theo số lượng học viên"
        value={sortOrder}
        onChange={(value) => onSortOrderChange(value as 'asc' | 'desc' |'vesc'| undefined)}
        style={{ width: 240 }}
      >
        <Select.Option value="vesc">Sắp xếp theo số lượng học viên</Select.Option>
        <Select.Option value="asc">Tăng dần</Select.Option>
        <Select.Option value="desc">Giảm dần</Select.Option>
        
      </Select>

      <Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreate}>
        Thêm khóa học
      </Button>
    </Space>
  </Card>
);

export default CourseFilters;
