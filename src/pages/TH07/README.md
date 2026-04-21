# 📝 TH07 - Blog Cá nhân

## 📋 Mô tả dự án

Ứng dụng Blog cá nhân cho phép người dùng viết bài, quản lý nội dung và đọc các bài viết. Ứng dụng được xây dựng với React, TypeScript và Ant Design.

## ✨ Tính năng chính

### 1. **Trang chủ (Home)**
- 📸 Hiển thị danh sách bài viết dưới dạng **Card** với:
  - Ảnh đại diện
  - Tiêu đề bài viết
  - Tóm tắt nội dung
  - Ngày đăng
  - Tác giả
  - Thẻ (tags)
  - Số lượt xem
  - Nút "Đọc tiếp"

- 🔍 **Tìm kiếm** bài viết với debounce 300ms
  - Tìm kiếm theo tiêu đề, tóm tắt, nội dung
  
- 🏷️ **Lọc theo thẻ**
  - Nhấp vào thẻ để lọc bài viết
  - Hỗ trợ lọc đa thẻ

- 📄 **Phân trang (Pagination)**
  - Hiển thị 9 bài viết mỗi trang

### 2. **Trang chi tiết bài viết (Detail)**
- 📖 Hiển thị **toàn bộ nội dung** bài viết (hỗ trợ Markdown)
- 👤 Thông tin tác giả: ảnh, tên, ngày đăng
- 🏷️ Danh sách thẻ của bài viết
- 👁️ **Số lượt xem** tự động tăng mỗi lần truy cập
- 🔗 **Bài viết liên quan** (cùng thẻ, trừ bài đang xem)
- ⬅️ Nút quay lại danh sách

### 3. **Trang giới thiệu (About)**
- 👤 Ảnh đại diện tác giả
- 📝 Tên và tiểu sử
- 🛠️ Danh sách kỹ năng
- 🔗 Liên kết mạng xã hội (GitHub, Twitter, LinkedIn, Facebook)

### 4. **Quản lý bài viết (Management)**
- 📊 **Bảng danh sách** bài viết với:
  - Tiêu đề
  - Trạng thái (Nháp / Đã đăng)
  - Thẻ
  - Lượt xem
  - Ngày tạo
  - Nút sửa/xóa

- 🔍 **Tìm kiếm** theo tiêu đề
- 🔎 **Lọc** theo trạng thái

- ➕ **Thêm bài viết mới**: Modal form với các trường:
  - Tiêu đề *
  - Slug *
  - Tóm tắt (Excerpt) *
  - Nội dung (Markdown) *
  - Ảnh đại diện (URL) *
  - Tác giả *
  - Thẻ *
  - Trạng thái *

- ✏️ **Sửa bài viết**: Form điền sẵn thông tin cũ

- 🗑️ **Xóa bài viết**: Popconfirm xác nhận trước khi xóa

### 5. **Quản lý thẻ (Tags)**
- 📋 Danh sách thẻ với:
  - Tên thẻ
  - Màu sắc
  - Số bài viết đang sử dụng

- ➕ **Thêm thẻ mới** (Modal)
- ✏️ **Sửa thẻ** (Modal)
- 🗑️ **Xóa thẻ** (Popconfirm)

## 📁 Cấu trúc thư mục (Simplified)

```
src/pages/TH07/
├── components/
│   ├── HomePage.tsx         # Trang chủ - hiển thị danh sách bài
│   ├── HomePage.less        # Style cho trang chủ
│   ├── DetailPage.tsx       # Trang chi tiết bài viết
│   ├── DetailPage.less      # Style cho trang chi tiết
│   ├── AboutPage.tsx        # Trang giới thiệu tác giả
│   ├── AboutPage.less       # Style cho trang giới thiệu
│   ├── ManagementPage.tsx   # Quản lý bài viết & thẻ (gộp PostForm + TagManager)
│   └── ManagementPage.less  # Style cho trang quản lý
├── utils/
│   └── helpers.ts           # Các hàm tiện ích (search, filter, debounce...)
├── data.ts                  # Type definitions + Mock data
├── index.tsx                # Component chính - quản lý tabs & state
└── index.less               # Style chính
```

