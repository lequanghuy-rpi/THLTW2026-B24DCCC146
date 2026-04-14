export enum CourseStatus {
  DangMo = 'Đang mở',
  DaKetThuc = 'Đã kết thúc',
  TamDung = 'Tạm dừng',
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: CourseStatus;
  descriptionHtml: string;
}

export type SortOrder = 'asc' | 'desc'| 'vesc';
