import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Tag,
  Empty,
  Pagination,
  Space,
  Avatar,
  Button,
  Tooltip,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogPost, Tag as TagType } from '../data';
import { searchPosts, filterByTags, debounce, formatDate } from '../utils/helpers';

interface HomePageProps {
  posts: BlogPost[];
  tags: TagType[];
  onPostClick: (id: string) => void;
  onViewPost: (post: BlogPost) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  posts,
  tags,
  onPostClick,
  onViewPost,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const publishedPosts = useMemo(
    () => posts.filter((p) => p.status === 'published'),
    [posts]
  );

  // Filter and search
  const filteredPosts = useMemo(() => {
    let result = publishedPosts;
    result = searchPosts(result, searchKeyword);
    result = filterByTags(result, selectedTags);
    return result;
  }, [publishedPosts, searchKeyword, selectedTags]);

  // Pagination
  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIdx, startIdx + pageSize);
  }, [filteredPosts, currentPage]);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchKeyword(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setCurrentPage(1);
  };

  const handleViewPost = (post: BlogPost) => {
    onViewPost(post);
    onPostClick(post.id);
  };

  return (
    <div className="home-page">
      {/* Search Bar */}
      <div className="search-section">
        <Input
          placeholder="Tìm kiếm bài viết..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="large"
          allowClear
        />
      </div>

      {/* Tag Filter */}
      <div className="tag-filter-section">
        <span className="tag-label">Lọc theo thẻ:</span>
        <Space wrap>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              color={selectedTags.includes(tag.id) ? tag.color : 'default'}
              onClick={() => toggleTag(tag.id)}
              style={{ cursor: 'pointer', padding: '4px 8px' }}
            >
              {tag.name}
            </Tag>
          ))}
        </Space>
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length === 0 ? (
        <Empty description="Không tìm thấy bài viết" />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {paginatedPosts.map((post) => (
              <Col key={post.id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    <img alt={post.title} src={post.imageUrl} height={200} />
                  }
                  className="post-card"
                >
                  <Card.Meta
                    avatar={<Avatar src={post.authorAvatar} />}
                    title={
                      <span
                        onClick={() => handleViewPost(post)}
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                      >
                        {post.title}
                      </span>
                    }
                    description={
                      <div>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-meta">
                          <small>{post.author}</small>
                          <small>{formatDate(post.createdAt)}</small>
                        </div>
                        <div className="post-tags">
                          {post.tags.map((tag) => (
                            <Tag key={tag.id} color={tag.color}>
                              {tag.name}
                            </Tag>
                          ))}
                        </div>
                        <div className="post-footer">
                          <Tooltip title="Số lượt xem">
                            <span>
                              <EyeOutlined /> {post.viewCount}
                            </span>
                          </Tooltip>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleViewPost(post)}
                          >
                            Đọc tiếp
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="pagination-section">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPosts.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
