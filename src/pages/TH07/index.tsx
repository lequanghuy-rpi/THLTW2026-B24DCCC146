import React, { useState, } from 'react';
import {
  Tabs,
  Typography,
  Button,
  Affix,
} from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  BugOutlined,
} from '@ant-design/icons';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import AboutPage from './components/AboutPage';
import ManagementPage from './components/ManagementPage';
import { mockPosts, mockTags, mockAuthor, BlogPost, Tag, } from './data';

const { Title } = Typography;

type TabKey = 'home' | 'detail' | 'about' | 'management';

const TH07Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Handle post view - increment view count
  const handleViewPost = (post: BlogPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id ? { ...p, viewCount: p.viewCount + 1 } : p
      )
    );
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setActiveTab('detail');
  };

  const handleBackFromDetail = () => {
    setActiveTab('home');
    setSelectedPostId(null);
  };

  // Post CRUD operations
  const handleAddPost = (post: BlogPost) => {
    setPosts([post, ...posts]);
  };

  const handleUpdatePost = (post: BlogPost) => {
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Tag CRUD operations
  const handleAddTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const handleUpdateTag = (tag: Tag) => {
    setTags(tags.map((t) => (t.id === tag.id ? tag : t)));
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="th07-page">
      <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
        <div className="page-header">
          <Title level={2} style={{ marginBottom: 8 }}>
            Blog Cá nhân
          </Title>
          <p style={{ marginBottom: 0, color: '#666' }}>
            Chia sẻ những kiến thức và kinh nghiệm lập trình
          </p>
        </div>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)}>
          <Tabs.TabPane
            key="home"
            tab={
              <span>
                <HomeOutlined /> Trang chủ
              </span>
            }
          >
            <HomePage
              posts={posts}
              tags={tags}
              onPostClick={handlePostClick}
              onViewPost={handleViewPost}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="detail"
            tab={
              <span>
                <FileTextOutlined /> Chi tiết
              </span>
            }
          >
            <DetailPage
              posts={posts}
              tags={tags}
              currentPostId={selectedPostId}
              onBack={handleBackFromDetail}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="about"
            tab={
              <span>
                <UserOutlined /> Về tôi
              </span>
            }
          >
            <AboutPage author={mockAuthor} />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="management"
            tab={
              <span>
                <SettingOutlined /> Quản lý
              </span>
            }
          >
            <ManagementPage
              posts={posts}
              tags={tags}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onAddTag={handleAddTag}
              onUpdateTag={handleUpdateTag}
              onDeleteTag={handleDeleteTag}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* Quick action buttons */}
      <Affix style={{ bottom: 50, right: 50 }}>
        <Button
          type="primary"
          shape="circle"
          icon={<BugOutlined />}
          size="large"
          title={`${posts.filter((p) => p.status === 'draft').length} bài nháp`}
          onClick={() => setActiveTab('management')}
        />
      </Affix>
    </div>
  );
};

export default TH07Page;
