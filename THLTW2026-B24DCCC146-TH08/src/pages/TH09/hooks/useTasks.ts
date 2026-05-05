import { useState, useEffect } from 'react';
import { Task } from '../types';
import { message } from 'antd';

const LOCAL_STORAGE_KEY = 'TH09_TASKS';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks from local storage', error);
      message.error('Không thể tải dữ liệu công việc');
    }
  }, []);

  // Save to local storage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to local storage', error);
    }
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    message.success('Thêm công việc thành công');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    message.success('Cập nhật công việc thành công');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    message.success('Xóa công việc thành công');
  };

  const updateTaskStatus = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
};
