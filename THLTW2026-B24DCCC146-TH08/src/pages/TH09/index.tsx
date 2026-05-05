import React, { useState } from 'react';
import { Tabs, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DropResult } from 'react-beautiful-dnd';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { useTasks } from './hooks/useTasks';
import { Task, TaskStatus } from './types';

const { Title } = Typography;
const { TabPane } = Tabs;

const TH09App: React.FC = () => {
  const { tasks, setTasks, addTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    handleCloseModal();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    if (destination.droppableId !== source.droppableId) {
      updateTaskStatus(draggableId, destination.droppableId as TaskStatus);
    } else {
      const newTasks = Array.from(tasks);
      const sourceColTasks = newTasks.filter(t => t.status === source.droppableId);
      const [removed] = sourceColTasks.splice(source.index, 1);
      sourceColTasks.splice(destination.index, 0, removed);
      
      const otherTasks = newTasks.filter(t => t.status !== source.droppableId);
      setTasks([...otherTasks, ...sourceColTasks]);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý công việc cá nhân</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm công việc
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="Dashboard" key="dashboard">
          <Dashboard tasks={tasks} />
        </TabPane>
        <TabPane tab="Kanban Board" key="kanban">
          <KanbanBoard 
            tasks={tasks} 
            onEdit={handleOpenModal} 
            onDelete={deleteTask} 
            onDragEnd={onDragEnd} 
          />
        </TabPane>
        <TabPane tab="Danh sách" key="list">
          <TaskList 
            tasks={tasks} 
            onEdit={handleOpenModal} 
            onDelete={deleteTask} 
          />
        </TabPane>
      </Tabs>

      <TaskModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
};

export default TH09App;
