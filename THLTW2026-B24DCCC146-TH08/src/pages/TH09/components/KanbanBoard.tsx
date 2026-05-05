import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Task, TaskStatus } from '../types';

const { Text } = Typography;

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'To Do', title: 'Cần làm (To Do)' },
  { id: 'In Progress', title: 'Đang làm (In Progress)' },
  { id: 'Done', title: 'Hoàn thành (Done)' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onEdit, onDelete, onDragEnd }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', overflowX: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <div key={column.id} style={{ display: 'flex', flexDirection: 'column', width: '33%', minWidth: '300px' }}>
              <div style={{ 
                background: '#f0f2f5', 
                padding: '10px 20px', 
                borderRadius: '8px 8px 0 0',
                fontWeight: 'bold',
                borderBottom: '2px solid #1890ff'
              }}>
                {column.title} ({columnTasks.length})
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver ? '#e6f7ff' : '#f0f2f5',
                      padding: '10px',
                      minHeight: '500px',
                      borderRadius: '0 0 8px 8px',
                      flexGrow: 1
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              marginBottom: '10px',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card 
                              size="small"
                              style={{ 
                                boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
                                cursor: 'grab' 
                              }}
                              title={task.name}
                              extra={
                                <div>
                                  <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />
                                  <Popconfirm
                                    title="Xóa công việc này?"
                                    onConfirm={() => onDelete(task.id)}
                                    okText="Có"
                                    cancelText="Không"
                                  >
                                    <Button type="text" danger icon={<DeleteOutlined />} />
                                  </Popconfirm>
                                </div>
                              }
                            >
                              <div style={{ marginBottom: '8px' }}>
                                <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                                {task.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                              </div>
                              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                {task.deadline && (
                                  <div>Hạn chót: <Text type={moment(task.deadline).isBefore(moment()) && task.status !== 'Done' ? 'danger' : 'secondary'}>{moment(task.deadline).format('DD/MM/YYYY HH:mm')}</Text></div>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