**Đơn giản hóa:**
- ✅ Gộp `PostForm` vào `ManagementPage`
- ✅ Gộp `TagManager` vào `ManagementPage`
- ✅ Chuyển `types.ts` vào `data.ts`
- **Tổng:** Từ 13 file → 7 file (giảm 46%)

## 🔧 Type Definitions

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;           // Markdown content
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
```

### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  color?: string;            // Ant Design color
}
```

### Author
```typescript
interface Author {
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
```

## 🛠️ Các hàm Utility

### helpers.ts

| Hàm | Mô tả |
|-----|-------|
| `debounce()` | Giới hạn tần số gọi hàm (mặc định 300ms) |
| `searchPosts()` | Tìm kiếm bài viết theo keyword |
| `filterByTags()` | Lọc bài viết theo danh sách thẻ |
| `filterByStatus()` | Lọc bài viết theo trạng thái |
| `formatDate()` | Format ngày tháng theo định dạng Việt Nam |
| `getRelatedPosts()` | Lấy bài viết liên quan (cùng thẻ) |
| `generateSlug()` | Tự động sinh slug từ tiêu đề |

## 💾 State Management

Component chính (`index.tsx`) quản lý:
- `posts`: Danh sách bài viết
- `tags`: Danh sách thẻ
- `selectedPostId`: ID bài viết đang xem
- `activeTab`: Tab đang hoạt động

## 📝 Mock Data

File `data.ts` chứa:
- **mockTags**: 6 thẻ mẫu (React, TypeScript, Web Development, Tutorial, Tips & Tricks, Best Practices)
- **mockPosts**: 10 bài viết mẫu
- **mockAuthor**: Thông tin tác giả mẫu

## � Code Quality & Architecture

✅ **Sạch & dễ hiểu**: Chia file theo chức năng, gộp logic liên quan  
✅ **TypeScript**: Đầy đủ type definitions trong `data.ts`  
✅ **Responsive**: Mobile/Tablet/Desktop  
✅ **Performance**: Debounce, useMemo optimization  
✅ **Reusable**: Components độc lập, không phụ thuộc  
✅ **Styled**: LESS + Ant Design theme  

### 📊 Thống kê

| Aspect | Trước | Sau | Giảm |
|--------|-------|-----|------|
| Số file | 13 | 7 | 46% |
| Dòng code | ~800 | ~700 | - |
| Import complexity | Cao | Thấp | ✅ |

### 🏗️ Organization Pattern

```
data.ts
├── Interfaces (BlogPost, Tag, Author...)
└── Mock data (mockPosts, mockTags, mockAuthor)

components/
├── Page-level (HomePage, DetailPage, AboutPage, ManagementPage)
└── Modal/Form logic (embedded trong ManagementPage)

utils/
└── helpers.ts (pure functions: search, filter, format...)

index.tsx
└── State management & routing (tabs)
```

## 🎓 Quick Start cho Người Mới

### 1️⃣ File chính cần biết
- `index.tsx` - **Điểm vào**, quản lý tabs & state
- `data.ts` - **Dữ liệu**, types + mock data
- `components/*.tsx` - **Giao diện**, từng trang
- `utils/helpers.ts` - **Hàm tiện ích**, search/filter/format

### 2️⃣ Tìm hiểu flow

```
┌─────────────────────────────────────────┐
│        index.tsx (State Manager)        │
│  - posts[], tags[], activeTab           │
│  - handleAddPost(), handleViewPost()    │
└──┬──────────────────────────────────────┘
   │
   ├─→ HomePage.tsx (Posts List)
   │   ├─ searchPosts() + filterByTags()  [utils]
   │   └─ Pagination (9 items/page)
   │
   ├─→ DetailPage.tsx (Post Detail)
   │   ├─ formatDate()                    [utils]
   │   └─ getRelatedPosts()               [utils]
   │
   ├─→ AboutPage.tsx (About Author)
   │   └─ Static content from data.ts
   │
   └─→ ManagementPage.tsx (Admin)
       ├─ PostFormContent (thêm/sửa bài)
       ├─ TagManagerContent (quản lý thẻ)
       └─ generateSlug()                  [utils]
```

