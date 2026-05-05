export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
}
