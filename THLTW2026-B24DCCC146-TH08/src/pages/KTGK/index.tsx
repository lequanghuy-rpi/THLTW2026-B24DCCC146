import React, { useEffect, useMemo, useState } from 'react';
import { Form, message } from 'antd';
import CourseFilters from './CourseFilters';
import CourseForm from './CourseForm';
import CourseTable from './CourseTable';
import { Course, CourseStatus, SortOrder } from './types';
import { defaultCourses, instructorList } from './data';

const KTGKPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [searchName, setSearchName] = useState('');
  const [instructorFilter, setInstructorFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<CourseStatus | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm<Omit<Course, 'id'>>();

  useEffect(() => {
    const saved = localStorage.getItem('ktgk-courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Course[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
        }
      } catch {
        // ignore invalid localStorage content
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ktgk-courses', JSON.stringify(courses));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchName.trim().toLowerCase();
    return [...courses]
      .filter((course) => {
        const matchName = normalizedSearch
          ? course.name.toLowerCase().includes(normalizedSearch)
          : true;
        const matchInstructor = instructorFilter
          ? course.instructor === instructorFilter
          : true;
        const matchStatus = statusFilter ? course.status === statusFilter : true;
        return matchName && matchInstructor && matchStatus;
      })
      .sort((a, b) => {
        if (!sortOrder || sortOrder === 'vesc') {
          return 0;
        }
        return sortOrder === 'asc'
          ? a.studentCount - b.studentCount
          : b.studentCount - a.studentCount;
      });
  }, [courses, searchName, instructorFilter, statusFilter, sortOrder]);

  const openCreateModal = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    form.resetFields();
  };

  const handleSaveCourse = (values: Omit<Course, 'id'>) => {
    const normalizedName = values.name.trim().toLowerCase();
    const hasDuplicate = courses.some(
      (course) =>
        course.name.trim().toLowerCase() === normalizedName &&
        course.id !== editingCourse?.id,
    );

    if (hasDuplicate) {
      form.setFields([
        {
          name: 'name',
          errors: ['Tên khóa học đã tồn tại, vui lòng chọn tên khác.'],
        },
      ]);
      return;
    }

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id
            ? { ...course, ...values }
            : course,
        ),
      );
      message.success('Cập nhật khóa học thành công.');
    } else {
      const newCourse: Course = {
        id: `KTGK-${Date.now()}`,
        ...values,
      };
      setCourses((prev) => [newCourse, ...prev]);
      message.success('Thêm khóa học mới thành công.');
    }

    closeModal();
  };

  const handleDeleteCourse = (course: Course) => {
    if (course.studentCount > 0) {
      message.warning('Chỉ có thể xóa khóa học chưa có học viên.');
      return;
    }
    setCourses((prev) => prev.filter((item) => item.id !== course.id));
    message.success('Đã xóa khóa học.');
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <h2>Quản lý khóa học trực tuyến</h2>
      <CourseFilters
        searchName={searchName}
        instructorFilter={instructorFilter}
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        instructorList={instructorList}
        onSearchNameChange={setSearchName}
        onInstructorFilterChange={setInstructorFilter}
        onStatusFilterChange={setStatusFilter}
        onSortOrderChange={setSortOrder}
        onOpenCreate={openCreateModal}
      />
      <CourseTable courses={filteredCourses} onEdit={openEditModal} onDelete={handleDeleteCourse} />
      <CourseForm
        visible={isModalVisible}
        form={form}
        editingCourse={editingCourse}
        instructorList={instructorList}
        onClose={closeModal}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default KTGKPage;
