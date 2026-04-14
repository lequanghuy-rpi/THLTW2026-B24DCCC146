import { Course, CourseStatus } from './types';

export const instructorList: string[] = [
  'Phan Quang Thành',
  'Trần Minh Hiếu',
  'Nguyễn Xuân Phương',
  'Nguyễn Mạnh Dũng',
];

export const defaultCourses: Course[] = [
  {
    id: 'KTGK-001',
    name: 'Lập trình React cơ bản',
    instructor: 'Phan Quang Thành',
    studentCount: 12,
    status: CourseStatus.DangMo,
    descriptionHtml: '<p>Khóa học giới thiệu cách xây dựng giao diện với React và Ant Design.</p>',
  },
  {
    id: 'KTGK-002',
    name: 'Thiết kế Web với HTML/CSS',
    instructor: 'Trần Minh Hiếu',
    studentCount: 0,
    status: CourseStatus.TamDung,
    descriptionHtml: '<p>Khóa học dành cho người mới bắt đầu làm quen với HTML và CSS.</p>',
  },
  {
    id: 'KTGK-003',
    name: 'Quản lý dữ liệu với TypeScript',
    instructor: 'Nguyễn Xuân Phương',
    studentCount: 18,
    status: CourseStatus.DaKetThuc,
    descriptionHtml: '<p>Khóa học giúp bạn hiểu rõ TypeScript và áp dụng trong ứng dụng thực tế.</p>',
  },
];
