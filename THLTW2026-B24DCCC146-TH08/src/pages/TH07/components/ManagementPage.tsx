import React, { useState, useMemo } from 'react';

import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Popconfirm,
  Tag,
  Tabs,
  Empty,
  message,
  Row,
  Col,
  FormInstance,
  
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { BlogPost, Tag as TagType } from '../data';
import { filterByStatus, formatDate, generateSlug } from '../utils/helpers';
import TagManager from './TagManager';
const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

interface ManagementPageProps {
  posts: BlogPost[];
  tags: TagType[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onAddTag: (tag: TagType) => void;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (id: string) => void;
}

const ManagementPage: React.FC<ManagementPageProps> = ({
  posts,
  tags,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form] = Form.useForm();

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (searchTitle) {
      result = result.filter((post) =>
        post.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (filterStatus) {
      result = filterByStatus(result, filterStatus);
    }
    return result;
  }, [posts, searchTitle, filterStatus]);

  const handlePostSubmit = (values: any) => {
    if (editingPost) {
      const updatedPost: BlogPost = {
        ...editingPost,
        ...values,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdatePost(updatedPost);
      message.success('Cập nhật bài viết thành công!');
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...values,
        slug: generateSlug(values.title),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        viewCount: 0,
      };
      onAddPost(newPost);
      message.success('Thêm bài viết thành công!');
    }
    resetPostForm();
  };

  const resetPostForm = () => {
    form.resetFields();
    setIsPostModalVisible(false);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    form.setFieldsValue(post);
    setIsPostModalVisible(true);
  };

  const handleDeletePost = (id: string) => {
    onDeletePost(id);
    message.success('Xóa bài viết thành công!');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => {
        const color = status === 'published' ? 'green' : 'orange';
        const text = status === 'published' ? 'Đã đăng' : 'Nháp';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: '20%',
      render: (tags: TagType[]) => (
        <Space size="small">
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.name}
            </Tag>
          ))}
          {tags.length > 2 && <span>+{tags.length - 2}</span>}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '10%',
      sorter: (a: BlogPost, b: BlogPost) => a.viewCount - b.viewCount,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => formatDate(date),
      sorter: (a: BlogPost, b: BlogPost) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      render: (_: any, record: BlogPost) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPost(record)}
          />
          <Popconfirm
            title={
                <div>
                    <div style={{ fontWeight: 'bold' }}>Xác nhận xóa</div>
                    <div>Bạn có chắc muốn xóa bài viết này?</div>
                </div>
            }
            
            onConfirm={() => handleDeletePost(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="management-page">
      <Tabs defaultActiveKey="1">
        {/* Posts Management Tab */}
        <Tabs.TabPane key="1" tab="Quản lý bài viết">
          <Card>
            {/* Toolbar */}
            <div className="toolbar">
              <Space>
                <Input
                  placeholder="Tìm kiếm theo tiêu đề..."
                  prefix={<SearchOutlined />}
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  placeholder="Lọc theo trạng thái"
                  style={{ width: 180 }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  allowClear
                >
                  <Select.Option value="draft">Nháp</Select.Option>
                  <Select.Option value="published">Đã đăng</Select.Option>
                </Select>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingPost(null);
                    form.resetFields();
                    setIsPostModalVisible(true);
                  }}
                >
                  Thêm bài viết
                </Button>
              </Space>
            </div>

            {filteredPosts.length === 0 ? (
              <Empty description="Không có bài viết nào" />
            ) : (
              <Table
                dataSource={filteredPosts}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane key="2" tab="Quản lý thẻ">
          <Card>
            <TagManager
              tags={tags}
              onAddTag={onAddTag}
              onUpdateTag={onUpdateTag}
              onDeleteTag={onDeleteTag}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={isPostModalVisible}
        onCancel={resetPostForm}
        footer={null}
        width={800}
      >
        <PostFormContent
          form={form}
          tags={tags}
          initialValues={editingPost || undefined}
          onSubmit={handlePostSubmit}
          onCancel={resetPostForm}
        />
      </Modal>
    </div>
  );
};

interface PostFormContentProps {
  form: FormInstance;
  tags: TagType[];
  initialValues?: BlogPost;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const PostFormContent: React.FC<PostFormContentProps> = ({
  form,
  tags,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const handleFinish = (values: any) => {
    const selectedTags = tags.filter((tag) =>
      (values.tags || []).includes(tag.id)
    );
    onSubmit({
      ...values,
      tags: selectedTags,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              tags: initialValues.tags.map((tag) => tag.id),
            }
          : undefined
      }
    >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="Slug của bài viết" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Tóm tắt"
        name="excerpt"
        rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập tóm tắt bài viết" />
      </Form.Item>

      <Form.Item
        label="Nội dung (Markdown)"
        name="content"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
      >
        <Input.TextArea
          rows={10}
          placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Ảnh đại diện (URL)"
            name="imageUrl"
            rules={[
              { required: true, message: 'Vui lòng nhập URL ảnh' },
              { type: 'url', message: 'Vui lòng nhập URL hợp lệ' },
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Tác giả"
            name="author"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
          >
            <Input placeholder="Tên tác giả" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Thẻ"
            name="tags"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}
          >
            <Select mode="multiple" placeholder="Chọn thẻ cho bài viết">
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            initialValue="draft"
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="draft">Nháp</Select.Option>
              <Select.Option value="published">Đã đăng</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

interface TagManagerProps {
  tags: TagType[];
  onAddTag: (tag: TagType) => void;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (id: string) => void;
}

const TagManagerContent: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();

  const handleAddTag = (values: any) => {
    if (editingTag) {
      onUpdateTag({ ...editingTag, ...values });
      message.success('Cập nhật thẻ thành công!');
    } else {
      const newTag: TagType = {
        id: Date.now().toString(),
        ...values,
      };
      onAddTag(newTag);
      message.success('Thêm thẻ thành công!');
    }
    resetForm();
  };

  const resetForm = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingTag(null);
  };

  const handleEditTag = (tag: TagType) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setIsModalVisible(true);
  };

  const handleDeleteTag = (id: string) => {
    onDeleteTag(id);
    message.success('Xóa thẻ thành công!');
  };

  const getTagUsageCount = (tagId: string) => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: '30%',
      render: (color: string) => (
        <span
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            marginRight: 8,
          }}
        />
      ),
    },
    {
      title: 'Số bài viết',
      key: 'usageCount',
      width: '20%',
      render: (_: any, record: TagType) => getTagUsageCount(record.id),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      render: (_: any, record: TagType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTag(record)}
          />
          <Popconfirm
            title={
              <div>
                <div style={{ fontWeight: 'bold' }}>Xác nhận xóa</div>
                <div>Bạn có chắc muốn xóa thẻ này?</div>
              </div>
            }
            onConfirm={() => handleDeleteTag(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTag(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm thẻ mới
        </Button>
      </div>

      <Table
        dataSource={tags}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={isModalVisible}
        onCancel={resetForm}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTag}>
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="Nhập tên thẻ" />
          </Form.Item>

          <Form.Item
            label="Màu sắc"
            name="color"
            rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
            initialValue="blue"
          >
            <Select placeholder="Chọn màu sắc">
              {colors.map((color) => (
                <Select.Option key={color} value={color}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: color,
                      marginRight: 8,
                    }}
                  />
                  {color}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTag ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={resetForm}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementPage;
