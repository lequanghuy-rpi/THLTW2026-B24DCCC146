

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt: string;
  imageUrl: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  status: 'draft' | 'published';
  tags: Tag[];
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export const mockTags: Tag[] = [
  { id: '1', name: 'React', color: 'blue' },
  { id: '2', name: 'TypeScript', color: 'cyan' },
  { id: '3', name: 'Web Development', color: 'purple' },
  { id: '4', name: 'Tutorial', color: 'green' },
  { id: '5', name: 'Tips & Tricks', color: 'orange' },
  { id: '6', name: 'Best Practices', color: 'red' },
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Bắt đầu với React Hooks',
    slug: 'bat-dau-voi-react-hooks',
    content: `# React Hooks - Hướng dẫn chi tiết

## Giới thiệu
React Hooks là một bổ sung mạnh mẽ cho React. Chúng cho phép bạn sử dụng state và các tính năng React khác mà không cần viết một class component.

## useState Hook
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook
\`\`\`jsx
useEffect(() => {
  // Side effect
}, [dependencies]);
\`\`\`

Hãy khám phá React Hooks để viết code React hiệu quả hơn!`,
    excerpt: 'React Hooks là một bổ sung mạnh mẽ cho React, cho phép sử dụng state và các tính năng khác mà không cần class component.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn A',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    viewCount: 245,
    status: 'published',
    tags: [mockTags[0], mockTags[1]],
  },
  {
    id: '2',
    title: 'TypeScript: Lợi ích và Cách sử dụng',
    slug: 'typescript-loi-ich-va-cach-su-dung',
    content: `# TypeScript cho người bắt đầu

TypeScript là một siêu tập của JavaScript...`,
    excerpt: 'Khám phá lợi ích của TypeScript và cách áp dụng nó vào dự án của bạn.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn B',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=80',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    viewCount: 189,
    status: 'published',
    tags: [mockTags[1], mockTags[3]],
  },
  {
    id: '3',
    title: '10 Tips để viết Clean Code',
    slug: '10-tips-de-viet-clean-code',
    content: `# Clean Code - Những quy tắc vàng

1. Đặt tên biến một cách rõ ràng
2. Hàm nên làm một việc duy nhất
3. Tránh lặp code...`,
    excerpt: '10 mẹo thiết thực để viết code sạch và dễ bảo trì.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500',
    author: 'Nguyễn Văn C',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=90',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    viewCount: 432,
    status: 'published',
    tags: [mockTags[5], mockTags[4]],
  },
  {
    id: '4',
    title: 'Tối ưu hiệu suất React App',
    slug: 'toi-uu-hieu-suat-react-app',
    content: `# Performance Optimization trong React

Các kỹ thuật để tối ưu hóa React application...`,
    excerpt: 'Học cách tối ưu hóa hiệu suất ứng dụng React của bạn.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn D',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=75',
    createdAt: '2023-12-28',
    updatedAt: '2023-12-28',
    viewCount: 567,
    status: 'published',
    tags: [mockTags[0], mockTags[5]],
  },
  {
    id: '5',
    title: 'REST API Design Patterns',
    slug: 'rest-api-design-patterns',
    content: `# RESTful API Design

Best practices cho REST API...`,
    excerpt: 'Những pattern tốt nhất trong thiết kế REST API.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500',
    author: 'Nguyễn Văn E',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=85',
    createdAt: '2023-12-20',
    updatedAt: '2023-12-20',
    viewCount: 312,
    status: 'published',
    tags: [mockTags[2], mockTags[5]],
  },
  {
    id: '6',
    title: 'Giới thiệu CSS Grid',
    slug: 'gioi-thieu-css-grid',
    content: `# CSS Grid Layout

Làm chủ CSS Grid...`,
    excerpt: 'Hướng dẫn hoàn chỉnh về CSS Grid Layout.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn F',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=80',
    createdAt: '2023-12-10',
    updatedAt: '2023-12-10',
    viewCount: 234,
    status: 'published',
    tags: [mockTags[2], mockTags[4]],
  },
  {
    id: '7',
    title: 'Testing React Components',
    slug: 'testing-react-components',
    content: `# Unit Testing trong React

Cách viết test cho React components...`,
    excerpt: 'Guide chi tiết về testing React components.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn G',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=70',
    createdAt: '2023-12-01',
    updatedAt: '2023-12-01',
    viewCount: 198,
    status: 'published',
    tags: [mockTags[0], mockTags[3]],
  },
  {
    id: '8',
    title: 'JavaScript Async/Await',
    slug: 'javascript-async-await',
    content: `# Async/Await trong JavaScript

Xử lý bất đồng bộ một cách dễ dàng...`,
    excerpt: 'Hiểu rõ về Async/Await trong JavaScript.',
    imageUrl: 'https://it.ctim.edu.vn/uploads/images/T11_2021/114212_Ngon-ngu-lap-trinh-la-gi-1.jpg',
    author: 'Nguyễn Văn H',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=75',
    createdAt: '2023-11-25',
    updatedAt: '2023-11-25',
    viewCount: 456,
    status: 'published',
    tags: [mockTags[1], mockTags[3]],
  },
  {
    id: '9',
    title: 'Docker cho Web Developer',
    slug: 'docker-cho-web-developer',
    content: `# Docker - Containerization

Bước đầu với Docker...`,
    excerpt: 'Học Docker từ cơ bản để triển khai ứng dụng web.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500',
    author: 'Nguyễn Văn I',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=80',
    createdAt: '2023-11-15',
    updatedAt: '2023-11-15',
    viewCount: 789,
    status: 'published',
    tags: [mockTags[2], mockTags[5]],
  },
  {
    id: '10',
    title: 'Bài viết nháp mẫu',
    slug: 'bai-viet-nhap-mau',
    content: `# Bài viết đang chỉnh sửa

Nội dung chưa hoàn chỉnh...`,
    excerpt: 'Đây là bài viết nháp chưa xuất bản.',
    imageUrl: 'https://images.unsplash.com/photo-1633356713697-d0b302dfe6a9?auto=format&fit=crop&w=500',
    author: 'Nguyễn Văn J',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&scale=85',
    createdAt: '2023-11-01',
    updatedAt: '2023-11-01',
    viewCount: 0,
    status: 'draft',
    tags: [mockTags[3]],
  },
];

export const mockAuthor: Author = {
  name: 'Nguyễn Văn A',
  avatar: 'https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj',
  bio: 'Full-stack developer với 5+ năm kinh nghiệm. Đam mê xây dựng những sản phẩm web chất lượng cao.',
  skills: ['React',' ', 'TypeScript',' ', 'Node.js',' ', 'Python',' ', 'JavaScript'],
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
  },
};
