import React from 'react';
import { Card, Avatar, Row, Col, Space, Button, Empty } from 'antd';
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { Author } from '../data';

interface AboutPageProps {
  author: Author | null;
}

const AboutPage: React.FC<AboutPageProps> = ({ author }) => {
  if (!author) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="Không tìm thấy thông tin tác giả" />
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    const iconProps = { style: { fontSize: 24 } };
    switch (platform) {
      case 'github':
        return <GithubOutlined {...iconProps} />;
      case 'twitter':
        return <TwitterOutlined {...iconProps} />;
      case 'linkedin':
        return <LinkedinOutlined {...iconProps} />;
      case 'facebook':
        return <FacebookOutlined {...iconProps} />;
      default:
        return null;
    }
  };

  const socialLinks = Object.entries(author.socialLinks).filter(
    ([, url]) => url
  );

  return (
    <div className="about-page">
      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card className="about-card">
            {/* Author Avatar */}
            <div className="author-avatar-section">
              <Avatar src={author.avatar} size={200} />
            </div>

            {/* Author Name */}
            <h1 className="author-name">{author.name}</h1>

            {/* Author Bio */}
            <div className="author-bio">
              <p>{author.bio}</p>
            </div>

            {/* Skills */}
            <div className="skills-section">
              <h3>Kỹ năng</h3>
              <div className="skills-list">
                {author.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="social-links-section">
                <h3>Kết nối</h3>
                <Space size="large">
                  {socialLinks.map(([platform, url]) => (
                    <Button
                      key={platform}
                      type="text"
                      size="large"
                      icon={getSocialIcon(platform)}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ))}
                </Space>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutPage;