### 3️⃣ Sửa dữ liệu mẫu

**Thêm bài viết:**
```typescript
// src/pages/TH07/data.ts
export const mockPosts: BlogPost[] = [
  {
    id: '10',
    title: 'Bài viết mới',
    slug: 'bai-viet-moi',
    excerpt: 'Tóm tắt bài viết',
    content: '# Markdown content here',
    imageUrl: 'https://...',
    author: 'Nguyễn Văn A',
    createdAt: '2024-04-21',
    status: 'published',
    tags: [mockTags[0], mockTags[1]], // Link đến thẻ
    // ... fields khác
  },
];
```

**Thêm thẻ:**
```typescript
// src/pages/TH07/data.ts
export const mockTags: Tag[] = [
  { id: '1', name: 'React', color: 'blue' },
  { id: '2', name: 'TypeScript', color: 'cyan' },
  { id: '7', name: 'Thẻ mới', color: 'purple' }, // Thêm ở đây
];
```

### 4️⃣ Chỉnh sửa component

**Thêm nút mới vào HomePage:**
```typescript
// src/pages/TH07/components/HomePage.tsx
<Button onClick={() => console.log('Custom action')}>
  Hành động mới
</Button>
```

**Thay đổi số bài trên trang:**
```typescript
// src/pages/TH07/components/HomePage.tsx
const pageSize = 12; // Thay từ 9 → 12
```

### 1. Truy cập ứng dụng
- Vào menu, chọn "TH07 Blog"

### 2. Xem bài viết
- **Trang chủ**: Duyệt danh sách, tìm kiếm, lọc theo thẻ
- **Chi tiết**: Nhấp "Đọc tiếp" để xem toàn bộ nội dung

### 3. Quản lý bài viết
- **Thêm mới**: Nhấp "Thêm bài viết" → Điền form → "Thêm mới"
- **Sửa**: Nhấp nút Edit trong bảng → Cập nhật form → "Cập nhật"
- **Xóa**: Nhấp nút Delete → Xác nhận → Xóa

### 4. Quản lý thẻ
- Tab "Quản lý thẻ"
- Thêm/sửa/xóa thẻ theo cần

### Markdown Support
Content hỗ trợ:
- Heading: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**`
- *Italic*: `*text*`
- Code inline: `` `code` ``
- Code block: ` ```language ... ``` `
- Links: `[text](url)`
- Lists: `* item`

### Debounce Search
- Tìm kiếm được throttle ở 300ms để tối ưu hiệu suất
- Áp dụng cho tất cả trường search

### Responsive
- Mobile: 1 cột
- Tablet: 2 cột
- Desktop: 3 cột

## 📦 Dependencies

- `react`: UI library
- `typescript`: Type safety
- `antd`: Component library
- `less`: Styling

## 💡 Điểm nhấn

✅ **Clean Code**: Chia file rõ ràng, dễ bảo trì  
✅ **Type-safe**: Đầy đủ TypeScript types  
✅ **Responsive**: Hoạt động tốt trên tất cả thiết bị  
✅ **Reusable**: Components tách biệt, dễ tái sử dụng  
✅ **Performance**: Debounce, memoization  
✅ **User-friendly**: UI/UX trực quan  

## 🔮 Có thể mở rộng

- 💾 Lưu dữ liệu vào localStorage hoặc database
- 🔐 Xác thực người dùng
- 💬 Hệ thống bình luận
- ❤️ Like/favorite bài viết
- 📧 Subscribe newsletter
- 🔍 Full-text search
- 📊 Analytics & statistics
