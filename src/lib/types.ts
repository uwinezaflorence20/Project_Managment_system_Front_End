export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  order: number;
  columnId: string;
  boardId: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  columns?: BoardColumn[];
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  projectCount: number;
  completedTasks: number;
  pendingTasks: number;
  recentProjects: Board[];
}

export interface ApiErrorBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}
