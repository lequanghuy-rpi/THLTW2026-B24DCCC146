import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Avatar,
  Tag,
  Empty,
  Divider,
  Space,
  Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { BlogPost, Tag as TagType } from '../data';
import { formatDate, getRelatedPosts } from '../utils/helpers';

interface DetailPageProps {
  posts: BlogPost[];
  tags: TagType[];
  currentPostId: string | null;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({
  posts,
  tags,
  currentPostId,
  onBack,
}) => {
  const currentPost = posts.find((p) => p.id === currentPostId);
  const [viewCount, setViewCount] = useState(currentPost?.viewCount || 0);

  useEffect(() => {
    if (currentPost) {
      setViewCount(currentPost.viewCount + 1);
    }
  }, [currentPostId, currentPost]);

  if (!currentPost) {
    return (
      <div style={{ padding: 24 }}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ marginBottom: 24 }}
        >
          Quay lại
        </Button>
        <Empty description="Không tìm thấy bài viết" />
      </div>
    );
  }

  const relatedPosts = currentPostId ? getRelatedPosts(posts, currentPostId) : [];

  return (
    <div className="detail-page">
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>

      <Card className="post-detail-card">
        {/* Post Image */}
        <div className="post-image">
          <img alt={currentPost.title} src={currentPost.imageUrl} />
        </div>

        {/* Post Header */}
        <div className="post-header">
          <h1 className="post-title">{currentPost.title}</h1>

          <div className="post-info">
            <Space split={<Divider type="vertical" />}>
              <Tooltip title="Tác giả">
                <span>
                  <Avatar src={currentPost.authorAvatar} />
                  {currentPost.author}
                </span>
              </Tooltip>
              <Tooltip title="Ngày đăng">
                <span>
                  <CalendarOutlined /> {formatDate(currentPost.createdAt)}
                </span>
              </Tooltip>
              <Tooltip title="Số lượt xem">
                <span>
                  <EyeOutlined /> {viewCount} lượt xem
                </span>
              </Tooltip>
            </Space>
          </div>

          {/* Tags */}
          <div className="post-tags">
            {currentPost.tags.map((tag) => (
              <Tag key={tag.id} color={tag.color}>
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>

        <Divider />

        {/* Post Content */}
        <div className="post-content">
          <MarkdownRenderer content={currentPost.content} />
        </div>

        <Divider />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="related-posts-section">
            <h3>Bài viết liên quan</h3>
            <Row gutter={[16, 16]}>
              {relatedPosts.map((post) => (
                <Col key={post.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    size="small"
                    cover={
                      <img
                        alt={post.title}
                        src={post.imageUrl}
                        height={150}
                        style={{ objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <span className="related-title">{post.title}</span>
                      }
                      description={
                        <small>{formatDate(post.createdAt)}</small>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Simple Markdown Renderer - converts markdown to HTML
 */
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    let html = text;

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(
      /```(.*?)\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>'
    );

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default DetailPage;
